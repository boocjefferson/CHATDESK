from rest_framework import serializers

from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source="user", read_only=True)
    log_id = serializers.PrimaryKeyRelatedField(source="log", read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "ticket_id", "user_id", "resolved_by", "log_id", "subject_category",
            "issue_description", "status", "resolution", "created_at", "resolved_at",
        ]
        read_only_fields = ["ticket_id", "user_id", "log_id", "resolved_by", "created_at", "resolved_at"]


class TicketCreateSerializer(serializers.ModelSerializer):
    """POST /api/v1/tickets/ - student manual creation, bypassing the AI."""

    class Meta:
        model = Ticket
        fields = ["subject_category", "issue_description"]

    def create(self, validated_data):
        request = self.context["request"]
        return Ticket.objects.create(user=request.user, **validated_data)


class TicketUpdateSerializer(serializers.ModelSerializer):
    """PATCH /api/v1/tickets/{id}/ - admin only. Status and resolution text;
    resolved_by and resolved_at are set server-side in the view, not accepted
    as input."""

    class Meta:
        model = Ticket
        fields = ["status", "resolution"]