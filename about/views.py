from django.shortcuts import render
from .models import About, AboutValuesContent
from gallery.models import GalleryImage

def about_detail(request, tab=None):        
    about = About.objects.first()
    gallery_subscribe_images = GalleryImage.objects.filter(
        is_active=True, 
        in_subscribe=True
    ).select_related('gallery').order_by('order', '-created_at')
    
    values = AboutValuesContent.objects.filter(about=about)
    
    context = {
        'about': about,
        'values': values,
        'gallery_subscribe_images': gallery_subscribe_images,
        'active_tab': tab 
    }
    return render(request, 'about.html', context)

def about_with_tab(request, tab):
    return about_detail(request, tab=tab)
