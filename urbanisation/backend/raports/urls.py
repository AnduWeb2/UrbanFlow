from . import views
from django.urls import path

urlpatterns = [
    path("add/", views.AddRouteReport),
    path("get/", views.getReports),
    path("get/<int:report_id>/", views.getReportById),
    path("close/<int:report_id>/", views.closeReport),
]
