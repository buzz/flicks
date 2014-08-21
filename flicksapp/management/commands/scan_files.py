from django.core.management.base import BaseCommand
import os
import re
import subprocess

from imdb import IMDb
from flicksapp.models import Movie


IGNORES = (
    '^\..+\.sha1$',
)

class Command(BaseCommand):
    help = 'Scans media files'

    def handle(self, *args, **options):
        i = 0
        nodir = 0
        file_count = 0
        dir_count = 0
        for m in Movie.objects.all():
            i += 1
            mdir = m.media_directory
            if not os.path.isdir(mdir):
                nodir += 1
                continue
            print '************************* %50s %90s' % \
                (mdir, m.title.encode('ascii', 'replace'))
            for root, dirs, files in os.walk(mdir):
                # warn for dirs
                for d in dirs:
                    print 'Warning: Directory found: %s%s' % (root, d)
                    dir_count += 1
                # check media files
                for f in files:
                    ignore = False
                    for p in IGNORES:
                        if re.match(p, f):
                            ignore = True
                            break
                    if ignore:
                        continue
                    file_count += 1
                    filename = '%s/%s' % (root, f)
                    file_out = subprocess.check_output([
                        'file', '--brief', filename])
                    mediainfo_out = subprocess.check_output([
                        'mediainfo', filename])
                    print f
                    print file_out
                    print mediainfo_out
                    print '--------------------------------------------------------------------------------'
        print 'Found %d files for %d movies (%d no dir)' % \
          (file_count, i, nodir)
        print '%d invalid subdirs in folders found' % dir_count
