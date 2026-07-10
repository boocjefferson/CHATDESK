from rest_framework import serializers
from .models import Faq


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = ["faq_id", "user", "intent_keyword", "question_text",
                  "answer_content", "category", "created_at", "updated_at", "updated_by"]
        read_only_fields = ["faq_id", "created_at", "updated_at", "updated_by", "user"]