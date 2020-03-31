from django.shortcuts import render
import json
from django.views.generic import View
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from django_filters import rest_framework as filters
from rest_framework import mixins, generics, permissions
from baseapp.models import Covid, Context
from user.mixins import HttpResponseMixin
from .serializers import (CovidSerializer,ItemSerializer, ContextSerializer,
                          ContextPublicSerializer
                         )
from user.permissions import IsStaffReadWriteOrAuthReadOnly, IsStaffReadWriteOrReadOnly
from user.utils import is_json


# Create your views here.
def get_id_from_request(request):
    """Small function to retrieve the Id from request
    It can either take id from get parameters
    or it can retrieve id from the input Json data
    """
    url_id = request.GET.get('id', None)
    input_json_id = None
    if is_json(request.body):
        input_json_data = json.loads(request.body)
        input_json_id = input_json_data.get("id", None)
    input_id = url_id or input_json_id or None
    return input_id


class CovidFilter(filters.FilterSet):
 #   min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
 #   max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')

    class Meta:
        model = Covid
        #fields = ('number_of_rooms', 'floor_area_size',
        #          'price_per_month', 'is_available')
        fields = {
                    'id': ['gte', 'lte'],
                    'latitude' : ['gte', 'lte'],
                    'longitude' : ['gte', 'lte']
                }
    @property
    def qs(self):
        parent_qs = super(CovidFilter, self).qs
        return parent_qs
       #if 'finyear' in self.request.query_params:
       #    return parent_qs
       #else:
       #    return parent_qs.filter(finyear='NA')




class CovidAPIView(HttpResponseMixin,
                    mixins.CreateModelMixin,
                    mixins.DestroyModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    generics.ListAPIView):
    """API View for the Report Model"""
    permission_classes = [IsStaffReadWriteOrAuthReadOnly]
    #permission_classes = [permissions.IsAuthenticated]
    serializer_class = CovidSerializer
    passed_id = None
    input_id = None
    search_fields = ('name',)
    ordering_fields = ('name', 'id', 'created', 'updated')
    filterset_class = CovidFilter
    queryset = Covid.objects.all()
    def get_queryset(self, *args, **kwargs):
       if self.request.user.is_staff:
           return Covid.objects.all()
       return Covid.objects.all()
    def get_object(self):
        input_id = self.input_id
        queryset = self.get_queryset()
        obj = None
        if input_id is not None:
            obj = get_object_or_404(queryset, id=input_id)
            self.check_object_permissions(self.request, obj)
        return obj
    def get(self, request, *args, **kwargs):
        print(f"I am in get request {request.user}")
        self.input_id = get_id_from_request(request)
        if self.input_id is not None:
            return self.retrieve(request, *args, **kwargs)
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """Post method would create a apartment object"""
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """put method will update the apartment object. All fields need to be
        present"""
        self.input_id = get_id_from_request(request)
        if self.input_id is None:
            data = json.dumps({"message":"Need to specify the ID for this method"})
            return self.render_to_response(data, status="404")
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """patch method will update the object, with the specified fields. All
        fields need not be present"""
        self.input_id = get_id_from_request(request)
        if self.input_id is None:
                data = json.dumps({"message":"Need to specify the ID for this method"})
                return self.render_to_response(data, status="404")
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """Will delete the retrieved object"""
        self.input_id = get_id_from_request(request)
        if self.input_id is None:
            data = json.dumps({"message":"Need to specify the ID for this method"})
            return self.render_to_response(data, status="404")
        return self.destroy(request, *args, **kwargs)

class CovidBulkDeleteView(GenericAPIView):
    throttle_classes = ()
    permission_classes = [IsStaffReadWriteOrAuthReadOnly]
    serializer_class = ItemSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_ids = serializer.data['user_ids']
        if (len(user_ids) == 1) and (user_ids[0] == 'all'):
            Covid.objects.all().delete()
        else:
            Covid.objects.filter(id__in=user_ids).delete()
        return Response({'status': 'OK'})



class CreateContextView(generics.CreateAPIView):
    """Create a new user in the system"""
    permission_classes = (permissions.AllowAny,)
    serializer_class = ContextPublicSerializer

class ContextFilter(filters.FilterSet):
 #   min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
 #   max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')

    class Meta:
        model = Context
        #fields = ('number_of_rooms', 'floor_area_size',
        #          'price_per_month', 'is_available')
        fields = {
                    'id': ['gte', 'lte'],
                    'latitude' : ['gte', 'lte'],
                    'longitude' : ['gte', 'lte']
                }
    @property
    def qs(self):
        parent_qs = super(ContextFilter, self).qs
        return parent_qs
       #if 'finyear' in self.request.query_params:
       #    return parent_qs
       #else:
       #    return parent_qs.filter(finyear='NA')




class ContextAPIView(HttpResponseMixin,
                    mixins.CreateModelMixin,
                    mixins.DestroyModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    generics.ListAPIView):
    """API View for the Report Model"""
    permission_classes = [IsStaffReadWriteOrReadOnly]
    #permission_classes = [permissions.IsAuthenticated]
    serializer_class = ContextSerializer
    passed_id = None
    input_id = None
    search_fields = ('name',)
    ordering_fields = ('name', 'id', 'created', 'updated')
    filterset_class = ContextFilter
    queryset = Context.objects.all()
    def get_queryset(self, *args, **kwargs):
       if self.request.user.is_staff:
           return Context.objects.all()
       return Context.objects.all()
    def get_object(self):
        input_id = self.input_id
        queryset = self.get_queryset()
        obj = None
        if input_id is not None:
            obj = get_object_or_404(queryset, id=input_id)
            self.check_object_permissions(self.request, obj)
        return obj
    def get(self, request, *args, **kwargs):
        print(f"I am in get request {request.user}")
        self.input_id = get_id_from_request(request)
        if self.input_id is not None:
            return self.retrieve(request, *args, **kwargs)
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """Post method would create a apartment object"""
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """put method will update the apartment object. All fields need to be
        present"""
        self.input_id = get_id_from_request(request)
        if self.input_id is None:
            data = json.dumps({"message":"Need to specify the ID for this method"})
            return self.render_to_response(data, status="404")
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """patch method will update the object, with the specified fields. All
        fields need not be present"""
        self.input_id = get_id_from_request(request)
        if self.input_id is None:
                data = json.dumps({"message":"Need to specify the ID for this method"})
                return self.render_to_response(data, status="404")
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """Will delete the retrieved object"""
        self.input_id = get_id_from_request(request)
        if self.input_id is None:
            data = json.dumps({"message":"Need to specify the ID for this method"})
            return self.render_to_response(data, status="404")
        return self.destroy(request, *args, **kwargs)

