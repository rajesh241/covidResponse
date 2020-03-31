from django.contrib import admin

# Register your models here.
from .models import Context, Covid
class ContextModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "name", "latitude", "longitude"]
    search_fields = ["name"]
class CovidModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "name", "latitude", "longitude"]
    search_fields = ["name"]
admin.site.register(Covid, CovidModelAdmin)
admin.site.register(Context, ContextModelAdmin)
