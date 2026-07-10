from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth endpoints per claude/API_CONTRACT.md: register, login, token/refresh, logout, me.
    path("api/v1/auth/", include("users.urls")),
    # FAQ, chat, and ticket endpoints are built in later feature branches
    # (feature/faq-api-endpoints, feature/ticket-escalation-logic) - not Sprint 1 scope here.
    path("api/v1/faqs/", include("faqs.urls")),
]
