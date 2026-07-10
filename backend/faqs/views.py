from rest_framework import generics
from .models import Faq
from .permissions import IsAdminOrReadOnly
from .serializers import FaqSerializer


class FaqListCreateView(generics.ListCreateAPIView):
    serializer_class = FaqSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Faq.objects.all().order_by("-created_at")
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, updated_by=self.request.user)


class FaqDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Faq.objects.all()
    serializer_class = FaqSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "faq_id"

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)