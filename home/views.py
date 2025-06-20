from django.shortcuts import render
from django.views.generic import ListView
from .models import HomeContent


def home_view(request):
    home_contents = HomeContent.objects.all().order_by('-created_at')
    context = {
        'home_contents': home_contents
    }
    return render(request, 'home.html', context)