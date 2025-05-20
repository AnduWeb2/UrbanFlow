from django.db import models
from user.models import Citzen, StaffUser
# Create your models here.

class RouteReport(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]

    user = models.ForeignKey(Citzen, on_delete=models.CASCADE)
    route_name = models.CharField(max_length=255)
    report_title = models.CharField(max_length=255)
    report_details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    reason = models.TextField(blank=True, null=True, help_text="Reason for report closure")

    
    def __str__(self):
        return f"{self.report_title} - {self.user.username}"