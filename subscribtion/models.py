from django.db import models
from django.utils import timezone
from django.core.validators import validate_email

class EmailSubscription(models.Model):
    email = models.EmailField(unique=True, validators=[validate_email])
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-subscribed_at']
        verbose_name = 'Email Subscription'
        verbose_name_plural = 'Email Subscriptions'
    
    def __str__(self):
        return f"{self.email} - {'Active' if self.is_active else 'Inactive'}"