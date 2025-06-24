from django.db import models

class Sustainability(models.Model):
    maincontent = models.TextField(verbose_name='Content')
    subcontent = models.TextField(verbose_name='Sub Content', blank=True, null=True)
    image_subcontent = models.ImageField(upload_to='sustainability/', verbose_name='Image', blank=True, null=True)
    image_maincontent = models.ImageField(upload_to='sustainability/', verbose_name='Image Main Content', blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name='Is Active')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Updated At')

    class Meta:
        verbose_name = 'Sustainability'
        verbose_name_plural = 'Sustainabilities'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
    
class SubtainabilityContent(models.Model):
    sustainability = models.ForeignKey(Sustainability, on_delete=models.CASCADE, related_name='sub_contents', verbose_name='Sustainability')
    title = models.CharField(max_length=255, verbose_name='Title')
    content = models.TextField(verbose_name='Content')
    image_one = models.ImageField(upload_to='sustainability/', verbose_name='Image One', blank=True, null=True)
    image_two = models.ImageField(upload_to='sustainability/', verbose_name='Image Two', blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name='Is Active')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Updated At')

    class Meta:
        verbose_name = 'Sustainability Content'
        verbose_name_plural = 'Sustainability Contents'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
