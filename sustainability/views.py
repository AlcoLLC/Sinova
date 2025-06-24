from django.shortcuts import render, get_object_or_404
from django.http import Http404
from .models import Sustainability, SubtainabilityContent
from gallery.models import GalleryImage

def sustainability_view(request):
    sustainability = Sustainability.objects.filter(is_active=True).first()

    gallery_subscribe_images = GalleryImage.objects.filter(
        is_active=True, 
        in_subscribe = True
    ).select_related('gallery').order_by('order', '-created_at')
    
    sub_contents = SubtainabilityContent.objects.filter(
        sustainability=sustainability, 
        is_active=True
    ).order_by('created_at')

    
    context = {
        'sustainability': sustainability,
        'sub_contents': sub_contents,
        'gallery_subscribe_images' : gallery_subscribe_images
    }
    
    return render(request, 'sustainability.html', context)
