

from django.urls import path, include
from baseapp import views

app_name = 'baseapp'
urlpatterns = [
#    path('covid/', views.CovidAPIView.as_view(), name='create'),
    path('entity/', views.EntityAPIView.as_view(), name='entity'),
    path('feedback/', views.FeedbackAPIView.as_view(), name='feedback'),
#    path('create/', views.CreateEntityView.as_view(), name='create'),
#    path('bulkdelete/', views.CovidBulkDeleteView.as_view(), name='bulkdelete'),
]
