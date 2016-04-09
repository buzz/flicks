rm -r /tmp/pyinstaller-flicks-dist
pyinstaller \
    --workpath /tmp/pyinstaller-flicks-build \
    --distpath /tmp/pyinstaller-flicks-dist \
     main.spec
