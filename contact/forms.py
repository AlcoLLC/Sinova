from django import forms
from django.utils.translation import gettext_lazy as _
from .models import Contact


class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['first_name', 'last_name', 'company_name', 'phone_number', 'email', 'message']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': _('First name*'),
                'required': True
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': _('Last name*'),
                'required': True
            }),
            'company_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': _('Company name*'),
                'required': True
            }),
            'phone_number': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': _('Phone number*'),
                'required': True
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': _('Email address*'),
                'required': True
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': _('Your question, wish and/or clarification*'),
                'rows': 5,
                'required': True
            }),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.required = True

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email:
            email = email.lower().strip()
        return email

    def clean_phone_number(self):
        phone = self.cleaned_data.get('phone_number')
        if phone:
            phone = ''.join(c for c in phone if c.isdigit() or c == '+')
        return phone