from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_mysql.models import JSONField
from core.models import Region, Group
User = get_user_model()
# Create your models here.

class Covid(models.Model):
    """This is the basic class for Aparment"""
    name = models.CharField(max_length=256)
    description = models.TextField(blank=True, null=True)
    phone = models.IntegerField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=20, decimal_places=20, null=True,
                                   blank=True)
    longitude = models.DecimalField(max_digits=20, decimal_places=20, null=True,
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
    title = models.CharField(max_length=256, null=True, blank=True)
    name = models.CharField(max_length=256, null=True, blank=True)
    full_name = models.CharField(max_length=256, null=True, blank=True)
    status = models.CharField(max_length=256, null=True, blank=True)
    urgency = models.CharField(max_length=1024, null=True, blank=True)
    org_name = models.CharField(max_length=256, null=True, blank=True)
    formio_usergroup = models.CharField(max_length=256, null=True, blank=True,
                                       default='libtech')
    state = models.CharField(max_length=256, null=True, blank=True)
    region = models.CharField(max_length=256, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    contact_numbers = models.CharField(max_length=1024, null=True, blank=True)
    phone = models.CharField(max_length=256, null=True, blank=True)
    record_type = models.CharField(max_length=1024, null=True, blank=True,
                                   default="needHelp")
    address = models.TextField(null=True, blank=True)
    keywords = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True)
    assigned_to_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True, related_name="user_assignment")
    assigned_to_org = models.ForeignKey('self', on_delete=models.SET_NULL,
                                        blank=True, null=True,
                                        related_name="org_assignment")
    assigned_to_group = models.ForeignKey(Group, on_delete=models.SET_NULL,
                                        blank=True, null=True,
                                        related_name="org_group")
    latitude = models.DecimalField(max_digits=22, decimal_places=19, null=True,
                                   blank=True)
    longitude = models.DecimalField(max_digits=22, decimal_places=19, null=True,
                                   blank=True)
    data_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    prefill_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    extra_fields = JSONField(null=True, blank=True)  # requires Django-Mysql package
    formio_url = models.URLField(blank=True, null=True)
    from_ui = models.BooleanField(default=True)
    google_location_json = JSONField(null=True, blank=True)  # requires Django-Mysql package

    record_subtype = models.CharField(max_length=1024, null=True, blank=True)
    phone1 = models.BigIntegerField(blank=True, null=True)
    how_many_people = models.IntegerField(blank=True, null=True)
    what_help = models.CharField(max_length=1024, blank=True, null=True)
    how_urgent = models.CharField(max_length=1024, null=True, blank=True)
    native_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True,
                                   blank=True)
    native_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True,
                                   blank=True)
    who_are_you = models.CharField(max_length=1024, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    information_source = models.CharField(max_length=1024, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_functional = models.BooleanField(default=True)
    is_facility = models.BooleanField(default=False)
    icon_url = models.URLField(blank=True, null=True,
                               default='https://covidb.libtech.in/media/icons/red-dot.png')
    backend_remarks = models.TextField(blank=True, null=True)
    feedback_form_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        """To define meta data attributes"""
        db_table = 'context'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.name}-{self.description}"

class BulkOperation(models.Model):
    """Bulk Operation for any field"""
    ids_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True)
    bulk_action = models.CharField(max_length=256, null=True, blank=True)
    model_name = models.CharField(max_length=256, null=True, blank=True)
    data_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_processed = models.BooleanField(default=False)
    class Meta:
        """To define meta data attributes"""
        db_table = 'bulkOperation'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.id}"
    
class EntityBulkEdit(models.Model):
    """Class for bulk enditing Entity Model"""
    entities = models.ManyToManyField(Entity)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True)
    bulk_action = models.CharField(max_length=256, null=True, blank=True)
    data_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_processed = models.BooleanField(default=False)
    class Meta:
        """To define meta data attributes"""
        db_table = 'entityBulkEdit'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.id}"

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
        return f"{self.id}"
@receiver(post_save, sender=Entity)
def update_context(sender, instance, created, **kwargs):
    if (instance.is_facility == False):
        if(instance.record_type == "facility"):
            instance.is_facility = True
            instance.save()
