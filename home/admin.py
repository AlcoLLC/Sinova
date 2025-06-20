from django.contrib import admin
from .models import HomeContent

@admin.register(HomeContent)
class HomeContentAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['title', 'subtitle', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Main Content', {
            'fields': ('title', 'description', 'image')
        }),
        ('Secondary Content', {
            'fields': ('subtitle', 'subdescription', 'url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-created_at')