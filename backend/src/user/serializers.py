"""
Serializer Module for User
"""
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import ugettext_lazy as _
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.encoding import force_text
from rest_framework import exceptions
from core.models import Team, Organization
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from baseapp.models import Entity
class ItemSerializer(serializers.Serializer):
    """Your Custom Serializer"""
    # Gets a list of Integers
    user_ids = serializers.ListField(child=serializers.CharField())

class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    class Meta:
        """Meta Class"""
        model = Organization
        fields = '__all__'

    def parse_data_json(self, instance, validated_data):
        '''
        This will parse the data json to populate few fields in Organization Model
        '''
        try:
            instance.name = validated_data['data_json']['organization']
        except:
            print('Exception[{e}]')
        try:
            instance.contact_name = validated_data['data_json']['contactName']
        except:
            print('Exception[{e}]')
        try:
            instance.contact_phone = ','.join('{0}'.format(n) for n in validated_data['data_json']['mobile'])
        except Exception as e:
            print('Exception[{e}]')
        try:
            registrations = validated_data['data_json']['registrations']
            instance.has_12A = registrations['12a']
            instance.has_FCRA = registrations['fcra']
            instance.has_GST = registrations['gst']
        except:
            print('Exception[{e}]')
        instance.save()
        return instance

    def create(self, validated_data):
        obj = Organization.objects.create(**validated_data)
        obj.save()
        self.parse_data_json(obj, validated_data)
        return obj

    def update(self, instance, validated_data):
        """Overriding the default instance method"""
        for key,value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        self.parse_data_json(instance, validated_data)
        return instance



