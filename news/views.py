from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from .models import News

def news_list(request):
    news_new = News.objects.filter(
        is_active=True, 
        new=True
    ).order_by('order', '-date')
    
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
    ).order_by('order', '-date')
    
    news_announcements = News.objects.filter(
        is_active=True, 
        announcement=True
    ).order_by('order', '-date')
    
    context = {
        'news_new': news_new,
        'news_releases': news_releases,
        'news_announcements': news_announcements,
    }
    
    return render(request, 'news.html', context)

def news_detail(request, slug):
    news = get_object_or_404(News, slug=slug, is_active=True)

    context = {
        'news': news,
    }
    
    return render(request, 'news_detail.html', context)