from django.urls import path
from . import views

app_name = 'businesses'

urlpatterns = [
    # Class-based view
    path('businesses/', views.CategoryListView.as_view(), name='businesses_list'),
    
    # Function-based view alternative (comment out class-based view above if using this)
    # path('', views.category_list, name='category_list'),
]