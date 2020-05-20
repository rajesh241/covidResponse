"""
Admin module for core app
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _


from core import models

# Register your models here.

class UserAdmin(BaseUserAdmin):
    ordering = ['id']
    list_display = ['email', 'name', 'user_role']
    list_filter = ["user_role"] 
    search_fields = ["email", 'name']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('name', 'team', 'user_role', 'avatar',
                                         'login_attempt_count', 'is_locked',
                                         'organization', 'can_endorse',
                                         'can_fund', 'formio_usergroup', 'is_user_manager')}),
        (
            _('Permissions'),
            {'fields': ('is_active', 'is_staff', 'is_superuser')}
        ),
        (_('Important dates'), {'fields': ('last_login',)})
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')
        }),
    )

class OrganizationModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Organization"""
    list_display = ["id", "name"]
    list_filter = ["name"]
    search_fields = ["name"]
class TeamModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Team"""
    list_display = ["id", "name"]
    list_filter = ["name"]
    search_fields = ["name"]
class RegionModelAdmin(admin.ModelAdmin):
    """Model Adminf or class Team"""
    list_display = ["id", "name"]
    list_filter = ["name"]
    search_fields = ["name"]


admin.site.register(models.User, UserAdmin)
admin.site.register(models.Team, TeamModelAdmin)
admin.site.register(models.Region, RegionModelAdmin)
admin.site.register(models.Organization, OrganizationModelAdmin)
