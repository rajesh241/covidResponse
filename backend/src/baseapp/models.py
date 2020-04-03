from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_mysql.models import JSONField

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

class Entity(models.Model):
    """This is the basic class for Aparment"""
    name = models.CharField(max_length=256)
    record_type = models.CharField(max_length=1024, null=True, blank=True,
                                   default="needHelp")
    record_subtype = models.CharField(max_length=1024, null=True, blank=True)
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
    information_source = models.CharField(max_length=1024, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True)
    is_active = models.BooleanField(default=True)
    is_functional = models.BooleanField(default=True)
    is_facility = models.BooleanField(default=False)
    icon_url = models.URLField(blank=True, null=True,
                               default='https://covidb.libtech.in/media/icons/red-dot.png')
    backend_remarks = models.TextField(blank=True, null=True)
    feedback_form = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        """To define meta data attributes"""
        db_table = 'context'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.name}-{self.description}"


class Feedback(models.Model):
    """Class for collecting feedback on the entity"""
    entity = models.ForeignKey(Entity, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True)
    data_json = JSONField()  # requires Django-Mysql package
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    class Meta:
        """To define meta data attributes"""
        db_table = 'feedback'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.entity.name}"
@receiver(post_save, sender=Entity)
def update_context(sender, instance, created, **kwargs):
    if (instance.is_facility == False):
        if(instance.record_type == "facility"):
            instance.is_facility = True
            instance.save()
