from django.urls import path

from .views import ChatAskView, InquiryLogListView

urlpatterns = [
    path("chat/ask/", ChatAskView.as_view(), name="chat-ask"),
    path("inquiry-logs/", InquiryLogListView.as_view(), name="inquiry-log-list"),
]