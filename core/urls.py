"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from django.http import HttpResponse
from django.contrib.sitemaps.views import sitemap
from core.sitemaps import sitemaps


def robots_txt(request):
    sitemap_url = "https://sinovagroup.ch/sitemap.xml"

    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        "Disallow: /api/",
        "Disallow: /media/private/",
        "Disallow: /i18n/setlang/",
        "Allow: /",
        "",
        f"Sitemap: {sitemap_url}"      
    ]
    return HttpResponse('\n'.join(lines), content_type="text/plain")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('i18n/', include('django.conf.urls.i18n')),  
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('robots.txt', robots_txt),
    ]

urlpatterns += i18n_patterns(
    path('', include('home.urls')),
    path('', include('about.urls')),
    path('', include('businesses.urls')),
    path('', include('investorRelations.urls')),
    path('', include('news.urls')),
    path('', include('gallery.urls')), 
    path('', include('subscribtion.urls')),
    path('', include('sustainability.urls')),
    path('', include('contact.urls')),
    path('', include('search.urls')),

    prefix_default_language=False 

)

urlpatterns += [
    re_path(r'^rosetta/', include('rosetta.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0] if settings.STATICFILES_DIRS else settings.STATIC_ROOT)




handler404 = 'contact.views.custom_404_view'
handler500 = 'contact.views.custom_500_view'
handler403 = 'contact.views.custom_403_view'
handler503 = 'contact.views.custom_503_view'

