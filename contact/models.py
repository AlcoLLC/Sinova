from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class ContactInfo(models.Model):
    address = models.CharField(max_length=255, verbose_name='address')
    location = models.URLField(verbose_name='location')
    phone_number = models.CharField(max_length=20, verbose_name=('Contact Number'))
    email = models.EmailField(verbose_name=('Email'))
    image = models.ImageField(upload_to='contactInfo/')

    def __str__(self):
        return self.address

class Contact(models.Model):
    first_name = models.CharField(max_length=100, verbose_name=_('First Name'))
    last_name = models.CharField(max_length=100, verbose_name=_('Last Name'))
    company_name = models.CharField(max_length=10, verbose_name=_('Company name'))
    phone_number = models.CharField(max_length=20, verbose_name=_('Contact Number'))
    email = models.EmailField(verbose_name=_('Email'))
    message = models.TextField(blank=True, null=True, verbose_name=_('Message'))
    
    ip_address = models.GenericIPAddressField(
        verbose_name=_('IP Address'), 
        null=True, 
        blank=True
    )
    recaptcha_verified = models.BooleanField(
        default=False, 
        verbose_name=_('reCAPTCHA Verified')
    )
    
    created_at = models.DateTimeField(default=timezone.now, verbose_name=_('Created At'))

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"

    class Meta:
        verbose_name = _('Contact')
        verbose_name_plural = _('Contacts')
        indexes = [
            models.Index(fields=['ip_address']),
            models.Index(fields=['created_at']),
        ]

        