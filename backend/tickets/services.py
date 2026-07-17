from .models import Ticket


def create_ticket_from_log(log):
    return Ticket.objects.create(
        user=log.user,
        log=log,
        subject_category="Unresolved Inquiry",
        issue_description=f'Student asked: "{log.user_message}" - AI could not resolve.',
        status=Ticket.Status.PENDING,
    )