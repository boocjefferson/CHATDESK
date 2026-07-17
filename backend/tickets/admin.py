from django.contrib import admin

from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("ticket_id", "user", "status", "resolved_by", "created_at")
    list_filter = ("status", "subject_category")