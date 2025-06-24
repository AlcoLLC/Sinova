from django.urls import path
from . import views

app_name = 'investorRelation'

urlpatterns = [
    path('investorRelation/', views.category_list, name='investorRelation_list')
]