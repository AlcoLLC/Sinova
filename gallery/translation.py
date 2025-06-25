from modeltranslation.translator import register, TranslationOptions
from .models import Gallery

@register(Gallery)
class GalleryTranslationOptions(TranslationOptions):
    fields = ('iframe_video_text', )

