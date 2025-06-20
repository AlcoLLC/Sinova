from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import Http404
from .models import About, AboutValuesContent

class AboutView(TemplateView):
    template_name = 'about.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        try:
            about = About.objects.first()
            if not about:
                raise Http404("About page not found")
            context['about'] = about
            context['values'] = AboutValuesContent.objects.filter(about=about)
        except About.DoesNotExist:
            raise Http404("About page not found")
        return context

# def about_detail(request):
#     try:
#         about = About.objects.first()
#         if not about:
#             raise Http404("About page not found")
#         values = AboutValuesContent.objects.filter(about=about)
        
#         context = {
#             'about': about,
#             'values': values,
#         }
#         return render(request, 'about/about.html', context)
#     except About.DoesNotExist:
#         raise Http404("About page not found")