import datetime

from django.core.management.base import BaseCommand
from flicksapp.models import Movie

from imdb import IMDb

class Command(BaseCommand):
    help = "Sets added_on on all movies from file mtime."

    def handle(self, *args, **options):
        # movies that don't have added_on set
        movies = Movie.objects.filter(added_on__isnull=True)
        count_date_added = 0
        count_no_files = 0

        for i, m in enumerate(movies):
            if m.files.count() > 0:
                mod_date = m.files.first().get_mod_date()
                m.added_on = mod_date
                m.save()
                count_date_added += 1
                self.stdout.write('%s %s\n' % (m.title, m.added_on))
            else:
                count_no_files += 1

        self.stdout.write('Added on set on %d movies\n' % count_date_added)
        self.stdout.write('%d movies don\'t have files!\n' % count_no_files)
