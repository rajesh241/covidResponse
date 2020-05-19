from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_mysql.models import JSONField
from core.models import Region, Team, Organization
from django.utils import timezone

User = get_user_model()
# Create your models here.

class Location(models.Model):
    """This is the basic class for Location"""
    name = models.CharField(max_length=256)
    location_type = models.CharField(max_length=256, null=True, blank=True)
    code = models.CharField(max_length=256, null=True, blank=True)
    state_code = models.CharField(max_length=256, null=True, blank=True)
    district_code = models.CharField(max_length=256, null=True, blank=True)
    state_name = models.CharField(max_length=256, null=True, blank=True)
    district_name = models.CharField(max_length=256, null=True, blank=True)
    class Meta:
        """To define meta data attributes"""
        db_table = 'location'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.code}-{self.name}"
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

 
class Request(models.Model):
    """This is the basic class for Aparment"""
    title = models.CharField(max_length=256, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL,
                                        blank=True, null=True,
                                        related_name="org_group")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True)
    mode = models.CharField(max_length=1024, null=True, blank=True)
    amount_needed = models.BigIntegerField(blank=True, null=True)
    amount_pledged = models.BigIntegerField(blank=True, null=True)
    amount_pending = models.BigIntegerField(blank=True, null=True)
    total_endorsed = models.BigIntegerField(blank=True, null=True)
    endorsed_by = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    needed_by = models.DateField(blank=True, null=True)
    data_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    prefill_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    extra_fields = JSONField(null=True, blank=True)  # requires Django-Mysql package
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    class Meta:
        """To define meta data attributes"""
        db_table = 'request'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.id}"
class Pledge(models.Model):
    """This is the basic class for Aparment"""
    request = models.ForeignKey(Request, on_delete=models.SET_NULL,
                                        blank=True, null=True,
                                        related_name="request_name")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True)
    amount_pledged = models.BigIntegerField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    extra_fields = JSONField(null=True, blank=True)  # requires Django-Mysql package
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    class Meta:
        """To define meta data attributes"""
        db_table = 'pledge'
    def __str__(self):
        """Default str method for the class"""
        return f"{self.id}"


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
    district = models.CharField(max_length=256, null=True, blank=True)
    region = models.CharField(max_length=256, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    contact_numbers = models.CharField(max_length=1024, null=True, blank=True)
    phone = models.CharField(max_length=256, null=True, blank=True)
    record_type = models.CharField(max_length=1024, null=True, blank=True,
                                   default="helpseekers")
    address = models.TextField(null=True, blank=True)
    keywords = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True)
    assigned_to_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True, related_name="user_assignment")
    updated_by_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True, related_name="user_updated")
    assigned_to_org = models.ForeignKey('self', on_delete=models.SET_NULL,
                                        blank=True, null=True,
                                        related_name="org_assignment")
    assigned_to_group = models.ForeignKey(Team, on_delete=models.SET_NULL,
                                        blank=True, null=True,
                                        related_name="org_group")
    latitude = models.DecimalField(max_digits=22, decimal_places=19, null=True,
                                   blank=True)
    longitude = models.DecimalField(max_digits=22, decimal_places=19, null=True,
                                   blank=True)
    data_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    prefill_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    extra_fields = JSONField(null=True, blank=True)  # requires Django-Mysql package
    route = JSONField(null=True, blank=True)  # requires Django-Mysql package
    formio_url = models.URLField(blank=True, null=True)
    from_ui = models.BooleanField(default=True)
    google_location_json = JSONField(null=True, blank=True)  # requires Django-Mysql package

    record_subtype = models.CharField(max_length=1024, null=True, blank=True)
    phone1 = models.BigIntegerField(blank=True, null=True)
    wassan_id = models.BigIntegerField(blank=True, null=True)
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
    remarks = models.TextField(blank=True, null=True)
    feedback_form_json = JSONField(null=True, blank=True)  # requires Django-Mysql package
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    modified = models.DateTimeField(default=timezone.now)

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

class EntityHistory(models.Model):
    """Class for storing history of Entity"""
    entity = models.ForeignKey(Entity, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True)
    title = models.CharField(max_length=256, null=True, blank=True)
    what_help = models.CharField(max_length=1024, blank=True, null=True)
    user_name = models.CharField(max_length=256, null=True, blank=True)
    prefill_json = JSONField()  # requires Django-Mysql package
    status = models.CharField(max_length=256, null=True, blank=True)
    urgency = models.CharField(max_length=1024, null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)
    assigned_to_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True, related_name="es_user_assignment")
    updated_by_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                             blank=True, related_name="es_user_updated")
    assigned_to_group = models.ForeignKey(Team, on_delete=models.SET_NULL,
                                        blank=True, null=True,
                                        related_name="eh_org_group")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    modified = models.DateTimeField(default=timezone.now)
    class Meta:
        """To define meta data attributes"""
        db_table = 'entityhistory'
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


def create_history(sender, instance, *args, **kwargs):
   '''Function to create history'''
   try:
       obj = EntityHistory.objects.create(entity=instance)
       obj.title = instance.title
       obj.what_help = instance.what_help
       obj.user_name = instance.updated_by_user.name
       obj.status = instance.status
       obj.urgency = instance.urgency
       obj.remarks = instance.remarks
       obj.prefill_json = instance.prefill_json
       obj.assigned_to_user = instance.assigned_to_user
       obj.assigned_to_group = instance.assigned_to_group
       obj.updated_by_user = instance.updated_by_user
       obj.save()
   except:
       obj = None
post_save.connect(create_history, sender=Entity)
