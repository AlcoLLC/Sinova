from django.db import models
from django.utils.translation import gettext_lazy as _

class Category(models.Model):
    title = models.CharField(
        max_length=200,
        verbose_name=_("Title")
    )
    description = models.TextField(
        verbose_name=_("Description"),
        help_text=_("Category description text")
    )
    main_image = models.ImageField(
        upload_to='categories/main/',
        verbose_name=_("Main Image"),
        help_text=_("Main category image (recommended size: 800x400px)")
    )
    slug = models.SlugField(
        unique=True,
        verbose_name=_("Slug"),
        help_text=_("URL-friendly version of the title")
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Order"),
        help_text=_("Display order (lower numbers appear first)")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is Active")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class CategoryFeature(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='features',
        verbose_name=_("Category")
    )
    title = models.CharField(
        max_length=200,
        verbose_name=_("Feature Title")
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Order")
    )

    class Meta:
        verbose_name = _("Category Feature")
        verbose_name_plural = _("Category Features")
        ordering = ['order', 'title']

    def __str__(self):
        return f"{self.category.title} - {self.title}"
