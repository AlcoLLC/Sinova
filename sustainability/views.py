from django.shortcuts import render, get_object_or_404
from django.http import Http404
from .models import Sustainability, SubtainabilityContent

def sustainability_view(request):
    try:
        sustainability = Sustainability.objects.filter(is_active=True).first()
        
        sub_contents = SubtainabilityContent.objects.filter(
            sustainability=sustainability, 
            is_active=True
        ).order_by('created_at')
        
        context = {
            'sustainability': sustainability,
            'sub_contents': sub_contents,
        }
        
        return render(request, 'sustainability/sustainability.html', context)
    
    except Exception as e:
        raise Http404("An error occurred while loading the page")