class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Report Model"""
    class Meta:
        """Meta Class"""
        model = Team
        fields = '__all__'

class ModifyUserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = get_user_model()
        fields = ['name', 'avatar', 'email', 'provider', 'password',
                  'password2', 'avatar_url']
        extra_kwargs = {'password': {'write_only': True,
                                     'min_length': 5}
                       }
    def validate(self, data):
        pass1 = data.get('password')
        pass2 = data.pop('password2', None)
        if pass1 != pass2:
            raise serializers.ValidationError("Passwords must match")
        return data
    def update(self, instance, validated_data):
        """Update function of serializer"""
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class UserPublicSerializer(serializers.ModelSerializer):
    """ Serializer for the User Public object """
    team = TeamSerializer()
    class Meta:
        """Meta Class"""
        model = get_user_model()
        fields = ('id', 'name', 'team')

class TeamPublicSerializer(serializers.ModelSerializer):
    """ Serializer for the User Public object """
    display = serializers.SerializerMethodField()
    org = serializers.SerializerMethodField()
    class Meta:
        """Meta Class"""
        model = Team
        fields = ('id', 'name', 'display', 'org')
    def get_display(self, instance):
        if instance.organization is not None:
            org = instance.organization.name
        else:
            org = ''
        display = f"{instance.name}"
        return display
    def get_org(self, instance):
        if instance.organization is not None:
            org = instance.organization.name
        else:
            org = ''
        return org
        

class UserListSerializer(serializers.ModelSerializer):
    """ Serializer for the user object """
    team = TeamSerializer()
    class Meta:
        """Default Meta Class"""
        model = get_user_model()
        fields = ('id', 'email', 'password', 'team', 'name', 'avatar',
                  'is_active', 'is_locked', 'is_staff', 'provider'
                  ,'avatar_url', 'is_superuser', 'user_role',
                  'login_attempt_count', 'formio_usergroup')


class UserSerializer(serializers.ModelSerializer):
    """ Serializer for the user object """
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    #group = TeamSerializer()
    def __init__(self, *args, **kwargs):
        super(UserSerializer, self).__init__(*args, **kwargs) # call the super() 
        for field in self.fields: # iterate over the serializer fields
            self.fields[field].error_messages['required'] = '%s field is required'%field # set the custom error message
    class Meta:
        """Default Meta Class"""
        model = get_user_model()
        fields = ('id', 'email', 'password', 'password2', 'team', 'name', 'avatar',
                  'is_active', 'is_locked', 'is_staff', 'provider'
                  ,'avatar_url', 'is_superuser', 'user_role',
                  'login_attempt_count', 'formio_usergroup')
        extra_kwargs = {'password': {'write_only': True,
                                     'min_length': 5,
                                     'error_messages': { 'blank': 'Password field is required'}
                                    },
                        'email' :  { 'error_messages': { 'blank': 'Email field is required'}},
                        'name' :  { 'error_messages': { 'blank': 'Name field is required'}}
                       }

    def validate(self, data):
        print(data)
        pass1 = data.get('password')
        pass2 = data.pop('password2', None)
        if pass1 != pass2:
            raise serializers.ValidationError("Passwords must match")
        return data

    def create(self, validated_data):
        """Create function of serializer"""
        send_email = False
        is_active = True
        request=self.context.get('request')
        if not(request.user.is_superuser or request.user.is_user_manager):
            print("not authorized")
            validated_data.pop('is_staff',None)
            validated_data.pop('is_superuser',None)
            validated_data.pop('is_locked',None)
            validated_data.pop('is_active',None)
            validated_data.pop('is_user_role',None)
            validated_data.pop('login_attempt_count',None)
            is_active = False
            send_email = True
        elif not(request.user.is_superuser):
            validated_data.pop('is_superuser',None)

        my_user = get_user_model().objects.create_user(**validated_data)
        my_user.is_active = is_active
        my_user.save()
        if (send_email):
            self.send_account_activation_email(request, my_user)
        return my_user

    def update(self, instance, validated_data):
        """Update function of serializer"""
        #If the team has changed then we should unassign all the cases for
        #volunteer
        current_team = validated_data.get('team', None)
        if ((current_team is not None) and (current_team != instance.team)):
            objs = Entity.objects.filter(assigned_to_user = instance)
            for obj in objs:
                obj.assigned_to_user = None
                obj.save()
        password = validated_data.pop("password", None)
        request=self.context.get('request')
        if not(request.user.is_superuser):
            validated_data.pop('is_superuser',None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user=user.save()
        is_locked = validated_data.get('is_locked',None)
        if (is_locked is not None) and (not is_locked):
            user.login_attempt_count = 0
            user.save()
        return user

    def send_account_activation_email(self, request, user):
        text_content = 'Account Activation Email'
        subject = f'Email Verfication from {settings.WEB_NAME}'
        template_name = "email/activation.html"
        from_email = settings.EMAIL_HOST_USER
        recipients = [user.email]
        kwargs = {
            "uidb64": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": default_token_generator.make_token(user)
        }
        print(str(kwargs))
        activate_url = f"{settings.FRONTEND_REGCONFIRM_URL}?uidb64={kwargs['uidb64']}&token={kwargs['token']}"
        context = {
            'user': user,
            'web_name' : settings.WEB_NAME,
            'activate_url': activate_url
        }
        html_content = render_to_string(template_name, context)
        email = EmailMultiAlternatives(subject, text_content, from_email, recipients)
        email.attach_alternative(html_content, "text/html")
        email.send()
 

class AuthTokenSerializer(serializers.Serializer):
    """Serializer class for issuing auth Token"""
    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """Validating the submitted username and password"""
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )
        if not user:
            msg = _('Unable to authenticate user with provied credentials')
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return attrs

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custome token serializer to include custom user fields in the token"""
    @classmethod
    def get_token(cls, user):
        """Overriding get token method"""
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)
        # Add custom claims
        token['id'] = user.id
        token['email'] = user.email
        token['name'] = user.name
        token['ur'] = user.user_role
        if user.organization is not None:
            token['orgid'] = user.organization.id
        else:
            token['orgid'] = 0
        if user.team is not None:
            print("Team is not None")
            token['group'] = user.team.name
            token['groupid'] = user.team.id
        else:
            token['group'] = 'general'
        if user.region is not None:
            token['region'] = user.region
        else:
            token['region'] = "india"
        token['usergroup'] = user.formio_usergroup
        return token
    def validate(self, attrs):
        username_field = get_user_model().USERNAME_FIELD
        username = attrs[username_field]
        try:
            user = get_user_model().objects.get(**{username_field: username})
        except:
            user = None
        if user:
            print(f"user id {user.id} name {user.name}")
            if user.is_locked:
                message = "Your account has been locked. Kindly contact system administrator"
                raise exceptions.AuthenticationFailed(message)
            if not(user.is_active):
                message = "Your email is not verified. We have sent you an email for confirmation. Kindly click on the confirmation link"
                raise exceptions.AuthenticationFailed(message)
            password = attrs.get('password')
            authuser = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )
            if user.is_superuser:
                if not authuser:
                    message="Incorrect password"
                    raise exceptions.AuthenticationFailed(message)
                    
            user.login_attempt_count = user.login_attempt_count + 1
            if user.login_attempt_count >= 3:
                user.is_locked = True
            user.save()
            if not authuser: 
                if user.login_attempt_count == 3:
                    message=f"You have already made three failed login attempts. Your account has been locked. Kindly contact system administrator to reactivate your account"
                else:
                    message = f"Incorrect password. If your login fails for three times your account will be locked. Your have already made {user.login_attempt_count} attempts."
                raise exceptions.AuthenticationFailed(message)
        data = super().validate(attrs)
        user.login_attempt_count = 0
        user.is_locked = False
        user.save()
        return data
         # do your extra validation here
   #    
   #    if not user.email_verification:
   #        raise exceptions.AuthenticationFailed({"status":"fail", "message":"verify email"})
   #    login(request, user)

class RegistrationActivationSerializer(serializers.Serializer):
    token = serializers.CharField()
    uidb64 = serializers.CharField()
