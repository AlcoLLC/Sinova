from modeltranslation.translator import register, TranslationOptions
from .models import About, AboutValuesContent

@register(About)
class AboutTranslationOptions(TranslationOptions):
    fields = ('iframe_video_text', 'our_history_content_one', 
            'our_history_content_two', 'our_mission', 'our_vision', 'policies_description')

@register(AboutValuesContent)
class AboutValuesContentTranslationOptions(TranslationOptions):
    fields = ('title', 'description')
