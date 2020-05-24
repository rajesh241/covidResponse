"""Serializer classes for the application"""
import re
from rest_framework import serializers, fields
from django.contrib.auth import get_user_model, authenticate
from baseapp.models import Covid, Entity, Feedback, EntityBulkEdit, BulkOperation, EntityHistory, Location, Request, Pledge
from core.models import Organization
from baseapp.formio import convert_formio_data_to_django, help_sought, get_status, get_remarks
from django.conf import settings
from baseapp.bulk_action import perform_bulk_action
from user.serializers import UserPublicSerializer, TeamPublicSerializer
User = get_user_model()

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

class StateSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    state = serializers.CharField()

    class Meta:
        """Meta Class"""
        model = Entity
        fields = ('state', 'count')
class DistrictSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    district = serializers.CharField()

    class Meta:
        """Meta Class"""
        model = Entity
        fields = ('district', 'count')


class BulkOperationSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        """Meta Class"""
        model = BulkOperation
        fields = '__all__'

    def create(self, validated_data):
        """Over riding teh create method of serializer"""
        print(validated_data)
        obj = BulkOperation.objects.create(**validated_data)
        request = self.context.get('request')
        perform_bulk_action(validated_data, request.user)
        #self.parse_data_json(obj, validated_data)
        return obj

class LocationSerializer(serializers.ModelSerializer):
    """Serializer for Location Model"""
    class Meta:
        """Meta Class"""
        model = Location
        fields = '__all__'


class PledgeSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    org_name = serializers.SerializerMethodField()
    org_phone = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    user_phone = serializers.SerializerMethodField()
    request_title = serializers.SerializerMethodField()
    class Meta:
        """Meta Class"""
        model = Pledge
        fields = '__all__'

    def get_org_name(self, instance):
        try:
            org_name = instance.request.organization.name
        except:
            org_name = ''
        return org_name
    def get_org_phone(self, instance):
        try:
            org_name = instance.request.organization.contact_phone
        except:
            org_name = ''
        return org_name
    def get_user_phone(self, instance):
        try:
            name = instance.user.phone
        except:
            name = ''
        return name
    def get_user_name(self, instance):
        try:
            name = instance.user.name
        except:
            name = ''
        return name
    def get_request_title(self, instance):
        try:
            name = instance.request.title
        except:
            name = ''
        return name
        try:
            org_name = instance.request.organization.name
        except:
            org_name = ''
        return org_name
    
class RequestSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    org_name = serializers.SerializerMethodField()
    total_endorsed = serializers.SerializerMethodField()
    endorsed_by = serializers.SerializerMethodField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        """Meta Class"""
        model = Request
        fields = '__all__'
    def get_org_name(self, instance):
        """This method will return if the user has edit permissions or not"""
        if instance.organization is not None:
            org_name = instance.organization.name
        else:
            org_name = ''
        return org_name
    def get_endorsed_by(self, instance):
        """This method will return if the user has edit permissions or not"""
        if instance.organization is not None:
            output = instance.organization.endorsed_by
        else:
            output = ''
        return output
    def get_total_endorsed(self, instance):
        """This method will return if the user has edit permissions or not"""
        if instance.organization is not None:
            output = instance.organization.total_endorsed
        else:
            output = ''
        return output
    def create(self, validated_data):
        """Over riding teh create method of serializer"""
        obj = Request.objects.create(**validated_data)
        print(validated_data)
        request = self.context.get('request')
        try:
            amount_needed = validated_data["data_json"]["totalcost"]
        except:
            amount_needed = 0

        try:
            org_id = validated_data["data_json"]["requestedBy"]["id"]
            print(org_id)
            myorg = Organization.objects.filter(id=org_id).first()
            title = f"support request from {myorg.name}"
        except:
            myorg = None
            title = "support request"
        try:
            notes = validated_data["data_json"]["remarks"]
        except:
            notes = ''
        obj.amount_needed = amount_needed
        obj.amount_pending = amount_needed
        obj.amount_pledged = 0
        obj.notes = notes
        obj.organization = myorg
        obj.title = title
        obj.save()
          
      #  self.create_history(obj)
        return obj

    def update(self, instance, validated_data):
        """Overriding the default instance method"""
        for key,value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        obj = instance
        try:
            amount_needed = validated_data["data_json"]["totalcost"]
            #amount_raised = validated_data["data_json"]["totalcost"]
            #amount_pending = amount_needed - obj.amount_raised
        except:
            amount_needed = 0
            amount_pending = obj.amount_pending

        try:
            org_id = validated_data["data_json"]["requestedBy"]["id"]
            print(org_id)
            myorg = Organization.objects.filter(id=org_id).first()
            title = f"support request from {myorg.name}"
        except:
            myorg = None
            title = "support request"
        try:
            notes = validated_data["data_json"]["remarks"]
        except:
            notes = ''
        obj.amount_needed = amount_needed
        obj.amount_pending = amount_needed - obj.amount_pledged
        # obj.amount_pledged = 0
        obj.notes = notes
        obj.organization = myorg
        obj.title = title
        obj.save()
        return obj
        
class FeedbackSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        """Meta Class"""
        model = Feedback
        fields = '__all__'

class SmallEntitySerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    class Meta:
        """Meta Class"""
        model = Entity
        fields = ['id', 'title']


