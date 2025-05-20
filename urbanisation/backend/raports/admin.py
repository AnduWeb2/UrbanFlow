from django.contrib import admin
from .models import RouteReport
# Register your models here.
class RouteReportAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'route_name', 'report_title', 'created_at', 'status')
    search_fields = ('user__username', 'report_title', 'route_name')
admin.site.register(RouteReport, RouteReportAdmin)