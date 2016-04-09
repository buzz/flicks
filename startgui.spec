# -*- mode: python -*-

block_cipher = None

binaries = [
  ('venv/lib/python2.7/site-packages/cefpython3/libcef.so', 'cefpython3'),
  ('venv/lib/python2.7/site-packages/cefpython3/subprocess', 'cefpython3'),
]

datas = [
  ('venv/lib/python2.7/site-packages/cefpython3/locales/*', 'cefpython3/locales'),
  ('venv/lib/python2.7/site-packages/cefpython3/cef.pak', 'cefpython3'),
]

a = Analysis(['startgui.py'],
             pathex=['/home/buzz/dokumente/dev/flicks'],
             binaries=binaries,
             datas=datas,
             hiddenimports=[],
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
          name='startgui',
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
               name='startgui')
