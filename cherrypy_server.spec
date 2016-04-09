# -*- mode: python -*-

block_cipher = None

datas = [
  ('flicksfrontend/index.html', './flicksfrontend'),
  ('flicksfrontend/dist', './flicksfrontend/dist'),
]

hiddenimports = [
  'django.core.cache.backends.locmem',
  'django.core.context_processors',
  'django.contrib.auth.context_processors',
  'django.contrib.messages.context_processors',
  'django.contrib.sessions.serializers',
  'django.contrib.sessions.middleware',
  'django_extensions',
  'flicksapp.urls',
  'flicksapp.views'
]

excludes = [
  'Tkinter',
  'pygments',
  'jinja2',
  'OpenGL',
  'django.db.backends.oracle.base',
  'sphinx',
  'dns.rdata',
  'sqlite3',
  'babel',
  'gi',
  'gtk',
  'PyQt4',
  'PyQt5',
  'numpy',
  'libreadline',
  'sqlalchemy',
  'PIL'
]

a = Analysis(
  ['cherrypy_server.py'],
  pathex=None,
  binaries=None,
  datas=datas,
  hiddenimports=hiddenimports,
  hookspath=[],
  runtime_hooks=[],
  excludes=excludes,
  win_no_prefer_redirects=False,
  win_private_assemblies=False,
  cipher=block_cipher
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
  pyz,
  a.scripts,
  exclude_binaries=True,
  name='cherrypy_server',
  debug=False,
  strip=False,
  upx=True,
  console=True
)

coll = COLLECT(
  exe,
  a.binaries,
  a.zipfiles,
  a.datas,
  strip=False,
  upx=True,
  name='cherrypy_server'
)
