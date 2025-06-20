from django.shortcuts import render
from django.db.models import Q
from gallery.models import GalleryImage
from news.models import News
from .models import HomeContent, PickUp

def home_view(request):
    gallery_images = GalleryImage.objects.filter(
        is_active=True, 
        in_home=True,
        gallery__is_active=True
    ).select_related('gallery').order_by('order', '-created_at')
    
    news_new = News.objects.filter(
        is_active=True, 
        new=True
    ).order_by('order', '-date')[:5] 
    
    news_releases = News.objects.filter(
        is_active=True, 
        new=False, 
        announcements=False
    ).order_by('order', '-date')[:5]  
    
    news_announcements = News.objects.filter(
        is_active=True, 
        announcements=True
    ).order_by('order', '-date')[:5] 
    
    home_contents = HomeContent.objects.all().order_by('id')[:3]
    
    pickup_items = PickUp.objects.filter(is_active=True).order_by('id')
    
    context = {
        'gallery_images': gallery_images,
        'news_new': news_new,
        'news_releases': news_releases,
        'news_announcements': news_announcements,
        'home_contents': home_contents,
        'pickup_items': pickup_items,
    }
    
    return render(request, 'home.html', context)