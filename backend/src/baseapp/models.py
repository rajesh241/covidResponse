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

class Context(models.Model):
    """This is the basic class for Aparment"""
    name = models.CharField(max_length=256)
    contact_numbers = models.CharField(max_length=1024, null=True, blank=True)
    phone = models.BigIntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    how_many_people = models.IntegerField(blank=True, null=True)
    what_help = models.CharField(max_length=1024, blank=True, null=True)
    how_urgent = models.CharField(max_length=1024, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True,
                                   blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True,
                                   blank=True)
    native_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True,
                                   blank=True)
    native_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True,
                                   blank=True)
    who_are_you = models.CharField(max_length=1024, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        """To define meta data attributes"""
        db_table = 'context'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.name}-{self.description}"


