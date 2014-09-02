import datetime
import re
import math

from django.conf import settings
from django.db import models
from django.db.models import Q, Count
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver

from imdb import IMDb

from flicksapp.constants import COVER_MAX_WIDTH, COVER_MAX_HEIGHT
from flicksapp.fields import ListField
from flicksapp.validators import validate_imdb_id
from flicksapp.choices import FILE_TYPE_CHOICES, TRACK_TYPE_CHOICES, VIDEO_TYPE


class Country(models.Model):
    name = models.CharField('Country', max_length=200, unique=True)

    def __unicode__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField('Name', max_length=200, unique=True)

    def __unicode__(self):
        return self.name

class PersonManager(models.Manager):
    def actors(self):
        """Returns people that acted in at least one movie."""
        return self.annotate(
            acted_in_count=Count('acted_in')).filter(acted_in_count__gt=0)
    def directors(self):
        """Returns people that directed at least one movie."""
        return self.annotate(
            directed_count=Count('directed')).filter(directed_count__gt=0)
    def writers(self):
        """Returns people that have written at least one movie script."""
        return self.annotate(
            written_count=Count('written')).filter(written_count__gt=0)

class Person(models.Model):
    objects = PersonManager()
    imdb_id = models.PositiveIntegerField('IMDb ID', null=True, blank=True,
                                          unique=True,
                                          validators=[validate_imdb_id])
    name = models.CharField('Name', max_length=200)

    def __unicode__(self):
        return self.name

class Language(models.Model):
    name = models.CharField('Name', max_length=200, unique=True)

    def __unicode__(self):
        return self.name

class Keyword(models.Model):
    name = models.CharField('Name', max_length=200, unique=True)

    def __unicode__(self):
        return self.name

class Track(models.Model):
    track_id = models.PositiveIntegerField('Track ID', null=False, default=0)
    track_type = models.CharField(
        'Type', choices=TRACK_TYPE_CHOICES, max_length=1, default=VIDEO_TYPE)

    format = models.CharField('Format', null=True, blank=True, max_length=100)
    codec = models.CharField('Codec', null=True, blank=True, max_length=100)
    bit_rate = models.PositiveIntegerField('Bit rate', null=True, blank=True)
    stream_size = models.BigIntegerField('Stream size', null=True, blank=True)
    writing_library = models.CharField(
        'Writing library', null=True, blank=True, max_length=255)
    language = models.CharField(
        'Language', null=True, blank=True, max_length=100)

    # video track only
    video_width = models.PositiveSmallIntegerField(
        'Video width', null=True, blank=True)
    video_height = models.PositiveSmallIntegerField(
        'Video height', null=True, blank=True)
    video_aspect_ratio = models.FloatField(
        'Video aspect ratio', null=True, blank=True)
    video_frame_rate = models.FloatField(
        'Video frame rate', null=True, blank=True)
    video_bpp = models.FloatField('Video bits per pixel', null=True, blank=True)

    # audio track only
    audio_bit_rate_mode = models.CharField(
        'Audio bit rate mode', null=True, blank=True, max_length=20)
    audio_sampling_rate = models.CharField(
        'Audio sampling rate', null=True, blank=True, max_length=20)
    audio_channels = models.CharField(
        'Audio channels', null=True, blank=True, max_length=20)

    # file
    file = models.ForeignKey('File', related_name='tracks')

class File(models.Model):
    filename = models.CharField('Filename', max_length=255)
    file_type = models.CharField(
        'Type', choices=FILE_TYPE_CHOICES, max_length=1, default=VIDEO_TYPE)

    # output of the file command
    file_output = models.CharField(
        'file output', max_length=255, null=True, blank=True)

    # media info general
    container_format = models.CharField(
        'Container Format', null=True, blank=True, max_length=100)
    file_size = models.BigIntegerField('File size', null=True, blank=True)
    duration = models.PositiveIntegerField('Duration', null=True, blank=True)
    overall_bit_rate = models.PositiveIntegerField(
        'Overall bit rate', null=True, blank=True)
    writing_application = models.CharField(
        'Writing application', null=True, blank=True, max_length=255)
    writing_library = models.CharField(
        'Writing library', null=True, blank=True, max_length=255)

    # file
    movie = models.ForeignKey('Movie', related_name='files')

    def __unicode__(self):
        return self.filename

