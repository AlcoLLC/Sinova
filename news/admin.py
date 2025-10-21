from django.contrib import admin
from .models import News
from modeltranslation.admin import TranslationAdmin

@admin.register(News)
class NewsAdmin(TranslationAdmin):
    list_display = ['title', 'date', 'new', 'announcement', 'release', 'is_active', 'order', 'created_at', 'in_home']
    list_editable = ['is_active', 'order', 'new', 'announcement', 'release', 'in_home']

    list_filter = ['new', 'announcement', 'release', 'is_active', 'date', 'created_at']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'date'
    ordering = ['order', '-date']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'subtitle', 'slug', 'content')
        }),
        ('Images', {
            'fields': ('main_image', 'secondary_image'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('date', 'new', 'announcement','release', 'is_active', 'in_home','order')
        }),
        ('SEO Metadata', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
    )