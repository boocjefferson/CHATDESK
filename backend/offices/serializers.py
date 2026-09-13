from rest_framework import serializers

from .models import Office


class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ["office_id", "name", "created_at"]
        read_only_fields = ["office_id", "created_at"]
