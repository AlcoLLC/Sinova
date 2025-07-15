from django.urls import path
from . import views

app_name = 'contact'

urlpatterns = [
    path('contact/', views.contact_view, name='contact'),
    path('test-404/', views.test_404, name='test_404'),
]