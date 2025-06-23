from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.contrib import messages
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import timedelta
import requests
import logging

from .models import Contact, ContactInfo
from .forms import ContactForm

logger = logging.getLogger(__name__)

RECAPTCHA_SITE_KEY = getattr(settings, 'RECAPTCHA_SITE_KEY', '')
RECAPTCHA_SECRET_KEY = getattr(settings, 'RECAPTCHA_SECRET_KEY', '')


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def verify_recaptcha(recaptcha_response, client_ip=None):
    """Verify reCAPTCHA response"""
    if not RECAPTCHA_SECRET_KEY:
        logger.warning("reCAPTCHA secret key not configured")
        return False
        
    data = {
        'secret': RECAPTCHA_SECRET_KEY,
        'response': recaptcha_response
    }
    
    if client_ip:
        data['remoteip'] = client_ip
    
    try:
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify', 
            data=data, 
            timeout=10
        )
        response.raise_for_status()
        result = response.json()
        logger.debug(f"reCAPTCHA verification result: {result}")
        return result.get('success', False)
    except requests.RequestException as e:
        logger.error(f"reCAPTCHA verification error: {str(e)}")
        return False


def contact_view(request):
    # Get contact information for display
    contact_info = ContactInfo.objects.first()  # Assuming you have one contact info record
    
    if request.method == 'POST':
        client_ip = get_client_ip(request)
        
        recaptcha_response = request.POST.get('g-recaptcha-response')
        if not recaptcha_response or not verify_recaptcha(recaptcha_response, client_ip):
            messages.error(request, _("reCAPTCHA verification failed. Please try again."))
            logger.warning(f"Form submission with invalid reCAPTCHA from IP: {client_ip}")
            form = ContactForm()
            context = {
                'form': form,
                'recaptcha_site_key': RECAPTCHA_SITE_KEY,
                'contact_info': contact_info,
            }
            return render(request, 'contact.html', context)

        recent_submission = Contact.objects.filter(
            ip_address=client_ip,
            created_at__gte=timezone.now() - timedelta(hours=1)  
        ).exists()
        
        if recent_submission:
            messages.error(request, _("You have already submitted a form recently. Please wait before submitting again."))
            logger.warning(f"Duplicate submission attempt from IP: {client_ip}")
            form = ContactForm()
            context = {
                'form': form,
                'recaptcha_site_key': RECAPTCHA_SITE_KEY,
                'show_ip_duplicate': True,
                'contact_info': contact_info,
            }
            return render(request, 'contact.html', context)

        form = ContactForm(request.POST)

        if form.is_valid():
            try:
                contact = form.save(commit=False)
                contact.ip_address = client_ip
                contact.recaptcha_verified = True
                contact.save()

                first_name = form.cleaned_data['first_name']
                last_name = form.cleaned_data['last_name']
                company_name = form.cleaned_data['company_name']
                phone_number = form.cleaned_data['phone_number']
                email = form.cleaned_data['email']
                message = form.cleaned_data['message']

                email_subject = f"New Contact Form Submission from {first_name} {last_name}"

                html_email = render_to_string('components/email_template.html', {
                    'first_name': first_name,
                    'last_name': last_name,
                    'company_name': company_name,
                    'email': email,
                    'phone_number': phone_number,
                    'message': message,
                    'ip_address': client_ip,
                })

                send_mail(
                    email_subject,
                    '', 
                    settings.EMAIL_HOST_USER,
                    [settings.DEFAULT_FROM_EMAIL], 
                    html_message=html_email,
                    fail_silently=False,
                )

                user_email_subject = "Thank you for contacting us"
                user_email_message = f"""
Dear {first_name},

Thank you for contacting us. We have received your message and will get back to you shortly.

Best regards,
Support Team
"""
                send_mail(
                    user_email_subject,
                    user_email_message,
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )

                messages.success(request, _("Your message has been sent successfully. Thank you for contacting us!"))
                return redirect('contact')

            except Exception as e:
                logger.error(f"Error processing form: {str(e)}", exc_info=True)
                messages.error(request, _("An error occurred while sending your message. Please try again or contact us directly."))
                form.add_error(None, _("An error occurred. Please try again."))

        else:
            logger.warning(f"Form validation errors: {form.errors.as_json()}")
            for field, errors in form.errors.items():
                for error in errors:
                    field_name = field.replace('_', ' ').title() if field != '__all__' else ''
                    messages.error(request, f"{field_name}: {error}" if field_name else str(error))

        context = {
            'form': form,
            'recaptcha_site_key': RECAPTCHA_SITE_KEY,
            'contact_info': contact_info,
        }
        return render(request, 'contact.html', context)

    else:
        client_ip = get_client_ip(request)
        
        recent_submission = Contact.objects.filter(
            ip_address=client_ip,
            created_at__gte=timezone.now() - timedelta(hours=1)
        ).exists()
        
        form = ContactForm()
        context = {
            'form': form,
            'recaptcha_site_key': RECAPTCHA_SITE_KEY,
            'contact_info': contact_info,
        }
        
        if recent_submission:
            context['show_ip_duplicate'] = True
            messages.warning(request, _("You have recently submitted a form. Please wait before submitting again."))
        
        return render(request, 'contact.html', context)