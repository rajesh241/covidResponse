from django.contrib import admin

# Register your models here.
from .models import Entity, Covid, Feedback, EntityBulkEdit, BulkOperation, EntityHistory, Location, Request, Pledge
class LocationModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "name", "code"]
    list_filter = ["location_type"]
class FeedbackModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "entity", "user"]
    list_filter = ["user"]
    search_fields = ["user"]
class EntityModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "title", "latitude", "longitude"]
    list_filter = ["record_type", "status", "urgency", "formio_usergroup",
                   "assigned_to_group", "state"]
    search_fields = ["name", "description"]
    readonly_fields = ["assigned_to_org", "assigned_to_user"]
class EntityHistoryModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "title", "user_name", "updated", "urgency", "status", "remarks"]
    list_filter = ["updated", "status", "urgency"]
    search_fields = ["title"]
    readonly_fields = ["entity", "user"]

class BulkOperationModelAdmin(admin.ModelAdmin):
    """Model Admin for Entity Bulk Edit"""
    list_display = ["id", "user", "bulk_action"]
    list_filter = ["bulk_action"]

class RequestModelAdmin(admin.ModelAdmin):
    """Model Admin for Entity Bulk Edit"""
    list_display = ["id", "user", "notes"]
    list_filter = ["mode"]

class PledgeModelAdmin(admin.ModelAdmin):
    """Model Admin for Entity Bulk Edit"""
    list_display = ["id", "user", "notes"]
    list_filter = ["user"]
class RequestModelAdmin(admin.ModelAdmin):
    """Model Admin for Entity Bulk Edit"""
    list_display = ["id", "user", "notes"]
    list_filter = ["mode"]
class CovidModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "name", "latitude", "longitude"]
    search_fields = ["name"]
admin.site.register(Covid, CovidModelAdmin)
admin.site.register(Entity, EntityModelAdmin)
admin.site.register(Feedback, FeedbackModelAdmin)
admin.site.register(BulkOperation, BulkOperationModelAdmin)
admin.site.register(EntityHistory, EntityHistoryModelAdmin)
admin.site.register(Location, LocationModelAdmin)
admin.site.register(Request, RequestModelAdmin)
admin.site.register(Pledge, PledgeModelAdmin)
