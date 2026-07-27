from rest_framework import serializers

from .models import SchoolPhase


class SchoolPhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolPhase
        fields = [
            "phase_id", "name", "start_date", "end_date",
            "guidance_message", "suggested_questions",
        ]
        read_only_fields = ["phase_id"]