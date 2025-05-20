from django.db import models
from files.models import File
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_staff = models.BooleanField(default=False)



class StaffUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    is_valid = models.BooleanField(default=False)
    document = models.ForeignKey(File, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username

class Citzen(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    def __str__(self):
        return self.user.username

class StaffUserToken(models.Model):
    user = models.ForeignKey(StaffUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.token}"
    
class CitzenToken(models.Model):
    user = models.ForeignKey(Citzen, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.token}"