from django.db.models import Count
from rest_framework.response import Response
from rest_framework.views import APIView

from inquiry_logs.models import InquiryLog
from tickets.models import Ticket
from users.permissions import IsOfficeStaff


class AnalyticsOverviewView(APIView):
    """GET /api/v1/analytics/overview/ - superadmin or office_admin.
    Office Admins see only their own office's slice (tickets assigned to
    their office, and inquiry logs that escalated into one of those
    tickets - logs the chatbot resolved on its own were never routed to any
    office, so they aren't attributable to one).
    Optional ?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD to scope the range."""

    permission_classes = [IsOfficeStaff]

    def get(self, request):
        user = request.user
        logs = InquiryLog.objects.all()
        tickets_base = Ticket.objects.all()
        if user.role == user.Role.OFFICE_ADMIN:
            logs = logs.filter(ticket__office=user.office)
            tickets_base = tickets_base.filter(office=user.office)

        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        if date_from:
            logs = logs.filter(timestamp__date__gte=date_from)
        if date_to:
            logs = logs.filter(timestamp__date__lte=date_to)

        intent_frequencies = [
            {"intent": row["detected_intent"], "count": row["count"]}
            for row in logs.values("detected_intent")
                          .annotate(count=Count("detected_intent"))
                          .order_by("-count")
        ]

        tickets = tickets_base
        if date_from:
            tickets = tickets.filter(created_at__date__gte=date_from)
        if date_to:
            tickets = tickets.filter(created_at__date__lte=date_to)
        tickets_by_status = {
            value: tickets.filter(status=value).count()
            for value, _ in Ticket.Status.choices
        }
        total_tickets = tickets.count()
        resolved = tickets_by_status.get(Ticket.Status.RESOLVED, 0)
        resolution_rate = round(resolved / total_tickets, 2) if total_tickets else 0.0

        return Response({
            "total_inquiries": logs.count(),
            "total_escalations": logs.filter(is_escalated=True).count(),
            "resolution_rate": resolution_rate,
            "intent_frequencies": intent_frequencies,
            "tickets_by_status": tickets_by_status,
        })