from django.apps import AppConfig

class InvestorrelationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'investorRelations'

    def ready(self):
        import investorRelations.signals