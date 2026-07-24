from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Read-only user profile shape, per claude/API_CONTRACT.md."""

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
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["email"].lower().strip(),
            password=attrs["password"],
        )
        if user is None:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account has been deactivated.")
        attrs["user"] = user
        return attrs

    def to_representation(self, instance):
        user = instance["user"]
        return {"user": UserSerializer(user).data, **_tokens_for_user(user)}
