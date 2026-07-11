from django.conf import settings
from django.db import models


class InquiryLog(models.Model):
    log_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="inquiry_logs"
    )
    user_message = models.TextField()
    detected_intent = models.CharField(max_length=100)
    chatbot_response = models.TextField()
    is_escalated = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tbl_inquiry_logs"
        ordering = ["-timestamp"]

    def __str__(self):
        return f"Log {self.log_id} ({self.detected_intent})"