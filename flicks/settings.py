import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FRONTEND_DIST_ROOT = os.path.join(BASE_DIR, 'flicksfrontend', 'dist')

ALLOWED_HOSTS = []

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_extensions',

    'flicksapp',
    'south',
    'tastypie',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
#    'django.contrib.auth.middleware.AuthenticationMiddleware',
)

ROOT_URLCONF = 'flicks.urls'
WSGI_APPLICATION = 'flicks.wsgi.application'

USE_I18N = False
USE_L10N = True
USE_TZ = True

# static files
STATIC_URL = '/static/'
STATICFILES_DIRS = ( os.path.join(FRONTEND_DIST_ROOT, 'static'), )
IMAGES_URL = '%simages/' % STATIC_URL
COVERS_URL = '%scovers/' % STATIC_URL

# templates
TEMPLATE_LOADERS = ( 'django.template.loaders.filesystem.Loader', )
TEMPLATE_DIRS = ( os.path.join(FRONTEND_DIST_ROOT, 'templates'), )

# local settings file
try:
    from flicks.settings_local import *
except ImportError:
    pass
