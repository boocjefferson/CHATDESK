from datetime import date

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SchoolPhase
from .permissions import IsAdminOrReadOnly
from .serializers import SchoolPhaseSerializer


class SchoolPhaseListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/v1/phases/ - all authenticated users can read, admin-only writes."""

    queryset = SchoolPhase.objects.all()
    serializer_class = SchoolPhaseSerializer
    permission_classes = [IsAdminOrReadOnly]


class SchoolPhaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/v1/phases/{phase_id}/"""

    queryset = SchoolPhase.objects.all()
    serializer_class = SchoolPhaseSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_url_kwarg = "phase_id"


class CurrentPhaseView(APIView):
    """GET /api/v1/phases/current/ - the active phase for today, or an empty
    fallback if no phase is currently defined."""

    def get(self, request):
        today = date.today()
        phase = SchoolPhase.objects.filter(
            start_date__lte=today, end_date__gte=today
        ).first()
        if phase is None:
            return Response({
                "phase_id": None,
                "name": None,
                "guidance_message": "",
                "suggested_questions": [],
            })
        return Response(SchoolPhaseSerializer(phase).data)