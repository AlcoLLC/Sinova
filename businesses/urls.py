from django.urls import path
from . import views

app_name = 'businesses'

urlpatterns = [
    path('businesses/', views.category_list, name='businesses'),
    path('businesses/<slug:category_slug>/', views.category_detail, name='category_detail')
]
