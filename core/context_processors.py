from django.urls import resolve
from pageHeader.models import PageHeader

def page_header_processor(request):
    try:
        current_url_name = resolve(request.path_info).url_name
        
        page_key_mapping = {
            'home': 'home',
            'about': 'about',
            'contact': 'contact',
            'news_list': 'news',
            'businesses': 'businesses',
            'investorRelation': 'investorRelation',
            'sustainability': 'sustainability',
        }
        
        page_key = page_key_mapping.get(current_url_name, current_url_name)
        
        try:
            header = PageHeader.objects.get(page_key=page_key)
            return {
                'page_title': header.page_title,
                'page_description': header.page_description,
                'header_bg_image': header.background_image if header.background_image else None,
                'page_header': header,
            }
        except PageHeader.DoesNotExist:
            default_titles = {
                'home': 'Welcome to Our Company',
                'about': 'About Us',
                'contact': 'Contact Us',
                'news': 'News & Updates',
                'businesses': 'Our Services',
                'investorRelation': 'Investor Relations',
                'sustainability': 'Sustainability',
            }
            
            return {
                'page_title': default_titles.get(page_key, 'Our Company'),
                'page_description': '',
                'header_bg_image': None,
                'page_header': None,
            }
            
    except Exception as e:
        return {
            'page_title': 'Our Company',
            'page_description': '',
            'header_bg_image': None,
            'page_header': None,
        }
    
from businesses.models import Category as BusinessCategory
from investorRelations.models import Category as InvestorCategory

def global_categories(request):
    business_categories = BusinessCategory.objects.filter(is_active=True).order_by('order', 'title')
    investor_categories = InvestorCategory.objects.filter(is_active=True).order_by('order', 'title')

    return {
        'business_categories': business_categories,
        'investor_categories': investor_categories
    }
