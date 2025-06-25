from django.contrib import admin
from django.utils.html import format_html
from .models import Category, CategoryFeature
from modeltranslation.admin import TranslationAdmin, TranslationTabularInline

class CategoryFeatureInline(TranslationTabularInline):
    model = CategoryFeature
    extra = 1
    fields = ('title', 'order')
    ordering = ('order',)

@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    list_display = (
        'title', 
        'image_preview', 
        'order', 
        'is_active', 
        'feature_count',
        'created_at'
    )
    list_filter = ('is_active', 'created_at')
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('image_preview', 'created_at', 'updated_at')
    inlines = [CategoryFeatureInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'order', 'is_active')
        }),
        ('Images', {
            'fields': (
                ('main_image', 'image_preview'),
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

    def image_preview(self, obj):
        if obj.main_image:
            return format_html(
                '<img src="{}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;" />',
                obj.main_image.url
            )
        return "No image"
    image_preview.short_description = "Main Image Preview"

    def feature_count(self, obj):
        return obj.features.count()
    feature_count.short_description = "Features"

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.prefetch_related('features')

    class Media:
        css = {
            'all': ('admin/css/category_admin.css',)
        }

@admin.register(CategoryFeature)
class CategoryFeatureAdmin(TranslationAdmin):
    list_display = ('title', 'category', 'order')
    list_filter = ('category',)
    list_editable = ('order',)
    search_fields = ('title', 'category__title')
    ordering = ('category', 'order', 'title')
    
    fieldsets = (
        (None, {
            'fields': ('category', 'title','order')
        }),
    )

admin.site.site_header = "Category Management"
admin.site.site_title = "Category Admin"
admin.site.index_title = "Welcome to Category Administration"