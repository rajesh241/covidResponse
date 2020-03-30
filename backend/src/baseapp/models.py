from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.

class Covid(models.Model):
    """This is the basic class for Aparment"""
    name = models.CharField(max_length=256)
    description = models.TextField(blank=True, null=True)
    phone = models.IntegerField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True,
                                   blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True,
                                   blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        """To define meta data attributes"""
        db_table = 'covid'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.name}-{self.description}"


