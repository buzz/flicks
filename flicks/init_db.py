import os
from django.core.exceptions import MiddlewareNotUsed
from django.conf import settings
from django.core.management import call_command

# TODO: refactor this to use ready signal for Django>=1.7
class InitDbMiddleware(object):
    def __init__(self):
        db_name = settings.DATABASES['default']['NAME']
        if not os.path.exists(db_name):
            call_command('syncdb', interactive=False)
            call_command('migrate', interactive=False)
        raise MiddlewareNotUsed('DB created')
