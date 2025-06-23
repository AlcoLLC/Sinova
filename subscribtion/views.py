from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from .models import EmailSubscription
import json

def subscription_form(request):
    return render(request, 'components/subscribe.html')

@require_http_methods(["POST"])
def subscribe_email(request):
    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            email = data.get('email', '').strip().lower()
        else:
            email = request.POST.get('email', '').strip().lower()
        
        if not email:
            return JsonResponse({
                'success': False, 
                'message': 'Email adresi gereklidir.'
            }, status=400)
        
        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({
                'success': False, 
                'message': 'Geçerli bir email adresi girin.'
            }, status=400)
        
        ip_address = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        subscription, created = EmailSubscription.objects.get_or_create(
            email=email,
            defaults={
                'ip_address': ip_address,
                'user_agent': user_agent,
                'is_active': True
            }
        )
        
        if not created:
            if subscription.is_active:
                return JsonResponse({
                    'success': False, 
                    'message': 'Bu email adresi zaten kayıtlı.'
                }, status=400)
            else:
                subscription.is_active = True
                subscription.ip_address = ip_address
                subscription.user_agent = user_agent
                subscription.save()
        
        return JsonResponse({
            'success': True, 
            'message': 'You have successfully subscribed! You will be informed about Sinova Group developments.'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False, 
            'message': 'Geçersiz veri formatı.'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'message': 'Bir hata oluştu. Lütfen tekrar deneyin.'
        }, status=500)

@require_http_methods(["POST"])
def unsubscribe_email(request):
    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            email = data.get('email', '').strip().lower()
        else:
            email = request.POST.get('email', '').strip().lower()
        
        if not email:
            return JsonResponse({
                'success': False, 
                'message': 'Email adresi gereklidir.'
            }, status=400)
        
        try:
            subscription = EmailSubscription.objects.get(email=email)
            subscription.is_active = False
            subscription.save()
            
            return JsonResponse({
                'success': True, 
                'message': 'Abonelik başarıyla iptal edildi.'
            })
        except EmailSubscription.DoesNotExist:
            return JsonResponse({
                'success': False, 
                'message': 'Bu email adresi kayıtlı değil.'
            }, status=404)
            
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'message': 'Bir hata oluştu. Lütfen tekrar deneyin.'
        }, status=500)

def subscription_stats(request):
    if not request.user.is_staff:
        return JsonResponse({'error': 'Yetkisiz erişim'}, status=403)
    
    total_subscriptions = EmailSubscription.objects.count()
    active_subscriptions = EmailSubscription.objects.filter(is_active=True).count()
    inactive_subscriptions = total_subscriptions - active_subscriptions
    
    return JsonResponse({
        'total': total_subscriptions,
        'active': active_subscriptions,
        'inactive': inactive_subscriptions
    })

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
