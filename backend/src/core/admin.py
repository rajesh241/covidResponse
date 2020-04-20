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
    list_display = ['email', 'name']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('name', 'group', 'user_role', 'avatar',
                                         'login_attempt_count', 'is_locked',
                                         'avatar_url')}),
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
    list_display = ["id", "title"]
    list_filter = ["title"]
    search_fields = ["title"]

admin.site.register(models.User, UserAdmin)
admin.site.register(models.Organization, OrganizationModelAdmin)
