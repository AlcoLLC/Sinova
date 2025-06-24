from django.contrib import admin
from django.utils.html import format_html
from .models import News

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
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

