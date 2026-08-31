import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PasswordResetCode, User
from .permissions import IsAdmin
from .serializers import (
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserAdminUpdateSerializer,
    UserCreateSerializer,
    UserSerializer,
)

RESET_CODE_LIFETIME = timedelta(minutes=10)
RESET_CODE_COOLDOWN = timedelta(seconds=60)
GENERIC_REQUEST_MESSAGE = "If that email is registered, a password reset code has been sent."


class RegisterView(generics.CreateAPIView):
    """POST /api/v1/auth/register/ - public. Creates a student account."""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(RegisterSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """POST /api/v1/auth/login/ - public."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """POST /api/v1/auth/logout/ - auth required. Blacklists the refresh token."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {
                    "error": "validation_error",
                    "message": "Invalid request parameters.",
                    "details": {"refresh": ["This field is required."]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {
                    "error": "validation_error",
                    "message": "Invalid or expired refresh token.",
                    "details": {},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_205_RESET_CONTENT)


class MeView(generics.RetrieveAPIView):
    """GET /api/v1/auth/me/ - auth required. Returns the current user's profile."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class PasswordResetRequestView(APIView):
    """
    POST /api/v1/auth/password-reset/request/ - public. Mobile "Forgot
    Password" step 1. Always returns the same generic message regardless of
    whether the email is registered, active, or was just sent a code
    seconds ago - the response can't be used to probe account existence.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        response_data = {"message": GENERIC_REQUEST_MESSAGE}

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user:
            recent_code = user.password_reset_codes.filter(
                created_at__gt=timezone.now() - RESET_CODE_COOLDOWN
            ).exists()
            if not recent_code:
                raw_code = f"{secrets.randbelow(1_000_000):06d}"
                PasswordResetCode.objects.create(
                    user=user,
                    code_hash=make_password(raw_code),
                    expires_at=timezone.now() + RESET_CODE_LIFETIME,
                )
                if settings.PASSWORD_RESET_EMAIL_ENABLED:
                    send_mail(
                        subject="ChatDesk password reset code",
                        message=(
                            f"Your ChatDesk password reset code is {raw_code}.\n\n"
                            "This code expires in 10 minutes. If you didn't request this, "
                            "you can ignore this email."
                        ),
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False,
                    )
                else:
                    # Dev-only fallback: no real Gmail App Password is
                    # configured yet (backend/.env EMAIL_HOST_PASSWORD), so
                    # the code can't actually be emailed. Return it directly
                    # instead of failing the request. Remove dev_code once
                    # PASSWORD_RESET_EMAIL_ENABLED is true for real.
                    response_data["dev_code"] = raw_code

        return Response(response_data, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    """POST /api/v1/auth/password-reset/confirm/ - public. Mobile "Forgot
    Password" step 2: verify the emailed code and set a new password."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]
        new_password = serializer.validated_data["new_password"]

        error_response = Response(
            {
                "error": "validation_error",
                "message": "Invalid request parameters.",
                "details": {"code": ["Invalid or expired code."]},
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if not user:
            return error_response

        matching_code = next(
            (
                reset_code
                for reset_code in user.password_reset_codes.filter(
                    is_used=False, expires_at__gt=timezone.now()
                ).order_by("-created_at")
                if check_password(code, reset_code.code_hash)
            ),
            None,
        )
        if not matching_code:
            return error_response

        user.set_password(new_password)
        user.save(update_fields=["password"])
        user.password_reset_codes.filter(is_used=False).update(is_used=True)

        return Response(
            {"message": "Password has been reset. You can now log in."},
            status=status.HTTP_200_OK,
        )


class UserListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/v1/users/ - admin only. User Management screen.
         ?search= matches first/last name or email. ?role=student|admin.
         ?status=active|inactive.
    POST /api/v1/users/ - admin only. Creates a student or admin account
         directly (unlike /auth/register/, the admin picks the role).
    """

    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = User.objects.all().order_by("first_name", "last_name")
        search = self.request.query_params.get("search")
        role = self.request.query_params.get("role")
        status_param = self.request.query_params.get("status")

        if search:
            qs = qs.filter(
                Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(email__icontains=search)
            )
        if role:
            qs = qs.filter(role=role)
        if status_param == "active":
            qs = qs.filter(is_active=True)
        elif status_param == "inactive":
            qs = qs.filter(is_active=False)
        return qs

    def get_serializer_class(self):
        return UserCreateSerializer if self.request.method == "POST" else UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/v1/users/{user_id}/ - admin only.
    PATCH  /api/v1/users/{user_id}/ - admin only. An admin can't deactivate
           or demote their own account (avoids self-lockout mid-session).
    DELETE /api/v1/users/{user_id}/ - admin only. An admin can't delete
           their own account.
    """

    queryset = User.objects.all()
    lookup_url_kwarg = "user_id"
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        return UserAdminUpdateSerializer if self.request.method == "PATCH" else UserSerializer

    def perform_update(self, serializer):
        target = self.get_object()
        if target.pk == self.request.user.pk:
            if serializer.validated_data.get("is_active") is False:
                raise PermissionDenied("You can't deactivate your own account.")
            new_role = serializer.validated_data.get("role")
            if new_role and new_role != User.Role.ADMIN:
                raise PermissionDenied("You can't change your own role.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.pk == self.request.user.pk:
            raise PermissionDenied("You can't delete your own account.")
        instance.delete()
