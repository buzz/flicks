import sys
import re
import os
import datetime
from subprocess import Popen
from django.core.management.base import BaseCommand
from django.conf import settings
from imdb import IMDb
from flicksapp.models import Movie
from flicksapp.utils import search_imdb
from flicksapp.management.commands import Colors as C


replaces = (
    '.',
    '_',
    'xvid',
    'dvdrip',
    'bdrip',
    'brrip',
    'ac3',
    'mp3',
    'german',
    'english',
    '720p',
    '1080p',
    'bluray',
    'extended',
)

class Command(BaseCommand):
    args = '<SRC_DIR>'
    help = ('Import movies from SRC_DIR (single files and directories are '
            'interpreted as one movie) to MOVIES_ROOT (flicks movie folder)')

    def handle(self, *args, **options):
        try:
            dir = args[0]
        except IndexError:
            self.stderr.write('No directory given\n')
            return

        self._processes = []
        self.i = IMDb()

        imported = 0
        file_count = 0
        dir_count = 0
        for entry in os.listdir(dir):
            if entry.startswith('.'):
                continue
            full_entry = os.path.join(dir, entry)

            if os.path.isdir(full_entry):
                self._import_dir(full_entry)
                dir_count += 1
            else:
                self._import_file(full_entry)
                file_count += 1

        self._wait_for_processes()

        self.stdout.write('Imported %d movies' % (file_count + dir_count))
        self.stdout.write(' %d directories' % dir_count)
        self.stdout.write(' %d single files' % file_count)

    def _import_file(self, file):
        self.stdout.write(' %s->%s File %s%s%s' %
                        (C.GREEN, C.CLEAR, C.YELLOW,
                        file.decode('ascii', 'ignore'), C.CLEAR))
        self._import_movie(file)

    def _import_dir(self, dir):
        self.stdout.write(' %s->%s Directory %s%s%s' %
                          (C.GREEN, C.CLEAR, C.YELLOW, dir, C.CLEAR))
        self._import_movie(dir)

    def _import_movie(self, filename):
        # defer query term from file name
        base = os.path.basename(filename)
        m = re.search('^(.+)(\d{4})', base)
        # try most common movie file name format: 1. title, 2. year
        if m:
            title = m.groups()[0]
            year = m.groups()[1]
            q = '%s %s' % (title, year)
        else:
            # this just removes file extension
            m = re.search('^(.+)\.[a-zA-Z]{3}$', base)
            if m:
                q = m.groups()[0]
            else:
                q = base

        for r in replaces:
            regex = re.compile(re.escape(r), re.IGNORECASE)
            q = regex.sub(' ', q)

        results = self._search_imdb(q)

        choices = (
            ('i', 'Custom IMDb number', self.func_imdb_num),
            ('s', 'skip',               lambda x: True),
            ('q', 'Quit',               sys.exit),
        )
        choice_keys = map(lambda x: x[0], choices)

        for choice in choices:
            self.stdout.write(
                u'%s%s%3s%s %s' %
                (C.BOLD, C.WHITE, choice[0], C.CLEAR, choice[1]))

        while True:
            try:
                choice = raw_input('> ')
            except EOFError:
                sys.exit(0)

            try:
                result = results[int(choice) - 1]
            except (ValueError, IndexError):
                result = None

            if result:
                # check if exists already
                existing = Movie.objects.filter(
                    imdb_id=result['imdb_id']).first()
                if existing:
                    self.stdout.write(
                        '%s%sError: Movie exists in database: %d %s%s\n' %
                        (C.BOLD, C.RED, existing.id, existing.title, C.CLEAR))
                    continue

                movie = self._import_from_imdb(result['imdb_id'])
                # set added_on from file mtime
                self._set_added_on(movie, filename)

                if movie:
                    self._copy_files(filename, movie)
                    break

            try:
                idx = choice_keys.index(choice)
                if choices[idx][2](filename):
                    break
                else:
                    continue
            except ValueError:
                self.stdout.write('%sUgh?%s\n' % (C.RED, C.CLEAR))
                continue

    def _import_from_imdb(self, imdb_num):
        self.stdout.write('Syncing with IMDb (%07d)... ' % imdb_num)

        m = Movie()
        m.imdb_id = imdb_num
        m.save()
        res = m.sync_with_imdb(fetch_cover=True)
        if res:
            m.save()
            return m
        else:
            self.stdout.write('%sFailed!%s\n' % (C.RED, C.CLEAR))
            m.delete()
            return False

    def _copy_files(self, filename, movie):
        dest_dir = movie.media_directory
        self.stdout.write('Copying files to %s\n' % dest_dir)

        # create dest dir
        if os.path.isdir(dest_dir):
            self.stdout.write(
                '%sWarning: Destination directory %s already exists!%s\n' %
                (C.RED, dest_dir, C.CLEAR))
        else:
            os.mkdir(dest_dir)

        if os.path.isdir(filename):
            # copy content of movie dir
            cmd = 'mv "%s"/* "%s" && mv "%s"/.*.sha1 "%s" 2>&1 >/dev/null; rmdir "%s" ' % (
                filename, dest_dir, filename, dest_dir, filename)
            self._processes.append(Popen(cmd, shell=True))
        else:
            # just one file
            cmd = 'mv "%s" "%s" && mv "%s/.%s.sha1" "%s" 2>&1 >/dev/null' % (
                filename, dest_dir, os.path.dirname(filename),
                os.path.basename(filename), dest_dir)
            self._processes.append(Popen(cmd, shell=True))

    def _wait_for_processes(self):
        self.stdout.write('Waiting for processes to finish...\n')

        for process in self._processes:
            process.wait()

    def _search_imdb(self, q):
        self.stdout.write(u'Searching for %s%s%s\n' % (
            C.YELLOW, q.decode('ascii', 'ignore'), C.CLEAR))
        results = search_imdb(q, self.i)
        if len(results) > 0:
            for i, result in enumerate(results):
                num = i + 1
                self.stdout.write(
                    u'%s%s%3d%s %s (http://www.imdb.com/title/tt%07d/)' %
                    (C.BOLD, C.WHITE, num, C.CLEAR, result['title'],
                     result['imdb_id']))
        else:
            self.stdout.write('%sNo results...\n%s' % (C.RED, C.CLEAR))
        return results

    def _set_added_on(self, movie, filename):
        if os.path.isfile(filename):
            movie.added_on = datetime.datetime.fromtimestamp(
                os.path.getmtime(filename))
        elif os.path.isdir(filename):
            first = os.listdir(filename)[0]
            movie.added_on = datetime.datetime.fromtimestamp(
                os.path.getmtime(os.path.join(filename, first)))
        movie.save()

    def func_imdb_num(self, filename):
        while True:
            try:
                imdb_num = int(raw_input('IMDb number? > '))
            except ValueError:
                self.stdout.write('%sWrong input!\n%s' % (C.RED, C.CLEAR))
                continue
            except EOFError:
                return False
            break

        movie = self._import_from_imdb(imdb_num)
        self._set_added_on(movie, filename)
        if movie:
            self._copy_files(filename, movie)
            return True
        return False