class Movie(models.Model):
    # imdb
    imdb_id = models.PositiveIntegerField(
        'IMDb ID', null=True, blank=True, validators=[validate_imdb_id],
        db_index=True)
    title = models.CharField('Title', max_length=200)
    akas = ListField('Also known as')
    year = models.PositiveIntegerField('Year', null=True, blank=True,
                                       db_index=True)
    rating = models.FloatField('Rating', null=True, blank=True)
    votes = models.PositiveIntegerField('Votes', null=True, blank=True)
    countries = models.ManyToManyField(Country, verbose_name='Countries',
                                       related_name='movies')
    genres = models.ManyToManyField(Genre, verbose_name='Genres',
                                    related_name='movies')
    directors = models.ManyToManyField(
        Person, related_name='directed', verbose_name='Directors')
    producers = models.ManyToManyField(
        Person, related_name='produced', verbose_name='Producers')
    writers = models.ManyToManyField(
        Person, related_name='written', verbose_name='Writers')
    cast = models.ManyToManyField(
        Person, related_name='acted_in', verbose_name='Cast')
    languages = models.ManyToManyField(Language, verbose_name='Languages',
                                       related_name='movies')
    keywords = models.ManyToManyField(Keyword, verbose_name='Keywords',
                                      related_name='movies')
    runtime = models.PositiveIntegerField('Runtime', null=True, blank=True)
    plot_outline = models.TextField('Plot outline', blank=True)
    plot = models.TextField('Plot', blank=True)
    mpaa = models.CharField('MPAA', max_length=200, blank=True)

    # karagarga
    karagarga_id = models.PositiveIntegerField(
        'Karagarga ID', null=True, blank=True)

    # misc
    added_on = models.DateField('Added on', null=True)
    imdb_sync_on = models.DateTimeField('IMDb sync on', null=True)
    seen = models.BooleanField('Seen', default=False)
    favourite = models.BooleanField('Favourite', default=False)
    trumpable = models.BooleanField('Trumpable', default=False)
    notes = models.TextField('Notes', blank=True)

    def clear_imdb_relations(self):
        """Completely clear all IMDb relation fields."""
        self.countries = []
        self.genres = []
        self.directors = []
        self.producers = []
        self.writers = []
        self.cast = []
        self.languages = []
        self.keywords = []

    def __unicode__(self):
        return u'%s (%s)' % (self.title, self.imdb_id)

    def clean(self):
        if self.favourite and not self.seen:
            raise ValidationError('An unseen movie can not be favourited!.')

    @property
    def media_directory(self):
        r = settings.MOVIES_ROOT
        d1 = math.floor(self.id / 100) * 100
        return '%s/%05i/%05i/' % (settings.MOVIES_ROOT, d1, self.id)

    @property
    def cover_filepath(self):
        return '%s/movies_%d.jpg' % (settings.COVERS_ROOT, self.id)

    def _get_im(self):
        from imdb import IMDb
        ia = IMDb()
        return ia.get_movie(
            self.imdb_id, info=('main', 'plot', 'akas', 'keywords'))

    def sync_with_imdb(self, fetch_cover=False, im=None):
        '''Update movie with IMDb data.'''
        if not self.imdb_id:
            return False
        if not im:
            im = self._get_im()

        # first clear all imdb relations
        self.clear_imdb_relations()

        # get simple fields
        self.title = im['title']
        self.year = im['year']
        if im.has_key('rating'):
            self.rating = im['rating']
        if im.has_key('votes'):
            self.votes = im['votes']
        if im.has_key('runtime') and len(im['runtime']) > 0:
            runtime = im['runtime'][0]
            try:
                self.runtime = int(runtime)
            except ValueError:
                # different runtime format (eg. 'Australia:32::(6 episodes)')
                m = re.search('(\d+)::', runtime)
                if m:
                    self.runtime = int(m.groups()[0])
                else:
                    # or eg. 'USA:66'
                    m = re.search(':(\d+)', runtime)
                    if m:
                        self.runtime = int(m.groups()[0])
                    else:
                        raise ValueError(
                            'Could not parse runtime string: "%s" movie: %s' %
                            (runtime, self.title))
        if im.has_key('akas'):
            self.akas = im['akas']
        if im.has_key('plot outline'):
            self.plot_outline = im['plot outline']
        if im.has_key('plot'):
            plots = im['plot']
            if len(plots) > 0:
                self.plot = plots[0]
        if im.has_key('mpaa'):
            self.mpaa = im['mpaa']
        # countries, languages, genres, keywords
        for key, relation, cls in (('countries', self.countries, Country),
                                   ('languages', self.languages, Language),
                                   ('genres', self.genres, Genre),
                                   ('keywords', self.keywords, Keyword),
                                   ):
            try:
                for name in im[key]:
                    obj, created = cls.objects.get_or_create(name=name)
                    relation.add(obj)
            except KeyError:
                continue
        # people
        for key, relation in (('director', self.directors),
                              ('producer', self.producers),
                              ('writer', self.writers),
                              ('cast', self.cast),
                              ):
            try:
                for p_imdb in im[key]:
                    p, created = Person.objects.get_or_create(
                        imdb_id=p_imdb.personID)
                    if created:
                        p.name = p_imdb['name']
                        p.save()
                    relation.add(p)
            except KeyError:
                continue

        if fetch_cover:
            self.fetch_cover_from_imdb(im=im)

        # save movie
        self.imdb_sync_on = datetime.datetime.now()
        return True

    def fetch_cover_from_imdb(self, im=None):
        '''Download cover from IMDb.'''
        if not self.imdb_id:
            return False
        if not im:
            im = self._get_im()

        # cover
        if im.has_key('cover url'):
            m = re.search('^(.+)(SX[0-9]+_SY[0-9]+)(.+)$', im['cover url'])
            if m:
                g = m.groups()
                res = 'SX%d_SY%d' % (COVER_MAX_WIDTH, COVER_MAX_HEIGHT)
                cover_url = '%s%s%s' % (g[0], res, g[2])

                # save to disk
                import urllib
                coverfile = urllib.URLopener()
                coverfile.retrieve(cover_url, self.cover_filepath)

@receiver(post_save, sender=Movie)
def sync_with_imdb(sender, instance, created, **kwargs):
    if created and instance.imdb_id is not None:
        instance.sync_with_imdb(fetch_cover=True)
        instance.save()
