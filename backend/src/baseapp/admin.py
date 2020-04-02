from django.contrib import admin

# Register your models here.
from .models import Entity, Covid, Feedback
class FeedbackModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "entity", "user"]
    list_filter = ["user"]
    search_fields = ["user"]
class EntityModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "name", "latitude", "longitude"]
    list_filter = ["record_type"]
    search_fields = ["name", "description"]
class CovidModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "name", "latitude", "longitude"]
    search_fields = ["name"]
admin.site.register(Covid, CovidModelAdmin)
admin.site.register(Entity, EntityModelAdmin)
admin.site.register(Feedback, FeedbackModelAdmin)