class EntityBulkEditSerializer(serializers.ModelSerializer):
    """Serializer for Entity Bulk Edit"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        """Meta Class"""
        model = EntityBulkEdit
        fields = '__all__'
    def validate(self, data):
        """
        Check that the start is before the stop.
        """
        print("I am in validate")
        return data

    def create(self, validated_data):
        """Over riding teh create method of serializer"""
        print(validated_data)
        obj = EntityBulkEdit.objects.create(**validated_data)
        #self.parse_data_json(obj, validated_data)
        return obj


class EntityListSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    can_edit = serializers.SerializerMethodField()
    bulk_action_list = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    assigned_to_org = SmallEntitySerializer(required=False)
    assigned_to_user = UserPublicSerializer(required=False)
    assigned_to_group = TeamPublicSerializer(required=False)
    class Meta:
        """Meta Class"""
        model = Entity
        fields = '__all__'
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
        bulk_action_list = {}
        if instance.title is None:
            instance.title = "default"
        if True: # "d" in instance.title:
             bulk_action_list['assigntovolunteer'] = 'Assign To Volunteer'
        if False and bool(random.getrandbits(1)):
             bulk_action_list['feedback'] = 'FeedBack'
        if True or bool(random.getrandbits(1)):
             bulk_action_list['assigntogroup'] = 'Assign To Team'
        if True or bool(random.getrandbits(1)):
             bulk_action_list['duplicate'] = 'Suggest Duplicate'
        if False and bool(random.getrandbits(1)):
             bulk_action_list['full'] = 'Out of Capacity'            
        if False and bool(random.getrandbits(1)):
             bulk_action_list['delete'] = 'Delete Items'
        if True or  bool(random.getrandbits(1)):
             bulk_action_list['export'] = 'Export'

        return bulk_action_list
        
    def get_can_edit(self, instance):
        """This method will return if the user has edit permissions or not"""
        request = self.context.get('request')
        user = request.user
        if user.is_authenticated:
            can_edit = False
        else:
            can_edit = False
        return can_edit
 
class EntitySerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    can_edit = serializers.SerializerMethodField()
    bulk_action_list = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
   # assigned_to_org = SmallEntitySerializer(required=False)
   # assigned_to_user = UserPublicSerializer(required=False)
   # assigned_to_group = TeamPublicSerializer(required=False)
    class Meta:
        """Meta Class"""
        model = Entity
        fields = '__all__'
       # extra_kwargs = {
       #           'assinged_to_org' :  { 'required': False},
       #           'assinged_to_user' :  { 'required': False}
      #            'description' :  { 'required': True,'error_messages': {'required':'field is required'}},
      #             'name' :  { 'error_messages': { 'required': 'field is required'}},
      #            'latitude' :  { 'required': True,'error_messages':{'required':'field is required'}},
      #            'longitude' :  { 'required': True,'error_messages':{'required':'field is required'}},
     #                 }
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
        bulk_action_list = {}
        if instance.title is None:
            instance.title = "default"
        if True: # "d" in instance.title:
             bulk_action_list['assigntovolunteer'] = 'Assign To Volunteer'
        if False and bool(random.getrandbits(1)):
             bulk_action_list['feedback'] = 'FeedBack'
        if True or bool(random.getrandbits(1)):
             bulk_action_list['assigntogroup'] = 'Assign To Team'
        if False and bool(random.getrandbits(1)):
             bulk_action_list['defunct'] = 'Mark as Defunct'            
        if False and bool(random.getrandbits(1)):
             bulk_action_list['full'] = 'Out of Capacity'            
        if False and bool(random.getrandbits(1)):
             bulk_action_list['delete'] = 'Delete Items'

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
        self.parse_data_json(obj, validated_data)
        request = self.context.get('request')
        obj.assigned_to_user = request.user
        if request.user.team is not None:
            obj.assigned_to_group = request.user.team
        obj.save()
          
      #  self.create_history(obj)
        return obj

    def update(self, instance, validated_data):
        """Overriding the default instance method"""
        for key,value in validated_data.items():
            setattr(instance, key, value)
        #instance.save()
        self.parse_data_json(instance, validated_data)
        return instance
    def create_history(self, entity):
        """This will enter the entity object in the entity history table to
        maintain all the edit records"""
        try:
            obj = EntityHistory.objects.create(entity=entity)
            obj.title = entity.title
            obj.what_help = entity.what_help
            request = self.context.get('request')
            obj.user_name = request.user.name
            obj.status = entity.status
            obj.urgency = entity.urgency
            obj.remarks = entity.remarks
            obj.prefill_json = entity.prefill_json
            obj.save()
        except:
            obj = None
    def parse_data_json(self, obj, validated_data):
        """This will parse the data json to populate few fields in Entity
        Model"""
        data_json = validated_data.get("data_json", None)
        if data_json is not None:
            try:
                field_dict = convert_formio_data_to_django(data_json)
            except:
                field_dict = {}
            for key, value in field_dict.items():
                setattr(obj, key, value)
            obj.what_help = help_sought(obj.prefill_json)
            obj.status = get_status(obj.prefill_json)
            obj.remarks = get_remarks(obj.prefill_json)
        keywords = f"{obj.title},{obj.phone},{obj.email}"
        obj.keywords = keywords
        request = self.context.get('request')
        obj.updated_by_user = request.user
       #obj.assigned_to_user = obj.user
       #if obj.user.group is not None:
       #    obj.assigned_to_group = obj.user.group
       # self.create_history(obj)
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


class EntityHistorySerializer(serializers.ModelSerializer):
    #entity = EntityListSerializer(required=False)
    class Meta:
        """Meta Class"""
        model = EntityHistory
        fields = '__all__'


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
