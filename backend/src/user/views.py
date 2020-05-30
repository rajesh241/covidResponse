"""Views Module for User App"""
import json
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator

from rest_framework import (generics, authentication, permissions,
                            status, mixins, exceptions)
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework import mixins,generics,permissions
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.translation import ugettext_lazy as _
from rest_framework.response import Response
from rest_framework import viewsets, views
from user.mixins import HttpResponseMixin
from user.permissions import UserViewPermission, IsAdminOwner, IsStaffReadWriteOrReadOnly
from user.utils import is_json
from passwordreset.serializers import EmailSerializer
from user.serializers import (UserSerializer, AuthTokenSerializer,
                              MyTokenObtainPairSerializer,
                              RegistrationActivationSerializer,
                              ModifyUserSerializer, ItemSerializer,
                              TeamSerializer, UserPublicSerializer,
                              TeamPublicSerializer, UserListSerializer,
                              OrganizationSerializer)
User = get_user_model()
from core.models import Team, Organization

class EmailView(GenericAPIView):
    permission_classes = [IsStaffReadWriteOrReadOnly]

    def post(self, request, *args, **kwargs):
        receiver = request.data.get('receiver', None)
        sender = request.data.get('sender', None)
        template = request.data.get('template', None)
        emaildata = request.data.get('emaildata', None)
        message = Mail(
                from_email=sender,
                to_emails=receiver
        )
        #message.dynamic_template_data = data_dict
       # message.template_id = 'd-1622be1610494a6db57d0d66006fed20'
        message.dynamic_template_data = emaildata
        message.template_id = template
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        return Response({"success": False})

def getID(request):
  urlID=request.GET.get('id',None)
  inputJsonData={}
  if is_json(request.body):
    inputJsonData=json.loads(request.body)
  inputJsonID=inputJsonData.get("id",None)
  inputID = urlID or inputJsonID or None
  return inputID

