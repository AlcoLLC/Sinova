from django.shortcuts import render, get_object_or_404
from .models import Category
from gallery.models import GalleryImage

def category_list(request):
    categories = Category.objects.filter(is_active=True).prefetch_related('features').order_by('order', 'title')
    investor_categories = Category.objects.filter(is_active=True).prefetch_related('features').order_by('order', 'title')
    gallery_subscribe_images = GalleryImage.objects.filter(
        is_active=True, 
        in_subscribe=True
    ).select_related('gallery').order_by('order', '-created_at')
    
    context = {
        'categories': categories,
        'investor_categories': investor_categories,
        'gallery_subscribe_images': gallery_subscribe_images
    }
    return render(request, 'investorRelations.html', context)

def category_detail(request, category_slug):
    category = get_object_or_404(Category, slug=category_slug, is_active=True)
    categories = Category.objects.filter(is_active=True).prefetch_related('features').order_by('order', 'title')
    gallery_subscribe_images = GalleryImage.objects.filter(
        is_active=True, 
        in_subscribe=True
    ).select_related('gallery').order_by('order', '-created_at')
    investor_categories = Category.objects.filter(is_active=True).prefetch_related('features').order_by('order', 'title')

    
    context = {
        'categories': categories,
        'active_category': category,
        'gallery_subscribe_images': gallery_subscribe_images,
        'investor_categories':investor_categories
    }
    return render(request, 'investorRelations.html', context)