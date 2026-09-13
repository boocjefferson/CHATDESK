from django.db import models


class Office(models.Model):
    """
    tbl_office - the routing/categorization unit for FAQs and Tickets
    (OSA, Registrar, individual colleges, etc). Kept as an admin-managed
    table rather than a hardcoded TextChoices list, since USTP's colleges
    and departments aren't a fixed, universally-known set the way the six
    named student-affairs-adjacent offices are - Super Admin adds/edits
    those through the Offices admin page rather than a code change.
    """

    office_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tbl_office"
        ordering = ["name"]

    def __str__(self):
        return self.name
