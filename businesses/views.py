from django.shortcuts import render
from django.views.generic import ListView
from .models import Category

class CategoryListView(ListView):
    model = Category
    template_name = 'businesses.html'
    context_object_name = 'categories'

    def get_queryset(self):
        return Category.objects.filter(is_active=True).prefetch_related('features').order_by('order', 'title')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Our Services'
        return context


def category_list(request):
    categories = Category.objects.filter(is_active=True).prefetch_related('features').order_by('order', 'title')
    
    context = {
        'categories': categories,
        'page_title': 'Our Services'
    }
    return render(request, 'businesses.html', context)