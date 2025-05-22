from django.db import models
from user.models import CustomUser

# Create your models here.

class FavoriteRoute(models.Model):
    route_id = models.IntegerField()
    route_name = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.route_name} - {self.user.username}"