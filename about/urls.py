from django.urls import path
from . import views

app_name = 'about'

urlpatterns = [
    path('about/', views.about_detail, name='about'),
    path('about/<str:tab>/', views.about_with_tab, name='about_tab'),
]