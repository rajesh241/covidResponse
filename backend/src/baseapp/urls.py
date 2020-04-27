

from django.urls import path, include
from baseapp import views

app_name = 'baseapp'
urlpatterns = [
#    path('covid/', views.CovidAPIView.as_view(), name='create'),
    path('entity/', views.EntityAPIView.as_view(), name='entity'),
    path('entityhistory/', views.EntityHistoryAPIView.as_view(), name='history'),
    path('entitylist/', views.EntityListAPIView.as_view(), name='entitylist'),
    path('entitysmall/', views.EntitySmallAPIView.as_view(), name='entitysmall'),
    path('entitybulkedit/', views.EntityBulkEditAPIView.as_view(), name='bulkedit'),
    path('feedback/', views.FeedbackAPIView.as_view(), name='feedback'),
    path('bulkoperation/', views.BulkOperationAPIView.as_view(), name='bulkoperation'),
#    path('create/', views.CreateEntityView.as_view(), name='create'),
#    path('bulkdelete/', views.CovidBulkDeleteView.as_view(), name='bulkdelete'),
]
