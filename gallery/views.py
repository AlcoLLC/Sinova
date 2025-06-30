from django.shortcuts import render
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.template.loader import render_to_string
from .models import Gallery

def gallery_view(request):
    gallery = Gallery.objects.filter(is_active=True).first()
    
    if not gallery:
        return render(request, 'gallery.html', {
            'gallery': None,
            'gallery_images': [],
        })
    
    gallery_images = gallery.gallery_items.filter(is_active=True).order_by('order')
    
    return render(request, 'gallery.html', {
        'gallery': gallery,
        'gallery_images': gallery_images,
    })

# Alternatif: Eğer tüm resimleri bir seferde yüklemek istiyorsan
def gallery_view_simple(request):
    gallery = Gallery.objects.filter(is_active=True).first()
    
    if not gallery:
        return render(request, 'gallery.html', {
            'gallery': None,
            'gallery_images': [],
        })
    
    gallery_images = gallery.gallery_items.filter(is_active=True).order_by('order')
    
    return render(request, 'gallery.html', {
        'gallery': gallery,
        'gallery_images': gallery_images,
    })