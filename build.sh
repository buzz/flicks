#!/bin/sh

rm -rf dist
pyinstaller \
    --workpath /tmp/flicks-build \
     run.spec
