from django.db import models

class HomeContent(models.Model):
    title = models.CharField(max_length=100, verbose_name="Home Title")
    description = models.TextField(verbose_name="Home Description")
    subtitle = models.CharField(max_length=200, verbose_name="Home Subtitle")
    subdescription = models.TextField(verbose_name="Home Subdescription")
    url = models.URLField(max_length=200, verbose_name="URL", blank=True, null=True)
    image = models.ImageField(upload_to='home_images/', verbose_name="Home Image")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        verbose_name = "Home Content"
        verbose_name_plural = "Home Contents"

    def __str__(self):
        return self.title
    
class PickUp(models.Model):
    title = models.CharField(max_length=100, verbose_name="Pick Up Title")
    image = models.ImageField(upload_to='pickup_images/', verbose_name="Pick Up Image")
    url = models.URLField(max_length=200, verbose_name="Pick Up URL", blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name="Is Active")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    class Meta:
        verbose_name = "Pick Up"
        verbose_name_plural = "Pick Ups"

    def __str__(self):
        return self.title