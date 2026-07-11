from django.urls import path

from .views import TicketDetailView, TicketListCreateView

urlpatterns = [
    path("tickets/", TicketListCreateView.as_view(), name="ticket-list-create"),
    path("tickets/<int:ticket_id>/", TicketDetailView.as_view(), name="ticket-detail"),
]