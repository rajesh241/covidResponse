
"""Serializer classes for the application"""
from rest_framework import serializers, fields
from baseapp.models import Covid, Context

class ItemSerializer(serializers.Serializer):
    """Your Custom Serializer"""
    # Gets a list of Integers
    user_ids = serializers.ListField(child=serializers.CharField())

class ContextSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        """Meta Class"""
        model = Covid
        fields = '__all__'
        extra_kwargs = {
                   'description' :  { 'required': True,'error_messages': {'required':'field is required'}},
                    'name' :  { 'error_messages': { 'required': 'field is required'}},
                   'latitude' :  { 'required': True,'error_messages':{'required':'field is required'}},
                   'longitude' :  { 'required': True,'error_messages':{'required':'field is required'}},
                       }
    def validate(self, data):
        """
        Check that the start is before the stop.
        """
        if (data['latitude'] > 90) or (data['latitude'] < -90):
            raise serializers.ValidationError({"detail":"Latitude must be between +90 and -90"})
        if (data['longitude'] > 180) or (data['longitude'] < -180):
            raise serializers.ValidationError({"detail":"Longitude must be between 180 and -180"})
        return data
class CovidSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        """Meta Class"""
        model = Covid
        fields = '__all__'
        extra_kwargs = {
                   'description' :  { 'required': True,'error_messages': {'required':'field is required'}},
                    'name' :  { 'error_messages': { 'required': 'field is required'}},
                   'latitude' :  { 'required': True,'error_messages':{'required':'field is required'}},
                   'longitude' :  { 'required': True,'error_messages':{'required':'field is required'}},
                       }
    def validate(self, data):
        """
        Check that the start is before the stop.
        """
        if (data['latitude'] > 90) or (data['latitude'] < -90):
            raise serializers.ValidationError({"detail":"Latitude must be between +90 and -90"})
        if (data['longitude'] > 180) or (data['longitude'] < -180):
            raise serializers.ValidationError({"detail":"Longitude must be between 180 and -180"})
        return data
