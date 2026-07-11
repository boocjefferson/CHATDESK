from django.contrib import admin

from .models import InquiryLog


@admin.register(InquiryLog)
class InquiryLogAdmin(admin.ModelAdmin):
    list_display = ("log_id", "user", "detected_intent", "is_escalated", "timestamp")
    list_filter = ("is_escalated", "detected_intent")
    search_fields = ("user_message", "chatbot_response")