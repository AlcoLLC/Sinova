from django.contrib import admin
from .models import HomeContent, PickUp
from modeltranslation.admin import TranslationAdmin

@admin.register(HomeContent)
class HomeContentAdmin(TranslationAdmin):
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
    
@admin.register(PickUp)
class PickUpAdmin(TranslationAdmin):
    list_display = ['title', 'is_active', 'created_at', 'updated_at']
    list_filter = ['is_active', 'created_at', 'updated_at'] 
    search_fields = ['title', 'url']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'image', 'url', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )