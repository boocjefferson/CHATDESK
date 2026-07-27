from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .permissions import IsAdmin
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserAdminUpdateSerializer,
    UserCreateSerializer,
    UserSerializer,
)


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
