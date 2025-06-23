from django.urls import path
from . import views

app_name = 'sustainability'

urlpatterns = [
    path('sustainability/', views.sustainability_view, name='sustainability'),
]
