from django.shortcuts import render
from .models import About, AboutValuesContent

def about_detail(request):        
    about = About.objects.first()
    values = AboutValuesContent.objects.filter(about=about)
    
    context = {
        'about': about,
        'values': values,
    }
    return render(request, 'about.html', context)
