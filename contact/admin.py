from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Contact, ContactInfo


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = [
        'address_preview',
        'phone_number',
        'email',
        'has_image',
        'location_link'
    ]
    
    fieldsets = (
        (_('Contact Information'), {
            'fields': ('address', 'phone_number', 'email')
        }),
        (_('Location & Media'), {
            'fields': ('location', 'image'),
            'classes': ('wide',)
        }),
    )
    
    def address_preview(self, obj):
        if len(obj.address) > 50:
            return f"{obj.address[:50]}..."
        return obj.address
    address_preview.short_description = _('Address')
    address_preview.admin_order_field = 'address'
    
    def has_image(self, obj):
        if obj.image:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Yes</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-weight: bold;">✗ No</span>'
            )
    has_image.short_description = _('Image')
    
    def location_link(self, obj):
        if obj.location:
            return format_html(
                '<a href="{}" target="_blank" style="color: #007cba;">🗺️ View Location</a>',
                obj.location
            )
        return _('No location')
    location_link.short_description = _('Location')
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset
    
    # Allow only one ContactInfo record (singleton pattern)
    def has_add_permission(self, request):
        if self.model.objects.count() >= 1:
            return False
        return super().has_add_permission(request)


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = [
        'full_name', 
        'company_name', 
        'email', 
        'phone_number', 
        'ip_address',
        'recaptcha_status',
        'created_at_formatted'
    ]
    
    list_filter = [
        'recaptcha_verified',
        'created_at',
        'company_name',
    ]
    
    search_fields = [
        'first_name',
        'last_name',
        'company_name',
        'email',
        'phone_number',
        'ip_address'
    ]
    
    readonly_fields = [
        'ip_address',
        'recaptcha_verified',
        'created_at',
        'full_name_display',
        'message_preview'
    ]
    
    fieldsets = (
        (_('Personal Information'), {
            'fields': ('full_name_display', 'company_name', 'email', 'phone_number')
        }),
        (_('Message'), {
            'fields': ('message_preview',),
            'classes': ('wide',)
        }),
        (_('Security & Tracking'), {
            'fields': ('ip_address', 'recaptcha_verified', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = _('Full Name')
    full_name.admin_order_field = 'first_name'
    
    def full_name_display(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name_display.short_description = _('Full Name')
    
    def recaptcha_status(self, obj):
        if obj.recaptcha_verified:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Verified</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-weight: bold;">✗ Not Verified</span>'
            )
    recaptcha_status.short_description = _('reCAPTCHA Status')
    recaptcha_status.admin_order_field = 'recaptcha_verified'
    
    def created_at_formatted(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
    created_at_formatted.short_description = _('Created At')
    created_at_formatted.admin_order_field = 'created_at'
    
    def message_preview(self, obj):
        if obj.message:
            preview = obj.message[:200]
            if len(obj.message) > 200:
                preview += "..."
            return format_html(
                '<div style="max-width: 500px; white-space: pre-wrap;">{}</div>',
                preview
            )
        return _('No message')
    message_preview.short_description = _('Message')
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related()
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return True
    
    actions = ['mark_as_processed', 'export_contacts']
    
    def mark_as_processed(self, request, queryset):
        self.message_user(request, f"{queryset.count()} contacts marked as processed.")
    mark_as_processed.short_description = _("Mark selected contacts as processed")
    
    def export_contacts(self, request, queryset):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="contacts.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'First Name', 'Last Name', 'Company Name', 'Email', 
            'Phone Number', 'IP Address', 'reCAPTCHA Verified', 
            'Created At', 'Message'
        ])
        
        for contact in queryset:
            writer.writerow([
                contact.first_name,
                contact.last_name,
                contact.company_name,
                contact.email,
                contact.phone_number,
                contact.ip_address,
                'Yes' if contact.recaptcha_verified else 'No',
                contact.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                contact.message or ''
            ])
        
        return response
    export_contacts.short_description = _("Export selected contacts to CSV")