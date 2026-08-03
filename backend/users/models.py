from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from .managers import UserManager


class User(AbstractUser):
    """
    tbl_user - extends AbstractUser, keyed by email instead of username.

    Field set matches claude/API_CONTRACT.md exactly: user_id, email, first_name,
    last_name, role, course (nullable for admin), school_id (nullable for admin),
    created_at.
    """

    class Role(models.TextChoices):
        STUDENT = "student", "Student"
        ADMIN = "admin", "Admin"

    # USTP course codes - see conversation with Jefferson, adjust list as the
    # school's official program list is confirmed.
    class Course(models.TextChoices):
        BSIT = "BSIT", "BS Information Technology"
        BSCS = "BSCS", "BS Computer Science"
        BSN = "BSN", "BS Nursing"
        BSBA = "BSBA", "BS Business Administration"
        BSED = "BSED", "BS Secondary Education"
        BSA = "BSA", "BS Accountancy"
        BSCE = "BSCE", "BS Civil Engineering"
        BSEE = "BSEE", "BS Electrical Engineering"

    username = None
    date_joined = None

    user_id = models.BigAutoField(primary_key=True)
    email = models.EmailField("email address", unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
    course = models.CharField(
        max_length=10, choices=Course.choices, null=True, blank=True
    )
    school_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    class Meta:
        db_table = "tbl_user"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.email} ({self.role})"


class PasswordResetCode(models.Model):
    """
    tbl_password_reset_code - short-lived 6-digit OTP emailed to a user for
    the mobile "Forgot Password" flow. code_hash is hashed the same way as
    User.password (django.contrib.auth.hashers) so the raw code is never
    stored at rest.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="password_reset_codes")
    code_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = "tbl_password_reset_code"

    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()
