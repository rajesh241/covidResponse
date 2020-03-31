

from django.urls import path, include
from baseapp import views

app_name = 'baseapp'
urlpatterns = [
    path('covid/', views.CovidAPIView.as_view(), name='create'),
    path('context/', views.ContextAPIView.as_view(), name='context'),
    path('bulkdelete/', views.CovidBulkDeleteView.as_view(), name='bulkdelete'),
]
