from modeltranslation.translator import register, TranslationOptions
from .models import Sustainability, SubtainabilityContent

@register(Sustainability)
class SustainabilityTranslationOptions(TranslationOptions):
    fields = ('maincontent', 'subcontent')

@register(SubtainabilityContent)
class SubtainabilityContentTranslationOptions(TranslationOptions):
    fields = ('title', 'content')
