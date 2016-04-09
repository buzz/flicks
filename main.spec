# -*- mode: python -*-

block_cipher = None

files = [
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

a = Analysis(['main.py'],
             pathex=['/home/buzz/dokumente/dev/flicks'],
             binaries=None,
             datas=files,
             hiddenimports=hiddenimports,
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='main',
          debug=False,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               name='main')
