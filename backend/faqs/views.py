from django.db.models import Q
from rest_framework import generics
from .models import Faq
from .permissions import IsAdminOrReadOnly
from .serializers import FaqSerializer


class FaqListCreateView(generics.ListCreateAPIView):
    """?search= matches question_text or intent_keyword. ?category=,
    ?office= filter exactly. All combine with AND; paginated per
    settings.REST_FRAMEWORK PAGE_SIZE."""

    serializer_class = FaqSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Faq.objects.all().order_by("-created_at")
        user = self.request.user
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(Q(question_text__icontains=search) | Q(intent_keyword__icontains=search))

        # Office Admins only ever see their own office's FAQs - the ?office=
        # param is for Super Admin filtering and is ignored for them.
        if user.is_authenticated and user.role == user.Role.OFFICE_ADMIN:
            return qs.filter(office=user.office)
        office = self.request.query_params.get("office")
        if office:
            qs = qs.filter(office_id=office)
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        extra = {"user": user, "updated_by": user}
        if user.role == user.Role.OFFICE_ADMIN:
            # Force-assigned, not client-supplied - an Office Admin can only
            # ever create FAQs for their own office.
            extra["office"] = user.office
        serializer.save(**extra)


class FaqDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FaqSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "faq_id"

    def get_queryset(self):
        qs = Faq.objects.all()
        user = self.request.user
        if user.is_authenticated and user.role == user.Role.OFFICE_ADMIN:
            return qs.filter(office=user.office)
        return qs

    def perform_update(self, serializer):
        user = self.request.user
        extra = {"updated_by": user}
        if user.role == user.Role.OFFICE_ADMIN:
            extra["office"] = user.office
        serializer.save(**extra)