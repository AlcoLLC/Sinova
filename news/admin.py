from django.contrib import admin
from .models import News
from modeltranslation.admin import TranslationAdmin

@admin.register(News)
class NewsAdmin(TranslationAdmin):
    list_display = ['title', 'date', 'new', 'announcement', 'release', 'is_active', 'order', 'created_at']
    list_editable = ['is_active', 'order', 'new', 'announcement', 'release']

    list_filter = ['new', 'announcement', 'release', 'is_active', 'date', 'created_at']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'date'
    ordering = ['order', '-date']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'content')
        }),
        ('Images', {
            'fields': ('main_image', 'secondary_image'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('date', 'new', 'announcement','release', 'is_active', 'order')
        }),
    )