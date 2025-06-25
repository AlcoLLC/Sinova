from django.contrib import admin
from .models import Sustainability, SubtainabilityContent
from modeltranslation.admin import TranslationAdmin, TranslationTabularInline

class SubtainabilityContentInline(TranslationTabularInline):
    model = SubtainabilityContent
    extra = 1
    fields = ('title', 'content', 'is_active', 'image_one', 'image_two')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Sustainability)
class SustainabilityAdmin(TranslationAdmin):
    list_display = ('id', 'get_title', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'created_at', 'updated_at')
    search_fields = ('maincontent', 'subcontent')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [SubtainabilityContentInline]
    
    fieldsets = (
        ('Main Content', {
            'fields': ('maincontent', 'image_maincontent')
        }),
        ('Sub Content', {
            'fields': ('subcontent', 'image_subcontent')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_title(self, obj):
        return obj.maincontent[:50] + "..." if len(obj.maincontent) > 50 else obj.maincontent
    get_title.short_description = 'Title'

@admin.register(SubtainabilityContent)
class SubtainabilityContentAdmin(TranslationAdmin):
    list_display = ('title', 'sustainability', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at', 'sustainability')
    search_fields = ('title', 'content')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Contents', {
            'fields': ('sustainability', 'title', 'content')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
         ('Pictures', {
            'fields': ('image_one', 'image_two'),
                        'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
