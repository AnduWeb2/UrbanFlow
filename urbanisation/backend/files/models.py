from django.db import models
from django.utils import timezone
# Create your models here.


class File(models.Model):
    file = models.FileField(blank=False, null=False)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.file.name