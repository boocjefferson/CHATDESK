from django.urls import path
from .views import FaqDetailView, FaqListCreateView

urlpatterns = [
    path("", FaqListCreateView.as_view(), name="faq-list-create"),
    path("<int:faq_id>/", FaqDetailView.as_view(), name="faq-detail"),
]