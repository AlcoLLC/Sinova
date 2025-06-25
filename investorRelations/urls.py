from django.urls import path
from . import views

app_name = 'investorRelation'

urlpatterns = [
    path('investorRelation/', views.category_list, name='investorRelation'),
    path('investorRelation/<slug:category_slug>/', views.category_detail, name='category_detail')
]