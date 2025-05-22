from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import MyTokenObtainPairView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('citizen/login/', views.CitzenLogin),
    path('citzen/signup/', views.CitzenRegister),
    path('staff/login/', views.loginStaffUser),
    path('staff/signup/', views.registerStaffUser),
    path('add_points/', views.add_points),
    path('get_points/', views.getPoints),
    path('get_userNumber/', views.getUserNumber),
]