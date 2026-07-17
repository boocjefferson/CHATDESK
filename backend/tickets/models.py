from django.conf import settings
from django.db import models

from inquiry_logs.models import InquiryLog


class Ticket(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACTIVE = "active", "Active"
        RESOLVED = "resolved", "Resolved"

    ticket_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tickets"
    )
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="resolved_tickets",
    )
    # Nullable: auto-escalated tickets always get one (create_ticket_from_log below);
    # manual tickets (POST bypassing the AI) have no dialogue turn to link to.
    log = models.OneToOneField(
        InquiryLog, on_delete=models.CASCADE, null=True, blank=True, related_name="ticket"
    )
    subject_category = models.CharField(max_length=100)
    issue_description = models.TextField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "tbl_ticket"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Ticket {self.ticket_id} ({self.status})"