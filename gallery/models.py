from django.db import models
from django.urls import reverse
from django.core.exceptions import ValidationError


class Gallery(models.Model):
    iframe_video = models.URLField(
        max_length=200,
        verbose_name="Iframe Video URL",
        help_text="YouTube, Vimeo or other video embed URL"
    )
    iframe_video_image = models.ImageField(
        upload_to='gallery_iframe_video/',
        verbose_name="Iframe Video Thumbnail",
        help_text="Thumbnail image for the video"
    )
    iframe_video_text = models.CharField(
        max_length=200,
        verbose_name="Iframe Video Description",
        help_text="Brief description of the video content"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Is Active"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.iframe_video_text

    def get_absolute_url(self):
        return reverse('corporate:profile_detail', kwargs={'pk': self.pk})

    def clean(self):
        if not self.pk and Gallery.objects.exists():
            raise ValidationError('Sadece bir Gallery obyekti yaradıla bilər.')

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class GalleryImage(models.Model):
    gallery = models.ForeignKey(
        Gallery,
        on_delete=models.CASCADE,
        related_name='gallery_items',
    )
    image = models.ImageField()
    order = models.PositiveIntegerField(
        default=0,
    )
    in_home = models.BooleanField(
        default=False,
        verbose_name="Display in Home Gallery",
        help_text="Check to display this image in the home gallery section"
    )
    in_subscribe = models.BooleanField(
        default=False,
        verbose_name="Display in Subscribe Gallery",
        help_text="Check to display this image in the subscribe gallery section"
    )
    is_active = models.BooleanField(
        default=True,
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        ordering = ['order', '-created_at']