from modeltranslation.translator import register, TranslationOptions
from .models import Category, CategoryFeature

@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

@register(CategoryFeature)
class CategoryFeatureTranslationOptions(TranslationOptions):
    fields = ('title', )
