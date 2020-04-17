from rest_framework import permissions
class EntityPermissions(permissions.BasePermission):
    message  = 'You do not have sufficient permissions to perform this operation'
    """
    Object-level permission to only allow realtor change content.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
