from rest_framework import serializers
from .models import Faq


class FaqSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source="user", read_only=True)

    class Meta:
        model = Faq
        fields = ["faq_id", "user_id", "intent_keyword", "question_text",
                  "answer_content", "category", "created_at", "updated_at", "updated_by"]
        read_only_fields = ["faq_id", "created_at", "updated_at", "updated_by", "user_id"]