from django.conf import settings
from django.db import models


class Faq(models.Model):
    class Category(models.TextChoices):
        ENROLLMENT = "Enrollment", "Enrollment"
        SCHOLARSHIP = "Scholarship", "Scholarship"
        CLEARANCE = "Clearance", "Clearance"
        DISCIPLINE = "Discipline", "Discipline"
        GENERAL = "General", "General"

    faq_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name="created_faqs", db_column="user_id",
    )
    intent_keyword = models.CharField(max_length=100)
    question_text = models.TextField()
    answer_content = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name="edited_faqs",
    )

    class Meta:
        db_table = "tbl_faqs"

    def __str__(self):
        return self.intent_keyword