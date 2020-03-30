from django.contrib import admin

# Register your models here.
from .models import Covid
class CovidModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Location"""
    list_display = ["id", "name", "latitude", "longitude"]
    search_fields = ["name"]
# Register your models here.
admin.site.register(Covid, CovidModelAdmin)
