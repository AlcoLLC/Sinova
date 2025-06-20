from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from .models import News

def news_list(request):
    news_queryset = News.objects.filter(is_active=True)
    
    filter_type = request.GET.get('filter', 'all')
    if filter_type == 'new':
        news_queryset = news_queryset.filter(new=True)
    elif filter_type == 'announcements':
        news_queryset = news_queryset.filter(announcements=True)
    elif filter_type == 'news':
        news_queryset = news_queryset.filter(new=False, announcements=False)

    
    year = request.GET.get('year')
    if year:
        news_queryset = news_queryset.filter(date__year=year)
    
    month = request.GET.get('month')
    if month:
        news_queryset = news_queryset.filter(date__month=month)
    
    paginator = Paginator(news_queryset, 10) 
    page_number = request.GET.get('page')
    news_list = paginator.get_page(page_number)
    
    available_years = News.objects.filter(is_active=True).dates('date', 'year', order='DESC')
    
    context = {
        'news_list': news_list,
        'filter_type': filter_type,
        'available_years': available_years,
        'selected_year': year,
        'selected_month': month,
    }
    
    return render(request, 'news.html', context)

def news_detail(request, slug):
    news = get_object_or_404(News, slug=slug, is_active=True)

    context = {
        'news': news,
    }
    
    return render(request, 'news_detail.html', context)