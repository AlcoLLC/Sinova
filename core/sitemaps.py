from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from news.models import News
from gallery.models import Gallery
from businesses.models import Category



class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'monthly'

    def items(self):
        return [
            'home:home',
            'about:about',
            'businesses:businesses',
            'gallery:gallery_view',
            'investorRelation:investorRelation',            
            'contact:contact',
            'sustainability:sustainability',
            'news:news_list',
            'search:search',
        ]

    def location(self, item):
        return reverse(item)

class NewsSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        return News.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return obj.get_absolute_url()

class GallerySitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6

    def items(self):
        return Gallery.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return obj.get_absolute_url()

class BusinessesSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6

    def items(self):
        return Category.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return obj.get_absolute_url()


sitemaps = {
    'static': StaticViewSitemap(),
    'news': NewsSitemap(),
    'gallery': GallerySitemap(),
    'businesses': BusinessesSitemap(),
}