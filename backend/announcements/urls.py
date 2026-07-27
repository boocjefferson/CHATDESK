from django.urls import path

from .views import AnnouncementDetailView, AnnouncementListCreateView

urlpatterns = [
    path("announcements/", AnnouncementListCreateView.as_view(), name="announcement-list-create"),
    path("announcements/<int:announcement_id>/", AnnouncementDetailView.as_view(), name="announcement-detail"),
]