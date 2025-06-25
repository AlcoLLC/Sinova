from modeltranslation.translator import register, TranslationOptions
from .models import HomeContent, PickUp

@register(HomeContent)
class HomeContentTranslationOptions(TranslationOptions):
    fields = ('title', 'description', 'subtitle', 'subdescription')

@register(PickUp)
class PickUpTranslationOptions(TranslationOptions):
    fields = ('title', )
