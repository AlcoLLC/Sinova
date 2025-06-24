from django.db import models
from django.urls import reverse
from django.utils.text import slugify

class News(models.Model):
    title = models.CharField(max_length=200, verbose_name="Title")
    content = models.TextField(verbose_name="Content")
    main_image = models.ImageField(upload_to='news_images/', verbose_name="Image", blank=True, null=True)
    secondary_image = models.ImageField(upload_to='news_images/', verbose_name="Secondary Image", blank=True, null=True)
    date = models.DateField(verbose_name="Date", help_text="Date of the news article")
    new = models.BooleanField(default=True, verbose_name="Is New", help_text="Indicates if the news is new")
    announcement = models.BooleanField(default=False, verbose_name="Is Announcement", help_text="Indicates if the news is an announcement")
    release = models.BooleanField(default=False, verbose_name="Is release", help_text="Indicates if the news is an release")

    slug = models.SlugField(unique=True, verbose_name="Slug", help_text="URL-friendly version of the title", blank=True)
    is_active = models.BooleanField(default=True, verbose_name="Is Active", help_text="Indicates if the news is active")
    order = models.PositiveIntegerField(default=0, verbose_name="Order", help_text="Display order (lower numbers appear first)")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        verbose_name = "News"
        verbose_name_plural = "News"
        ordering = ['order', '-date']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('news:detail', kwargs={'slug': self.slug})