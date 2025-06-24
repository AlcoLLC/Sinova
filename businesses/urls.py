from django.urls import path
from . import views

app_name = 'businesses'

urlpatterns = [
    path('businesses/', views.category_list, name='businesses_list'),
]