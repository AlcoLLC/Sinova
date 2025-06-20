from django.urls import path
from . import views

app_name = 'subscription'

urlpatterns = [
    path('', views.subscription_form, name='form'),
    path('subscribe/', views.subscribe_email, name='subscribe'),
    path('unsubscribe/', views.unsubscribe_email, name='unsubscribe'),
    path('stats/', views.subscription_stats, name='stats'),
]