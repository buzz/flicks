import datetime

from django.core.management.base import BaseCommand
from flicksapp.models import Movie

from imdb import IMDb

class Command(BaseCommand):
    help = "Syncronizes all movies that weren't sync'ed for one week"

    def handle(self, *args, **options):
        # movies that weren't sync'd for one week
        resync = Movie.objects.filter(
            imdb_sync_on__lt=datetime.date.today() - datetime.timedelta(days=7))
        # movies that weren't sync'd at all
        never_synced = Movie.objects.filter(imdb_sync_on__isnull=True)
        to_sync = (resync | never_synced).order_by('id')
        ia = IMDb()
        for i, m in enumerate(to_sync):
            res = m.sync_with_imdb(ia)
            if res:
                self.stdout.write("Synced %s\n" % m.title)
            else:
                self.stdout.write("Skipping %s\n" % m.title)
