from django.db import models


class SchoolPhase(models.Model):
    phase_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)  # e.g. "Enrollment Period"
    start_date = models.DateField()
    end_date = models.DateField()
    guidance_message = models.TextField(blank=True)
    # List of quick-suggestion strings shown in the chat UI during this phase.
    suggested_questions = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = "tbl_school_phase"
        ordering = ["start_date"]

    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"