from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
            and request.user.role == request.user.Role.STUDENT
        )


class IsAdmin(BasePermission):
    """Named IsAdmin for historical reasons - actually gates on the
    Super Admin role, the only privileged web-dashboard tier."""

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
            and request.user.role == request.user.Role.SUPERADMIN
        )