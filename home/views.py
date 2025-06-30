from django.shortcuts import render
from django.db.models import Q
from gallery.models import GalleryImage
from news.models import News
from .models import HomeContent, PickUp

def home_view(request):
    home_news = News.objects.filter(in_home=True).order_by('-created_at')
    home_news_list = list(home_news[:3])
    large_card_news = home_news_list[0] if home_news_list else None
    small_cards_news = home_news_list[1:3] if len(home_news_list) > 1 else []

    gallery_images = GalleryImage.objects.filter(
        is_active=True, 
        in_home=True
    ).select_related('gallery').order_by('order', '-created_at')

    gallery_subscribe_images = GalleryImage.objects.filter(
        is_active=True, 
        in_subscribe = True
    ).select_related('gallery').order_by('order', '-created_at')
    

    home_contents = HomeContent.objects.all().order_by('id')[:3]
    
    pickup_items = PickUp.objects.filter(is_active=True).order_by('id')
    
    context = {
        'gallery_images': gallery_images,
        'home_contents': home_contents,
        'pickup_items': pickup_items,
        'gallery_subscribe_images': gallery_subscribe_images,
        'large_card_news': large_card_news,
        'small_cards_news': small_cards_news
    }
    
    return render(request, 'home.html', context)