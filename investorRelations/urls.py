from django.urls import path
from . import views

app_name = 'investorRelation'

urlpatterns = [
    # Class-based view
    path('investorRelation', views.CategoryListView.as_view(), name='investorRelation_list'),
    
    # Function-based view alternative (comment out class-based view above if using this)
    # path('', views.category_list, name='category_list'),
]