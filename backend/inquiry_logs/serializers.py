from rest_framework import serializers

from .models import InquiryLog


class InquiryLogSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source="user", read_only=True)

    class Meta:
        model = InquiryLog
        fields = [
            "log_id", "user_id", "user_message", "detected_intent",
            "chatbot_response", "is_escalated", "timestamp",
        ]
        read_only_fields = fields


class ChatAskSerializer(serializers.Serializer):
    message = serializers.CharField(allow_blank=False, trim_whitespace=True)