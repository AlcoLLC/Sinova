from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from django.core.paginator import Paginator
from about.models import About, AboutValuesContent
from businesses.models import Category as BusinessCategory, CategoryFeature as BusinessCategoryFeature
from contact.models import ContactInfo
from gallery.models import Gallery, GalleryImage
from home.models import HomeContent, PickUp
from investorRelations.models import Category as InvestorCategory, CategoryFeature as InvestorCategoryFeature
from news.models import News
from pageHeader.models import PageHeader
from sustainability.models import Sustainability, SubtainabilityContent


def normalize_turkish_text(text):
    if not text:
        return ""
    
    turkish_chars = {
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G', 
        'ı': 'i', 'I': 'I',
        'İ': 'I', 'i': 'i',
        'ö': 'o', 'Ö': 'O',
        'ş': 's', 'Ş': 'S',
        'ü': 'u', 'Ü': 'U'
    }
    
    normalized = text
    for tr_char, en_char in turkish_chars.items():
        normalized = normalized.replace(tr_char, en_char)
    
    return normalized


def create_comprehensive_search_q(query, fields):
    if not query or not fields:
        return Q()
    
    q_objects = Q()
    query_clean = query.strip()
    
    for field in fields:
        q_objects |= Q(**{f"{field}__icontains": query_clean})
        
        q_objects |= Q(**{f"{field}__iexact": query_clean})
        
        normalized_query = normalize_turkish_text(query_clean)
        if normalized_query != query_clean:
            q_objects |= Q(**{f"{field}__icontains": normalized_query})
    
    words = [word.strip() for word in query_clean.split() if word.strip()]
    for word in words:
        for field in fields:
            q_objects |= Q(**{f"{field}__icontains": word})
            
            normalized_word = normalize_turkish_text(word)
            if normalized_word != word:
                q_objects |= Q(**{f"{field}__icontains": normalized_word})
    
    if len(query_clean) == 1:
        for field in fields:
            q_objects |= Q(**{f"{field}__icontains": query_clean})
            normalized_char = normalize_turkish_text(query_clean)
            if normalized_char != query_clean:
                q_objects |= Q(**{f"{field}__icontains": normalized_char})
    
    for field in fields:
        q_objects |= Q(**{f"{field}__istartswith": query_clean})
        q_objects |= Q(**{f"{field}__iendswith": query_clean})
        q_objects |= Q(**{f"{field}__iregex": f".*{query_clean}.*"})
    
    return q_objects


