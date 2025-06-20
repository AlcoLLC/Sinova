from django.urls import path
from . import views

app_name = 'about'

urlpatterns = [
    path('about/', views.AboutView.as_view(), name='about'),
    

    # path('#history', views.AboutView.as_view(), name='history'),
    # path('#mission-vision', views.AboutView.as_view(), name='mission_vision'), 
    # path('#values', views.AboutView.as_view(), name='values'),
    # path('#policies', views.AboutView.as_view(), name='policies'),
]