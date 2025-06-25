from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from .models import Gallery, GalleryImage
from modeltranslation.admin import TranslationAdmin


class GalleryForm(ModelForm):
    class Meta:
        model = Gallery
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        if not self.instance.pk and Gallery.objects.exists():
            raise ValidationError('Only one Gallery object can exist.')
        return cleaned_data


class GalleryImageInline(admin.TabularInline): 
    model = GalleryImage
    extra = 1
    fields = ('image', 'order', 'is_active')
    ordering = ('order',)
    show_change_link = True


@admin.register(Gallery)
class GalleryAdmin(TranslationAdmin):
    form = GalleryForm
    list_display = ('iframe_video_text', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('iframe_video_text',)
    inlines = [GalleryImageInline]
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Video Information', {
            'fields': ('iframe_video', 'iframe_video_image', 'iframe_video_text')
        }),
        ('Status and Time Information', {
            'fields': ('is_active', 'created_at', 'updated_at')
        }),
    )

    def has_add_permission(self, request):
        if Gallery.objects.exists():
            return False
        return super().has_add_permission(request)


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('gallery', 'order', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    ordering = ('gallery', 'order')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Image Information', {
            'fields': ('gallery', 'image', 'order')
        }),
        ('Status and Time Information', {
            'fields': ('is_active', 'in_home', 'in_subscribe', 'created_at', 'updated_at')
        }),
    )