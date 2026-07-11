from django.shortcuts import render

# Create your views here.
from django.utils import timezone
from rest_framework import generics, permissions, status as http_status
from rest_framework.response import Response

from users.permissions import IsAdmin, IsStudent

from .models import Ticket
from .serializers import TicketCreateSerializer, TicketSerializer, TicketUpdateSerializer


class TicketListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/v1/tickets/ - admin: all tickets (?status=, ?category= filters).
                            student: own tickets only.
    POST /api/v1/tickets/ - student only, manual creation bypassing the AI.
    """

    def get_queryset(self):
        user = self.request.user
        qs = Ticket.objects.all()

        if user.role == user.Role.ADMIN:
            status_param = self.request.query_params.get("status")
            category_param = self.request.query_params.get("category")
            if status_param:
                qs = qs.filter(status=status_param)
            if category_param:
                qs = qs.filter(subject_category=category_param)
            return qs

        # Students always see only their own tickets - ownership is enforced
        # server-side, not trusted from the ?creator=me query param.
        return qs.filter(user=user)

    def get_serializer_class(self):
        return TicketCreateSerializer if self.request.method == "POST" else TicketSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsStudent()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save()
        return Response(TicketSerializer(ticket).data, status=http_status.HTTP_201_CREATED)


class TicketDetailView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/v1/tickets/{ticket_id}/ - all roles; students restricted to their own.
    PATCH /api/v1/tickets/{ticket_id}/ - admin only.
    """

    lookup_url_kwarg = "ticket_id"

    def get_queryset(self):
        user = self.request.user
        if user.role == user.Role.ADMIN:
            return Ticket.objects.all()
        return Ticket.objects.filter(user=user)

    def get_serializer_class(self):
        return TicketUpdateSerializer if self.request.method == "PATCH" else TicketSerializer

    def get_permissions(self):
        if self.request.method == "PATCH":
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_update(self, serializer):
        ticket = self.get_object()
        extra = {}
        if ticket.resolved_by_id is None:
            extra["resolved_by"] = self.request.user
        if serializer.validated_data.get("status") == Ticket.Status.RESOLVED:
            extra["resolved_at"] = timezone.now()
        serializer.save(**extra)