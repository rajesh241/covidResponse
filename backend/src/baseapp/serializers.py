"""Serializer classes for the application"""
import re
from rest_framework import serializers, fields
from baseapp.models import Covid, Entity, Feedback, EntityBulkEdit
from baseapp.formio import helpseeker_v1_prefilling, create_submission_data, get_title_description
from django.conf import settings

def clean_phone_number(string):
    """Will extract the phone number from the string"""
    number_array = re.findall('\d+', string)
    phone = ''
    for n in number_array:
        phone = phone + n
    return phone

class ItemSerializer1(serializers.Serializer):
    """Your Custom Serializer"""
    # Gets a list of Integers
    user_ids = serializers.ListField(child=serializers.CharField())

class FeedbackSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        """Meta Class"""
        model = Feedback
        fields = '__all__'

class EntityBulkEditSerializer(serializers.ModelSerializer):
    """Serializer for Entity Bulk Edit"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        """Meta Class"""
        model = EntityBulkEdit
        fields = '__all__'

class EntitySerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    can_edit = serializers.SerializerMethodField()
    bulk_action_list = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    class Meta:
        """Meta Class"""
        model = Entity
        fields = '__all__'
      # extra_kwargs = {
      #            'description' :  { 'required': True,'error_messages': {'required':'field is required'}},
      #             'name' :  { 'error_messages': { 'required': 'field is required'}},
      #            'latitude' :  { 'required': True,'error_messages':{'required':'field is required'}},
      #            'longitude' :  { 'required': True,'error_messages':{'required':'field is required'}},
      #                }
    def validate(self, data):
        """
        Check that the start is before the stop.
        """
        #if (data['latitude'] > 90) or (data['latitude'] < -90):
        #    raise serializers.ValidationError({"detail":"Latitude must be between +90 and -90"})
        #if (data['longitude'] > 180) or (data['longitude'] < -180):
        #    raise serializers.ValidationError({"detail":"Longitude must be between 180 and -180"})
        return data

    def get_tags(self, instance):
        """This method allows us to tag the objects based on logged in user"""
        request = self.context.get('request')
        user = request.user
        tags = []
        if instance.title is None:
            instance.title = "default"
        if "A" in instance.title:
            tags.append("a")
        if "E" in instance.title:
            tags.append("e")
        if "I" in instance.title:
            tags.append("i")
        if "O" in instance.title:
            tags.append("o")
        if "U" in instance.title:
            tags.append("u")
        return tags

    def get_bulk_action_list(self, instance):
        import random
        """This will return the possible bulk actions that are possible on this object"""
        request = self.context.get('request')
        user = request.user
        bulk_action_list = []
        if instance.title is None:
            instance.title = "default"
        if True: # "d" in instance.title:
             bulk_action_list.append({"delete":"Delete Items"})
        if "F" in instance.title:
             bulk_action_list.append({"feedback": "FeedBack"})
        if bool(random.getrandbits(1)):
             bulk_action_list.append({"assignto": "Assign To Org"})
        if bool(random.getrandbits(1)):
             bulk_action_list.append({"defunct": "Mark as Defunct"})            
        if bool(random.getrandbits(1)):
             bulk_action_list.append({"full": "Out of Capacity"})            

        return bulk_action_list
        
    def get_can_edit(self, instance):
        """This method will return if the user has edit permissions or not"""
        request = self.context.get('request')
        user = request.user
        if user.is_authenticated:
            can_edit = True
        else:
            can_edit = False
        return can_edit
    
    def create(self, validated_data):
        """Over riding teh create method of serializer"""
        obj = Entity.objects.create(**validated_data)
        #self.parse_data_json(obj, validated_data)
        return obj

    def update(self, instance, validated_data):
        """Overriding the default instance method"""
        for key,value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        #self.parse_data_json(instance, validated_data)
        return instance

    def parse_data_json(self, obj, validated_data):
        """This will parse the data json to populate few fields in Entity
        Model"""
        data_json = validated_data.get("data_json", None)
        if data_json is not None:
            prefill_json = create_submission_data(data_json)
            about_dict = get_title_description(obj.record_type, data_json)
            obj.latitude = about_dict.get("latitude", obj.latitude)
            obj.longitude = about_dict.get("longitude", obj.longitude)
            obj.title = about_dict['title']
            obj.description = about_dict['description']
            obj.formio_url = about_dict['formio_url']
            obj.prefill_json = prefill_json
            obj.save()
       #keyword_array = []
       #address = obj.address
       #if address is not None:
       #    keyword_array.append(address)
       #if data_json is not None:
       #    feedback_obj = Feedback.objects.create(entity=obj,
       #                                           data_json=data_json,
       #                                           user=obj.user)
       #    
       #
       #    contact = data_json['contactContactperson']['data']
       #    for item in contact['mobile']:
       #        mobile_number = item.get('mobileNumber', None)
       #        if mobile_number is not None:
       #            mobile_number = clean_phone_number(mobile_number)
       #            keyword_array.append(mobile_number)
       #            
       #    full_name = contact.get('fullName', None)
       #    if full_name is not None:
       #        keyword_array.append(full_name)
       #        obj.title = full_name
       #        obj.full_name = full_name
       #        
       #keywords = ','.join(map(str, keyword_array)) 
       #obj.keywords = keywords
       #obj.save()


class EntityPublicSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    class Meta:
        """Meta Class"""
        model = Entity
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
