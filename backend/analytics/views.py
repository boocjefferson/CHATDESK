from django.db.models import Count
from rest_framework.response import Response
from rest_framework.views import APIView

from inquiry_logs.models import InquiryLog
from tickets.models import Ticket
from users.permissions import IsAdmin


class AnalyticsOverviewView(APIView):
    """GET /api/v1/analytics/overview/ - admin only.
    Optional ?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD to scope the range."""

    permission_classes = [IsAdmin]

    def get(self, request):
        logs = InquiryLog.objects.all()
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

        tickets = Ticket.objects.all()
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