from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsAdmin, IsStudent

from .models import InquiryLog
from .serializers import ChatAskSerializer, InquiryLogSerializer
from .services import classify_message


class ChatAskView(APIView):
    """POST /api/v1/chat/ask/ - student only. Logs every interaction and
    escalates to a ticket when the classifier can't resolve the intent."""

    permission_classes = [IsStudent]

    def post(self, request):
        serializer = ChatAskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.validated_data["message"]

        result = classify_message(message)

        log = InquiryLog.objects.create(
            user=request.user,
            user_message=message,
            detected_intent=result["detected_intent"],
            chatbot_response=result["reply"],
            is_escalated=result["detected_intent"] == "unresolved_complex_query",
        )

        payload = {
            "log_id": log.log_id,
            "detected_intent": log.detected_intent,
            "reply": log.chatbot_response,
            "is_escalated": log.is_escalated,
        }

        if log.is_escalated:
            try:
                from tickets.services import create_ticket_from_log
            except ImportError:
                # tickets app lands in feature/ticket-escalation-logic - log is still recorded
                return Response(payload, status=status.HTTP_201_CREATED)
            ticket = create_ticket_from_log(log)
            payload["ticket_id"] = ticket.ticket_id
            return Response(payload, status=status.HTTP_201_CREATED)

        return Response(payload, status=status.HTTP_200_OK)


class InquiryLogListView(generics.ListAPIView):
    """GET /api/v1/inquiry-logs/ - admin only. Raw logs for system analytics."""

    queryset = InquiryLog.objects.all()
    serializer_class = InquiryLogSerializer
    permission_classes = [IsAdmin]