def search_all_models(query):
    results = []
    
    if not query:
        return results
    
    try:
        about_fields = ['iframe_video_text', 'our_history_content_one', 
                       'our_history_content_two', 'our_mission', 'our_vision', 'policies_description']
        
        abouts = About.objects.filter(
            create_comprehensive_search_q(query, about_fields)
        ).distinct()
        
        for about in abouts:
            results.append({
                'title': 'About',
                'description': (about.our_history_content_one or about.our_mission or about.our_vision or '')[:200] + '...',
                'url': '/about/',
                'type': 'About',
                'image': about.our_mission_image.url if about.our_mission_image else None,
                'model': 'About'
            })
    except Exception as e:
        print(f"About model error: {e}")
    
    # About Values
    try:
        about_values_fields = ['title', 'description']
        about_values = AboutValuesContent.objects.filter(
            create_comprehensive_search_q(query, about_values_fields)
        ).select_related('about').distinct()
        
        for value in about_values:
            results.append({
                'title': f'Values - {value.title}',
                'description': (value.description or '')[:200] + '...',
                'url': '/about/',
                'type': 'About',
                'image': None,
                'model': 'AboutValues'
            })
    except Exception as e:
        print(f"AboutValues model error: {e}")
    
    try:
        business_category_fields = ['title', 'description']
        business_categories = BusinessCategory.objects.filter(
            create_comprehensive_search_q(query, business_category_fields),
            is_active=True
        ).distinct()
        
        for category in business_categories:
            results.append({
                'title': category.title,
                'description': (category.description or '')[:200] + '...',
                'url': f'/businesses/{category.slug}/',
                'type': 'Businesses',
                'image': category.main_image.url if category.main_image else None,
                'model': 'BusinessCategory'
            })
    except Exception as e:
        print(f"BusinessCategory model error: {e}")
    
    # Business Features
    try:
        business_feature_fields = ['title']
        business_features = BusinessCategoryFeature.objects.filter(
            create_comprehensive_search_q(query, business_feature_fields)
        ).select_related('category').distinct()
        
        for feature in business_features:
            results.append({
                'title': f'{feature.category.title} - {feature.title}',
                'description': f'{feature.category.title} category business feature',
                'url': f'/businesses/{feature.category.slug}/',
                'type': 'Businesses category',
                'image': feature.category.main_image.url if feature.category.main_image else None,
                'model': 'BusinessFeature'
            })
    except Exception as e:
        print(f"BusinessFeature model error: {e}")
    
    try:
        contact_fields = ['address', 'phone_number', 'email']
        contacts = ContactInfo.objects.filter(
            create_comprehensive_search_q(query, contact_fields)
        ).distinct()
        
        for contact in contacts:
            results.append({
                'title': 'Contact Information',
                'description': f'Address: {contact.address}, Phone: {contact.phone_number}, E-mail: {contact.email}',
                'url': '/contact/',
                'type': 'Contact',
                'image': contact.image.url if contact.image else None,
                'model': 'Contact'
            })
    except Exception as e:
        print(f"Contact model error: {e}")
    
    try:
        gallery_fields = ['iframe_video_text']
        galleries = Gallery.objects.filter(
            create_comprehensive_search_q(query, gallery_fields),
            is_active=True
        ).distinct()
        
        for gallery in galleries:
            results.append({
                'title': 'Gallery',
                'description': gallery.iframe_video_text or '',
                'url': '/gallery/',
                'type': 'Gallery',
                'image': gallery.iframe_video_image.url if gallery.iframe_video_image else None,
                'model': 'Gallery'
            })
    except Exception as e:
        print(f"Gallery model error: {e}")
    
    try:
        gallery_images = GalleryImage.objects.filter(
            Q(gallery__iframe_video_text__icontains=query) |
            Q(gallery__iframe_video_text__iregex=f".*{query}.*"),
            is_active=True
        ).select_related('gallery').distinct()
        
        for image in gallery_images:
            results.append({
                'title': f'Gallery Photo - {image.gallery.iframe_video_text}',
                'description': f'{image.gallery.iframe_video_text} image from gallery',
                'url': '/gallery/',
                'type': 'Gallery Photo',
                'image': image.image.url if image.image else None,
                'model': 'GalleryImage'
            })
    except Exception as e:
        print(f"GalleryImage model error: {e}")
    
    try:
        home_fields = ['title', 'description', 'subtitle', 'subdescription']
        home_contents = HomeContent.objects.filter(
            create_comprehensive_search_q(query, home_fields)
        ).distinct()
        
        for content in home_contents:
            results.append({
                'title': content.title or 'Home',
                'description': (content.description or content.subdescription or '')[:200] + '...',
                'url': '/',
                'type': 'Home',
                'image': content.image.url if content.image else None,
                'model': 'HomeContent'
            })
    except Exception as e:
        print(f"HomeContent model error: {e}")
    
    # PickUp Services
    try:
        pickup_fields = ['title']
        pickups = PickUp.objects.filter(
            create_comprehensive_search_q(query, pickup_fields),
            is_active=True
        ).distinct()
        
        for pickup in pickups:
            results.append({
                'title': pickup.title,
                'description': f'Pick up: {pickup.title}',
                'url': '/',
                'type': 'Pick up',
                'image': pickup.image.url if pickup.image else None,
                'model': 'PickUp'
            })
    except Exception as e:
        print(f"PickUp model error: {e}")
    
    try:
        investor_category_fields = ['title', 'description']
        investor_categories = InvestorCategory.objects.filter(
            create_comprehensive_search_q(query, investor_category_fields),
            is_active=True
        ).distinct()
        
        for category in investor_categories:
            results.append({
                'title': category.title,
                'description': (category.description or '')[:200] + '...',
                'url': f'/investorRelation/{category.slug}/',
                'type': 'Investor Relation',
                'image': category.main_image.url if category.main_image else None,
                'model': 'InvestorCategory'
            })
    except Exception as e:
        print(f"InvestorCategory model error: {e}")
    
    try:
        investor_feature_fields = ['title']
        investor_features = InvestorCategoryFeature.objects.filter(
            create_comprehensive_search_q(query, investor_feature_fields)
        ).select_related('category').distinct()
        
        for feature in investor_features:
            results.append({
                'title': f'{feature.category.title} - {feature.title}',
                'description': f'Investor relations feature in {feature.category.title} category',
                'url': f'/investorRelation/{feature.category.slug}/',
                'type': 'Investor Relation',
                'image': feature.category.main_image.url if feature.category.main_image else None,
                'model': 'InvestorFeature'
            })
    except Exception as e:
        print(f"InvestorFeature model error: {e}")
    
    try:
        news_fields = ['title', 'content']
        news_items = News.objects.filter(
            create_comprehensive_search_q(query, news_fields),
            is_active=True
        ).distinct()
        
        for news in news_items:
            results.append({
                'title': news.title,
                'description': (news.content or '')[:200] + '...',
                'url': news.get_absolute_url(),
                'type': 'News',
                'image': news.main_image.url if news.main_image else None,
                'model': 'News'
            })
    except Exception as e:
        print(f"News model error: {e}")
    
    # Page Headers
    try:
        page_header_fields = ['page_title', 'page_description']
        page_headers = PageHeader.objects.filter(
            create_comprehensive_search_q(query, page_header_fields)
        ).distinct()
        
        for header in page_headers:
            results.append({
                'title': header.page_title or 'Header',
                'description': (header.page_description or '')[:200] + '...',
                'url': f'/{header.page_key}/',
                'type': 'Header',
                'image': header.background_image.url if header.background_image else None,
                'model': 'PageHeader'
            })
    except Exception as e:
        print(f"PageHeader model error: {e}")
    
    try:
        sustainability_fields = ['maincontent', 'subcontent']
        sustainabilities = Sustainability.objects.filter(
            create_comprehensive_search_q(query, sustainability_fields),
            is_active=True
        ).distinct()
        
        for sustainability in sustainabilities:
            results.append({
                'title': 'Sustainability',
                'description': (sustainability.maincontent or sustainability.subcontent or '')[:200] + '...',
                'url': '/sustainability/',
                'type': 'Sustainability',
                'image': sustainability.image_maincontent.url if sustainability.image_maincontent else None,
                'model': 'Sustainability'
            })
    except Exception as e:
        print(f"Sustainability model error: {e}")
    
    try:
        sustainability_content_fields = ['title', 'content']
        sustainability_contents = SubtainabilityContent.objects.filter(
            create_comprehensive_search_q(query, sustainability_content_fields),
            is_active=True
        ).select_related('sustainability').distinct()
        
        for content in sustainability_contents:
            results.append({
                'title': f'Sustainability - {content.title}',
                'description': (content.content or '')[:200] + '...',
                'url': '/sustainability/',
                'type': 'Sustainability content',
                'image': content.image_one.url if content.image_one else None,
                'model': 'SustainabilityContent'
            })
    except Exception as e:
        print(f"SustainabilityContent model error: {e}")
    
    return results


