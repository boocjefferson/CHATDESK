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

    def validate(self, attrs):
        start_date = attrs.get("start_date", getattr(self.instance, "start_date", None))
        end_date = attrs.get("end_date", getattr(self.instance, "end_date", None))

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {"end_date": ["end_date must be on or after start_date."]}
            )

        # CurrentPhaseView resolves "today's phase" with an unordered
        # .first() - if two phases' date ranges overlapped, which one wins
        # would be undefined. Block the overlap at write time instead.
        overlapping = SchoolPhase.objects.filter(
            start_date__lte=end_date, end_date__gte=start_date
        )
        if self.instance is not None:
            overlapping = overlapping.exclude(pk=self.instance.pk)
        conflict = overlapping.first()
        if conflict:
            raise serializers.ValidationError(
                {
                    "start_date": [
                        f"Overlaps with existing phase \"{conflict.name}\" "
                        f"({conflict.start_date} - {conflict.end_date})."
                    ]
                }
            )

        return attrs