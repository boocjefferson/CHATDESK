from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Read-only user profile shape, per claude/API_CONTRACT.md. is_active and
    last_login are included for the admin User Management screen; last_login
    is stamped via update_last_login() below on every successful JWT login."""

    class Meta:
        model = User
        fields = [
            "user_id",
            "email",
            "first_name",
            "last_name",
            "role",
            "course",
            "school_id",
            "is_active",
            "last_login",
            "created_at",
        ]
        read_only_fields = fields


def _tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


class RegisterSerializer(serializers.ModelSerializer):
    """
    POST /api/v1/auth/register/ - public, student accounts only.
    Admin accounts are created manually via `manage.py createsuperuser`.
    """

    password = serializers.CharField(write_only=True, min_length=8)
    course = serializers.ChoiceField(choices=User.Course.choices)
    school_id = serializers.CharField(max_length=20)

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name", "course", "school_id"]

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_school_id(self, value):
        value = value.strip()
        if User.objects.filter(school_id__iexact=value).exists():
            raise serializers.ValidationError("An account with this School ID already exists.")
        return value

    def create(self, validated_data):
        validated_data["role"] = User.Role.STUDENT
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def to_representation(self, instance):
        return {"user": UserSerializer(instance).data, **_tokens_for_user(instance)}


class LoginSerializer(serializers.Serializer):
    """POST /api/v1/auth/login/ - public. Same response shape as register."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs["email"].lower().strip()
        user = authenticate(
            request=self.context.get("request"),
            username=email,
            password=attrs["password"],
        )
        if user is None:
            # Django's ModelBackend already refuses to authenticate an
            # inactive user (returns None before we'd ever see it), so the
            # only way to tell "wrong credentials" apart from "correct
            # credentials but deactivated" is to re-check the password by
            # hand here - looking up by email alone would let someone probe
            # whether an account is deactivated without knowing its password.
            existing = User.objects.filter(email__iexact=email).first()
            if existing and existing.check_password(attrs["password"]) and not existing.is_active:
                raise serializers.ValidationError("This account has been deactivated.")
            raise serializers.ValidationError("Invalid email or password.")
        update_last_login(None, user)
        attrs["user"] = user
        return attrs

    def to_representation(self, instance):
        user = instance["user"]
        return {"user": UserSerializer(user).data, **_tokens_for_user(user)}


class PasswordResetRequestSerializer(serializers.Serializer):
    """POST /api/v1/auth/password-reset/request/ - public."""

    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower().strip()


class PasswordResetConfirmSerializer(serializers.Serializer):
    """POST /api/v1/auth/password-reset/confirm/ - public."""

    email = serializers.EmailField()
    code = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        return value.lower().strip()

    def validate_new_password(self, value):
        validate_password(value)
        return value


class UserAdminUpdateSerializer(serializers.ModelSerializer):
    """PATCH /api/v1/users/{id}/ - admin only. Role/status/profile edits;
    email and password are out of scope here (see users/views.py for the
    self-protection guards against locking the acting admin out)."""

    class Meta:
        model = User
        fields = ["first_name", "last_name", "role", "course", "school_id", "is_active"]


class UserCreateSerializer(serializers.ModelSerializer):
    """POST /api/v1/users/ - admin only. Unlike self-registration, the admin
    picks the role directly (student or admin)."""

    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.STUDENT)

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name", "role", "course", "school_id"]

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_school_id(self, value):
        if not value:
            return value
        value = value.strip()
        if User.objects.filter(school_id__iexact=value).exists():
            raise serializers.ValidationError("An account with this School ID already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        if validated_data.get("role") == User.Role.ADMIN:
            validated_data["is_staff"] = True
            validated_data["is_superuser"] = True
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
