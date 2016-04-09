rm -r dist
pyinstaller \
    --workpath /tmp/flicks-build \
     run.spec
