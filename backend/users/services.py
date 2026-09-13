import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.utils import timezone

from .models import EmailVerificationToken

EMAIL_VERIFICATION_TOKEN_LIFETIME = timedelta(hours=24)


def send_verification_email(user, request):
    """
    Creates an EmailVerificationToken for `user` and emails a clickable
    verification link. Returns the raw verify URL when real email isn't
    configured yet (REAL_EMAIL_ENABLED False) so RegisterSerializer can
    surface it in the response instead - same dev-fallback pattern as
    PasswordResetRequestView's dev_code. Returns None once real email sends.
    """
    raw_token = secrets.token_urlsafe(32)
    EmailVerificationToken.objects.create(
        user=user,
        token_hash=make_password(raw_token),
        expires_at=timezone.now() + EMAIL_VERIFICATION_TOKEN_LIFETIME,
    )

    verify_path = f"/api/v1/auth/verify-email/{user.user_id}/{raw_token}/"
    verify_url = request.build_absolute_uri(verify_path) if request else verify_path

    if settings.REAL_EMAIL_ENABLED:
        send_mail(
            subject="Verify your ChatDesk email address",
            message=(
                f"Hi {user.first_name},\n\n"
                "Thanks for registering for ChatDesk. Please verify your email "
                f"address by clicking the link below:\n\n{verify_url}\n\n"
                "This link expires in 24 hours. If you didn't create this "
                "account, you can ignore this email."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return None

    return verify_url
