from django.shortcuts import render
from .models import Gallery
from django.core.paginator import Paginator


def gallery_view(request):
    gallery = Gallery.objects.filter(is_active=True).first()
    gallery_list = gallery.gallery_items.filter(is_active=True).order_by('order')
    paginator = Paginator(gallery_list, 6) 
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'gallery.html', {
        'gallery': gallery,
        'page_obj': page_obj,
    })
