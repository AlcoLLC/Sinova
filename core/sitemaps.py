from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from news.models import News



class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'monthly'

    def items(self):
        return [
            'home:home',
            'contact:contact',
            'news:news_list',
            'search:search',
        ]

    def location(self, item):
        return reverse(item)


class NewsSitemap(Sitemap):
    changefreq = 'daily'
    priority = 0.7

    def items(self):
        return News.objects.all()

    def lastmod(self, obj):
        return obj.created_at

    def location(self, obj):
       return reverse('news:news_list', kwargs={'pk': obj.pk})



sitemaps = {
    'static': StaticViewSitemap(),
    'news': NewsSitemap(),
}