class ModifyUserView(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = ModifyUserSerializer

    def patch(self, request, *args, **kwargs):
        avatar = request.data['avatar']
        name = request.data['name']
        user_id = 1
        obj = get_user_model().objects.filter(id=user_id).first()
        obj.avatar = avatar
        obj.name = name
        obj.save()
        return HttpResponse({'message': 'User Updated'}, status=200)

class CreateUserView(generics.CreateAPIView):
    """This method is used to register a new user. This does not require
    authenticated. Once a user registers an email is sent to user for
    activation"""
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class CreateTokenView(ObtainAuthToken):
    """View that would generate auth token"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

class ManageUserView(generics.RetrieveUpdateAPIView,
                     generics.DestroyAPIView):
    """This method us used to change the profile for autheticated user. The
    user profile can be patched, updated or deleted with this methods. No
    parameters needs to be passed, the profile is picked up for the current
    authenticated user"""
    serializer_class = ModifyUserSerializer
   # authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        """Retrieve and return authenticated user"""
        return self.request.user

class MyTokenObtainPairView(TokenObtainPairView):
    """This method is used to obtain the authentication token."""
    serializer_class = MyTokenObtainPairSerializer
        
class UserActivateView(GenericAPIView):
    """
    This method is used to activate the user. When the user registers on the
    domain, he is send an email with the url (frontend url), and the following two parameters
    token: A Randomly generated token
    uidb64: encoded user ID
    The frontend system should call the post method with the following
    parameters, to activate the user 
    """
    serializer_class = RegistrationActivationSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        print(f"token-{token} uidb64-{uidb64}")
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            print(f"User id is {uid}")
            user = get_user_model().objects.get(pk=uid)
        except :
            user = None
        if not user:
            return Response({'status': 'notfound'}, status=status.HTTP_404_NOT_FOUND)
        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'status': 'OK'} )
        else:
            return Response({'status': 'expired'}, status=status.HTTP_404_NOT_FOUND)

class InviteAPIView(GenericAPIView):
    permission_classes=[UserViewPermission]
    serializer_class = EmailSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.filter(email__iexact=email).first()
        if user:
            raise exceptions.ValidationError({
                'detail': [_(
                    "There is already a user associated with this email ID")],
            })

        text_content = 'Invitation to Toptal Demo'
        subject = 'Invitation to Toptal Demo'
        template_name = "email/invitation.html"
        from_email = settings.EMAIL_HOST_USER
        recipients = [email]
        context = {
            'web_name' : settings.WEB_NAME,
            'activate_url': settings.FRONTEND_REGISTER_URL
        }
        html_content = render_to_string(template_name, context)
        email = EmailMultiAlternatives(subject, text_content, from_email, recipients)
        email.attach_alternative(html_content, "text/html")
        email.send()
        return Response({'status': 'OK'})

class UserBulkDeleteView(GenericAPIView):
    throttle_classes = ()
    permission_classes = [IsAdminOwner]
    serializer_class = ItemSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_ids = serializer.data['user_ids']
        if (len(user_ids) == 1) and (user_ids[0] == 'all'):
            User.objects.filter(is_superuser=False).delete()
        else:
            User.objects.filter(id__in=user_ids).delete()
        return Response({'status': 'OK'})

class UserPublicAPIView(HttpResponseMixin,
                           mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           generics.ListAPIView):
  permission_classes=[permissions.IsAuthenticatedOrReadOnly]
  serializer_class = UserPublicSerializer
  passedID=None
  inputID=None
  search_fields = ('name', 'id')
  ordering_fields = ('name', 'id')
  filter_fields=("is_staff","is_locked","is_active","user_role","formio_usergroup",
                "team__id", "name")
  queryset=User.objects.all()
  def get_object(self):
    inputID=self.inputID
    queryset=self.get_queryset()
    obj=None
    if inputID is not None:
      obj=get_object_or_404(queryset,id=inputID)
      self.check_object_permissions(self.request,obj)
    return obj
  def get(self,request,*args,**kwargs):
    """This method is available only to the users with is_staff(user_manager)
    permissions.This method will return the list of Users based on the
    parameters values specified. The number of items can be controlled by the
    limit parameter. 
    ordering field can be set to either of (name, id, created, updated). It
    will sort the returned results based on that. For example
    entity/?ordering=updated or entity/?ordering=-name (Sort by name
    descending)
    If id of the User is appended to the url for example /entity/1, then
    it would return only one user corresponding to the id mentioned. 
    """
    print(f"request user {request.user}")
    self.inputID=getID(request)
    if self.inputID is not None:
      return self.retrieve(request,*args,**kwargs)
    return super().get(request,*args,**kwargs)
class OrganizationPublicAPIView(HttpResponseMixin,
                           mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           generics.ListAPIView):
  permission_classes=[permissions.IsAuthenticatedOrReadOnly]
  serializer_class = OrganizationSerializer
  passedID=None
  inputID=None
  search_fields = ('id', 'name')
  ordering_fields = ('created', 'id', 'name')
  #filter_fields=("name")
  queryset=Organization.objects.all()
  def get_object(self):
    inputID=self.inputID
    queryset=self.get_queryset()
    obj=None
    if inputID is not None:
      obj=get_object_or_404(queryset,id=inputID)
      self.check_object_permissions(self.request,obj)
    return obj
  def get(self,request,*args,**kwargs):
    """This method is available only to the users with is_staff(user_manager)
    permissions.This method will return the list of Users based on the
    parameters values specified. The number of items can be controlled by the
    limit parameter. 
    ordering field can be set to either of (name, id, created, updated). It
    will sort the returned results based on that. For example
    entity/?ordering=updated or entity/?ordering=-name (Sort by name
    descending)
    If id of the User is appended to the url for example /entity/1, then
    it would return only one user corresponding to the id mentioned. 
    """
    print(f"request user {request.user}")
    self.inputID=getID(request)
    if self.inputID is not None:
      return self.retrieve(request,*args,**kwargs)
    return super().get(request,*args,**kwargs)


class TeamPublicAPIView(HttpResponseMixin,
                           mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           generics.ListAPIView):
  permission_classes=[permissions.IsAuthenticatedOrReadOnly]
  serializer_class = TeamPublicSerializer
  passedID=None
  inputID=None
  search_fields = ('name')
  ordering_fields = ('name', 'id')
  #filter_fields=("name")
  queryset=Team.objects.all()
  def get_object(self):
    inputID=self.inputID
    queryset=self.get_queryset()
    obj=None
    if inputID is not None:
      obj=get_object_or_404(queryset,id=inputID)
      self.check_object_permissions(self.request,obj)
    return obj
  def get(self,request,*args,**kwargs):
    """This method is available only to the users with is_staff(user_manager)
    permissions.This method will return the list of Users based on the
    parameters values specified. The number of items can be controlled by the
    limit parameter. 
    ordering field can be set to either of (name, id, created, updated). It
    will sort the returned results based on that. For example
    entity/?ordering=updated or entity/?ordering=-name (Sort by name
    descending)
    If id of the User is appended to the url for example /entity/1, then
    it would return only one user corresponding to the id mentioned. 
    """
    print(f"request user {request.user}")
    self.inputID=getID(request)
    if self.inputID is not None:
      return self.retrieve(request,*args,**kwargs)
    return super().get(request,*args,**kwargs)

class UserListAPIView(HttpResponseMixin,
                           mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           generics.ListAPIView):
  permission_classes=[UserViewPermission]
  #permission_classes=[permissions.IsAuthenticatedOrReadOnly]
  #permission_classes=[permissions.IsAuthenticatedOrReadOnly]
  serializer_class = UserListSerializer
  passedID=None
  inputID=None
  search_fields = ('name', 'email')
  ordering_fields = ('name', 'id', 'created', 'updated')
  #filterset_class = ReportFilter

  filter_fields=("is_staff","is_locked","is_active","user_role","formio_usergroup","team__id")
  queryset=User.objects.all()
  def get_queryset(self, *args, **kwargs):
    if self.request.user.is_superuser:
        return User.objects.all()
    return User.objects.filter(is_superuser=False)
  def get_object(self):
    inputID=self.inputID
    queryset=self.get_queryset()
    obj=None
    if inputID is not None:
      obj=get_object_or_404(queryset,id=inputID)
      self.check_object_permissions(self.request,obj)
    return obj
  def get(self,request,*args,**kwargs):
    """This method is available only to the users with is_staff(user_manager)
    permissions.This method will return the list of Users based on the
    parameters values specified. The number of items can be controlled by the
    limit parameter. 
    ordering field can be set to either of (name, id, created, updated). It
    will sort the returned results based on that. For example
    entity/?ordering=updated or entity/?ordering=-name (Sort by name
    descending)
    If id of the User is appended to the url for example /entity/1, then
    it would return only one user corresponding to the id mentioned. 
    """
    print(f"request user {request.user}")
    self.inputID=getID(request)
    if self.inputID is not None:
      return self.retrieve(request,*args,**kwargs)
    return super().get(request,*args,**kwargs)


class UserAPIView(HttpResponseMixin,
                           mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           generics.ListAPIView):
  permission_classes=[UserViewPermission]
  #permission_classes=[permissions.IsAuthenticatedOrReadOnly]
  #permission_classes=[permissions.IsAuthenticatedOrReadOnly]
  serializer_class = UserSerializer
  passedID=None
  inputID=None
  search_fields = ('name', 'email')
  ordering_fields = ('name', 'id', 'created', 'updated')
  #filterset_class = ReportFilter

  filter_fields=("is_staff","is_locked","is_active","user_role","formio_usergroup",
                "team__id")
  queryset=User.objects.all()
  def get_queryset(self, *args, **kwargs):
    if self.request.user.is_superuser:
        return User.objects.all()
    return User.objects.filter(is_superuser=False)
  def get_object(self):
    inputID=self.inputID
    queryset=self.get_queryset()
    obj=None
    if inputID is not None:
      obj=get_object_or_404(queryset,id=inputID)
      self.check_object_permissions(self.request,obj)
    return obj
  def get(self,request,*args,**kwargs):
    """This method is available only to the users with is_staff(user_manager)
    permissions.This method will return the list of Users based on the
    parameters values specified. The number of items can be controlled by the
    limit parameter. 
    ordering field can be set to either of (name, id, created, updated). It
    will sort the returned results based on that. For example
    entity/?ordering=updated or entity/?ordering=-name (Sort by name
    descending)
    If id of the User is appended to the url for example /entity/1, then
    it would return only one user corresponding to the id mentioned. 
    """
    print(f"request user {request.user}")
    self.inputID=getID(request)
    if self.inputID is not None:
      return self.retrieve(request,*args,**kwargs)
    return super().get(request,*args,**kwargs)

  def post(self,request,*args,**kwargs):
    """This method can be used to create a user at the backend. The User will
    be activated and would not have to go through the activation method. This
    method is available only to users with is_staff(user manager)
    permissions"""
    print(request.data)
    return self.create(request,*args,**kwargs)

  def put(self,request,*args,**kwargs):
    """This method can be used to update a user at the backend. All the fields
    will be updated. User id can be specified as part of data or can be
    appended in the url for example user/1 (to edit user with id 1). This
    method is available only to users with is_staff(user manager)
    permissions"""
    self.inputID=getID(request)
    if self.inputID is None:
      data=json.dumps({"message":"Need to specify the ID for this method"})
      return self.render_to_response(data,status="404")
    return self.update(request,*args,**kwargs)

  def patch(self,request,*args,**kwargs):
    """This method can be used to patch a user at the backend. Only the fields
    passed as part of data will be updated. User id can be specified as part of data or can be
    appended in the url for example user/1 (to edit user with id 1). This
    method is available only to users with is_staff(user manager)
    permissions"""
    self.inputID=getID(request)
    print(request.POST)
    if self.inputID is None:
        data=json.dumps({"message":"Need to specify the ID for this method"})
        return self.render_to_response(data,status="404")
    return self.partial_update(request,*args,**kwargs)
   #self.inputID=getID(request)
   #print("I am here")
   #print(self.inputID)
   #serializer = UserSerializer(data=request.POST)
   #if serializer.is_valid():
   #    serializer.save()
   #    return Response(serializer.data)
   #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   #avatar = request.data['avatar']
   #print("wow")
   #obj = get_user_model().objects.filter(id=self.inputID).first()
   #obj.avatar = avatar
   #obj.name = name
   #obj.save()
   #return HttpResponse({'message': 'User Updated'}, status=200)
  #if self.inputID is None:
  #    data=json.dumps({"message":"Need to specify the ID for this method"})
  #    return self.render_to_response(data,status="404")
  #return self.partial_update(request,*args,**kwargs)

  def delete(self,request,*args,**kwargs):
    """This method can be used to delete a user. User id can be specified as part of data or can be
    appended in the url for example user/1 (to edit user with id 1). This
    method is available only to users with is_staff(user manager)
    permissions"""
    self.inputID=getID(request)
    if self.inputID is None:
      data=json.dumps({"message":"Need to specify the ID for this method"})
      return self.render_to_response(data,status="404")
    return self.destroy(request,*args,**kwargs)

class OrganizationAPIView(HttpResponseMixin,
                           mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           generics.ListAPIView):
  permission_classes=[UserViewPermission]
  serializer_class = OrganizationSerializer
  passedID=None
  inputID=None
  search_fields = ('name', 'contact_phone')
  ordering_fields = ('id', 'created', 'updated')
  #filterset_class = ReportFilter

  #filter_fields=("title")
  queryset=Organization.objects.all()
  def get_queryset(self, *args, **kwargs):
    return Organization.objects.all()
  def get_object(self):
    inputID=self.inputID
    queryset=self.get_queryset()
    obj=None
    if inputID is not None:
      obj=get_object_or_404(queryset,id=inputID)
      self.check_object_permissions(self.request,obj)
    return obj
  def get(self,request,*args,**kwargs):
    """This method is available only to the users with is_staff(user_manager)
    permissions.This method will return the list of Users based on the
    parameters values specified. The number of items can be controlled by the
    limit parameter. 
    ordering field can be set to either of (name, id, created, updated). It
    will sort the returned results based on that. For example
    entity/?ordering=updated or entity/?ordering=-name (Sort by name
    descending)
    If id of the User is appended to the url for example /entity/1, then
    it would return only one user corresponding to the id mentioned. 
    """
    if not request.user.is_staff:
       raise PermissionDenied()
    self.inputID=getID(request)
    if self.inputID is not None:
      return self.retrieve(request,*args,**kwargs)
    return super().get(request,*args,**kwargs)

  def post(self,request,*args,**kwargs):
    """This method can be used to create a user at the backend. The User will
    be activated and would not have to go through the activation method. This
    method is available only to users with is_staff(user manager)
    permissions"""
    print(request.data)
    return self.create(request,*args,**kwargs)

  def put(self,request,*args,**kwargs):
    """This method can be used to update a user at the backend. All the fields
    will be updated. User id can be specified as part of data or can be
    appended in the url for example user/1 (to edit user with id 1). This
    method is available only to users with is_staff(user manager)
    permissions"""
    self.inputID=getID(request)
    if self.inputID is None:
      data=json.dumps({"message":"Need to specify the ID for this method"})
      return self.render_to_response(data,status="404")
    return self.update(request,*args,**kwargs)

  def patch(self,request,*args,**kwargs):
    """This method can be used to patch a user at the backend. Only the fields
    passed as part of data will be updated. User id can be specified as part of data or can be
    appended in the url for example user/1 (to edit user with id 1). This
    method is available only to users with is_staff(user manager)
    permissions"""
    self.inputID=getID(request)
    print(request.POST)
    if self.inputID is None:
        data=json.dumps({"message":"Need to specify the ID for this method"})
        return self.render_to_response(data,status="404")
    return self.partial_update(request,*args,**kwargs)

  def delete(self,request,*args,**kwargs):
    """This method can be used to delete a user. User id can be specified as part of data or can be
    appended in the url for example user/1 (to edit user with id 1). This
    method is available only to users with is_staff(user manager)
    permissions"""
    self.inputID=getID(request)
    if self.inputID is None:
      data=json.dumps({"message":"Need to specify the ID for this method"})
      return self.render_to_response(data,status="404")
    return self.destroy(request,*args,**kwargs)


class TeamAPIView(HttpResponseMixin,
                           mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           generics.ListAPIView):
  permission_classes=[UserViewPermission]
  serializer_class = TeamSerializer
  passedID=None
  inputID=None
  search_fields = ('title')
  ordering_fields = ('title', 'id', 'created', 'updated')
  #filterset_class = ReportFilter

  #filter_fields=("title")
  queryset=Team.objects.all()
  def get_queryset(self, *args, **kwargs):
    if self.request.user.is_superuser:
        return Team.objects.all()
    return Team.objects.all()
  def get_object(self):
    inputID=self.inputID
    queryset=self.get_queryset()
    obj=None
    if inputID is not None:
      obj=get_object_or_404(queryset,id=inputID)
      self.check_object_permissions(self.request,obj)
    return obj
  def get(self,request,*args,**kwargs):
    """This method is available only to the users with is_staff(user_manager)
    permissions.This method will return the list of Users based on the
    parameters values specified. The number of items can be controlled by the
    limit parameter. 
    ordering field can be set to either of (name, id, created, updated). It
    will sort the returned results based on that. For example
    entity/?ordering=updated or entity/?ordering=-name (Sort by name
    descending)
    If id of the User is appended to the url for example /entity/1, then
    it would return only one user corresponding to the id mentioned. 
    """
    if not request.user.is_staff:
       raise PermissionDenied()
    self.inputID=getID(request)
    if self.inputID is not None:
      return self.retrieve(request,*args,**kwargs)
    return super().get(request,*args,**kwargs)

  def post(self,request,*args,**kwargs):
    """This method can be used to create a user at the backend. The User will
    be activated and would not have to go through the activation method. This
    method is available only to users with is_staff(user manager)
    permissions"""
    print(request.data)
    return self.create(request,*args,**kwargs)

  def put(self,request,*args,**kwargs):
    """This method can be used to update a user at the backend. All the fields
    will be updated. User id can be specified as part of data or can be
    appended in the url for example user/1 (to edit user with id 1). This
    method is available only to users with is_staff(user manager)
    permissions"""
    self.inputID=getID(request)
    if self.inputID is None:
      data=json.dumps({"message":"Need to specify the ID for this method"})
      return self.render_to_response(data,status="404")
    return self.update(request,*args,**kwargs)

  def patch(self,request,*args,**kwargs):
    """This method can be used to patch a user at the backend. Only the fields
    passed as part of data will be updated. User id can be specified as part of data or can be
    appended in the url for example user/1 (to edit user with id 1). This
    method is available only to users with is_staff(user manager)
    permissions"""
    self.inputID=getID(request)
    print(request.POST)
    if self.inputID is None:
        data=json.dumps({"message":"Need to specify the ID for this method"})
        return self.render_to_response(data,status="404")
    return self.partial_update(request,*args,**kwargs)

  def delete(self,request,*args,**kwargs):
    """This method can be used to delete a user. User id can be specified as part of data or can be
    appended in the url for example user/1 (to edit user with id 1). This
    method is available only to users with is_staff(user manager)
    permissions"""
    self.inputID=getID(request)
    if self.inputID is None:
      data=json.dumps({"message":"Need to specify the ID for this method"})
      return self.render_to_response(data,status="404")
    return self.destroy(request,*args,**kwargs)


