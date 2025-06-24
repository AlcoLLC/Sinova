from django.shortcuts import render
from django.db.models import Q
from gallery.models import GalleryImage
from news.models import News
from .models import HomeContent, PickUp

def home_view(request):
    gallery_images = GalleryImage.objects.filter(
        is_active=True, 
        in_home=True
    ).select_related('gallery').order_by('order', '-created_at')

    gallery_subscribe_images = GalleryImage.objects.filter(
        is_active=True, 
        in_subscribe = True
    ).select_related('gallery').order_by('order', '-created_at')
    
    # Önce new=True olanları al
    news_new = News.objects.filter(
        is_active=True, 
        new=True
    ).order_by('order', '-date')[:5]
    
    if news_new.count() < 5:
        remaining_count = 5 - news_new.count()
        additional_news = News.objects.filter(
            is_active=True,
            new=False
        ).order_by('order', '-date')[:remaining_count]
        
        news_new = list(news_new) + list(additional_news)
    
    news_releases = News.objects.filter(
        is_active=True, 
        release=True
    ).order_by('order', '-date')[:5]  
    
    news_announcements = News.objects.filter(
        is_active=True, 
        announcement=True
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
        'gallery_subscribe_images': gallery_subscribe_images
    }
    
    return render(request, 'home.html', context)