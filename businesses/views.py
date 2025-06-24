from django.shortcuts import render
from django.views.generic import ListView
from .models import Category
from gallery.models import GalleryImage


def category_list(request):
    categories = Category.objects.filter(is_active=True).prefetch_related('features').order_by('order', 'title')
    gallery_subscribe_images = GalleryImage.objects.filter(
        is_active=True, 
        in_subscribe = True
    ).select_related('gallery').order_by('order', '-created_at')
    
    context = {
        'categories': categories,
        'page_title': 'Our Services',
        'gallery_subscribe_images' : gallery_subscribe_images
    }
    return render(request, 'businesses.html', context)