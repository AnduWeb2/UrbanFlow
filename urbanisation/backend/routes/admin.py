from django.contrib import admin
from .models import FavoriteRoute


class FavoriteRouteAdmin(admin.ModelAdmin):
    list_display = ('route_id', 'route_name', 'user', 'created_at')
    search_fields = ('route_name', 'user__username')
# Register your models here.
admin.site.register(FavoriteRoute, FavoriteRouteAdmin)