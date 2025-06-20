from django.contrib import admin
from django.utils.html import format_html
from .models import News

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = [
    'title', 'date', 'new', 'announcements', 'new_badge', 'announcement_badge',
    'is_active', 'order', 'created_at'
    ]
    list_editable = ['is_active', 'order', 'new', 'announcements']

    list_filter = ['new', 'announcements', 'is_active', 'date', 'created_at']
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
            'fields': ('date', 'new', 'announcements', 'is_active', 'order')
        }),
    )

    def new_badge(self, obj):
        if obj.new:
            return format_html('<span style="color: red; font-weight: bold;">NEW</span>')
        return '-'
    new_badge.short_description = 'New'

    def announcement_badge(self, obj):
        if obj.announcements:
            return format_html('<span style="color: blue; font-weight: bold;">ANNOUNCEMENT</span>')
        return '-'
    announcement_badge.short_description = 'Announcement'

    actions = ['mark_as_new', 'mark_as_not_new', 'mark_as_announcement', 'mark_as_not_announcement']

    def mark_as_new(self, request, queryset):
        queryset.update(new=True)
    mark_as_new.short_description = "Mark selected news as new"

    def mark_as_not_new(self, request, queryset):
        queryset.update(new=False)
    mark_as_not_new.short_description = "Mark selected news as not new"

    def mark_as_announcement(self, request, queryset):
        queryset.update(announcements=True)
    mark_as_announcement.short_description = "Mark selected news as announcement"

    def mark_as_not_announcement(self, request, queryset):
        queryset.update(announcements=False)
    mark_as_not_announcement.short_description = "Mark selected news as not announcement"