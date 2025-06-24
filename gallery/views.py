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
            'page_obj': [],
        })
    
    gallery_list = gallery.gallery_items.filter(is_active=True).order_by('order')
    paginator = Paginator(gallery_list, 12)  
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        images_data = []
        for image in page_obj:
            images_data.append({
                'url': image.image.url,
                'alt': gallery.iframe_video_text or 'Gallery Image'
            })
        
        return JsonResponse({
            'images': images_data,
            'current_page': page_obj.number,
            'has_next': page_obj.has_next(),
            'next_page_url': f'?page={page_obj.next_page_number()}' if page_obj.has_next() else None,
            'total_pages': paginator.num_pages
        })
    
    return render(request, 'gallery.html', {
        'gallery': gallery,
        'page_obj': page_obj,
    })


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