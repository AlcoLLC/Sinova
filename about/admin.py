from django.contrib import admin
from .models import About, AboutValuesContent
from modeltranslation.admin import TranslationAdmin, TranslationTabularInline

class AboutValuesContentInline(TranslationTabularInline):
    model = AboutValuesContent
    extra = 1
    fields = ('title', 'description')

@admin.register(About)
class AboutAdmin(TranslationAdmin):
    list_display = ('our_history_title', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('our_history_title', 'our_mission', 'our_vision')

    fieldsets = (
        ('Video Section', {
            'fields': ('iframe_video', 'iframe_video_image', 'iframe_video_text')
        }),
        ('Our History', {
            'fields': (
                'our_history_title',
                'our_history_content_one',
                ('our_history_image_one', 'our_history_image_two'),
                'our_history_content_two',
                ('our_history_image_three', 'our_history_image_four'),
            )
        }),
        ('Mission & Vision', {
            'fields': (
                'our_mission', 
                'our_vision',
                'our_mission_image',
                'our_vision_image',
            )
        }),
        ('Values', {
            'fields': ('value_image',)
        }),
        ('Policies', {
            'fields': ('policies_description',)
        }),
        ('End Image', {
            'fields': ('end_image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ('created_at', 'updated_at')
    inlines = [AboutValuesContentInline]

    def has_add_permission(self, request):
        if self.model.objects.count() >= 1:
            return False
        return super().has_add_permission(request)


@admin.register(AboutValuesContent)
class AboutValuesContentAdmin(TranslationAdmin):
    list_display = ('title', 'about', 'description')
    list_filter = ('about',)
    search_fields = ('title', 'description')
    list_editable = ('description',)