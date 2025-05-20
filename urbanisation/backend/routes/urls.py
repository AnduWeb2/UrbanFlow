from . import views
from django.urls import path

urlpatterns = [
   path("add-favorite/", views.addFavorite),
   path("get-favorites/", views.getFavorites),
   path("delete-favorite/<int:route_id>/", views.deleteFavorite),
]