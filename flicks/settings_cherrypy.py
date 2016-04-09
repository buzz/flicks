# settings for running standalone (on cef/cherrypy/sqlite3)
import os
import appdirs
from flicks import APP_NAME
from flicks.settings import *

FLICKS_DATA_ROOT = appdirs.user_data_dir(APP_NAME)

if not os.path.exists(FLICKS_DATA_ROOT):
  os.makedirs(FLICKS_DATA_ROOT)

DB_NAME = os.path.join(FLICKS_DATA_ROOT, 'flicksdb')

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = ()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': DB_NAME,
    }
}

TIME_ZONE = 'Europe/Berlin'
LANGUAGE_CODE = 'en-us'

MOVIES_ROOT = '/media/mapper_storage/flicks'
COVERS_ROOT = os.path.join(FLICKS_DATA_ROOT, 'covers')
if not os.path.exists(COVERS_ROOT):
  os.makedirs(COVERS_ROOT)

TEMPLATE_DIRS = (
  os.path.join(os.path.dirname(os.path.dirname(__file__)),
               'flicksfrontend', 'dist', 'templates'),
)

STATIC_ROOT = ''

SECRET_KEY = 'r(!#omcmwb%t(td)ei#d=n_dkz&^uk2jx=_j8&4!qlb2fam=q_'
