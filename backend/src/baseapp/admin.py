from django.contrib import admin

# Register your models here.
from .models import Entity, Covid
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