def calculate_advanced_relevance(result, query):
    if not query:
        return 0
    
    title_lower = (result.get('title', '') or '').lower()
    desc_lower = (result.get('description', '') or '').lower()
    query_lower = query.lower()
    
    score = 0
    
    if query_lower == title_lower:
        score += 1000
    elif query_lower == desc_lower:
        score += 800
    
    if query_lower in title_lower:
        score += 500
    
    if query_lower in desc_lower:
        score += 300
    
    query_words = query_lower.split()
    for word in query_words:
        if word in title_lower:
            score += 100
        if word in desc_lower:
            score += 50
    
    for word in query_words:
        title_words = title_lower.split()
        desc_words = desc_lower.split()
        
        for title_word in title_words:
            if word in title_word or title_word in word:
                score += 25
        
        for desc_word in desc_words:
            if word in desc_word or desc_word in word:
                score += 10
    
    if len(query) == 1:
        if query_lower in title_lower:
            score += 200
        if query_lower in desc_lower:
            score += 100
    
    return score


def search_api(request):
    query = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    
    if not query:
        return JsonResponse({
            'results': [],
            'total_results': 0,
            'current_page': 1,
            'total_pages': 0,
            'has_next': False,
            'has_previous': False
        })
    
    results = search_all_models(query)
    
    seen = set()
    unique_results = []
    for result in results:
        identifier = (result['title'], result['type'], result['url'])
        if identifier not in seen:
            seen.add(identifier)
            unique_results.append(result)
    
    results = unique_results
    total_results = len(results)
    
    results.sort(key=lambda x: calculate_advanced_relevance(x, query), reverse=True)
    
    paginator = Paginator(results, 10)
    page_obj = paginator.get_page(page_number)
    
    return JsonResponse({
        'results': list(page_obj),
        'total_results': total_results,
        'current_page': page_obj.number,
        'total_pages': paginator.num_pages,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
        'page_range': list(paginator.page_range)
    })


def search_view(request):
    query = request.GET.get('search', '').strip()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.GET.get('format') == 'json':
        return search_api(request)
    
    try:
        page_header = PageHeader.objects.get(page_key='search_view')
        header_context = {
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'page_title': 'Arama',
            'page_description': 'Website içeriğinde arama yapın',
            'background_image': None
        }
    
    context = {
        'query': query,
        **header_context
    }
    
    return render(request, 'search.html', context)