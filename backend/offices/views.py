from rest_framework import generics

from .models import Office
from .permissions import IsAdminOrReadOnly
from .serializers import OfficeSerializer


class OfficeListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/v1/offices/ - all authenticated users can read
    (needed so FAQ/Ticket filter dropdowns work), Super Admin-only writes."""

    queryset = Office.objects.all()
    serializer_class = OfficeSerializer
    permission_classes = [IsAdminOrReadOnly]


class OfficeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/v1/offices/{office_id}/"""

    queryset = Office.objects.all()
    serializer_class = OfficeSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_url_kwarg = "office_id"
