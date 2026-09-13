from rest_framework import serializers

from offices.models import Office

from .models import Faq


class FaqSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source="user", read_only=True)
    office = serializers.PrimaryKeyRelatedField(
        queryset=Office.objects.all(), required=False, allow_null=True
    )
    office_name = serializers.CharField(source="office.name", read_only=True, default=None)

    class Meta:
        model = Faq
        fields = ["faq_id", "user_id", "intent_keyword", "question_text",
                  "answer_content", "category", "office", "office_name",
                  "created_at", "updated_at", "updated_by"]
        read_only_fields = ["faq_id", "created_at", "updated_at", "updated_by", "user_id"]
