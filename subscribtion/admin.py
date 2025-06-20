from django.contrib import admin
from django.utils.html import format_html
from .models import EmailSubscription

@admin.register(EmailSubscription)
class EmailSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['email', 'is_active_display', 'subscribed_at', 'ip_address', 'actions_display']
    list_filter = ['is_active', 'subscribed_at']
    search_fields = ['email', 'ip_address']
    readonly_fields = ['subscribed_at', 'updated_at', 'ip_address', 'user_agent']
    list_per_page = 50
    
    fieldsets = (
        ('Email Bilgileri', {
            'fields': ('email', 'is_active')
        }),
        ('Tarih Bilgileri', {
            'fields': ('subscribed_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Teknik Bilgiler', {
            'fields': ('ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
    )
    
    def is_active_display(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Aktif</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-weight: bold;">✗ Pasif</span>'
            )
    is_active_display.short_description = 'Durum'
    
    def actions_display(self, obj):
        if obj.is_active:
            return format_html(
                '<a class="button" href="#" onclick="toggleSubscription({})" style="background: #ba2121; color: white;">Pasif Yap</a>',
                obj.id
            )
        else:
            return format_html(
                '<a class="button" href="#" onclick="toggleSubscription({})" style="background: #417690; color: white;">Aktif Yap</a>',
                obj.id
            )
    actions_display.short_description = 'İşlemler'
    
    def changelist_view(self, request, extra_context=None):
        total = EmailSubscription.objects.count()
        active = EmailSubscription.objects.filter(is_active=True).count()
        inactive = total - active
        
        extra_context = extra_context or {}
        extra_context['total_subscriptions'] = total
        extra_context['active_subscriptions'] = active
        extra_context['inactive_subscriptions'] = inactive
        
        return super().changelist_view(request, extra_context=extra_context)
    
    class Media:
        js = ('admin/js/subscription_admin.js',)