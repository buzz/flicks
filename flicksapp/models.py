import datetime
import re

from django.db import models
from django.db.models import Q

from imdb import IMDb

from flicksapp.validators import validate_imdb_id

class Country(models.Model):
    name = models.CharField('Country', max_length=200, unique=True)

    def __unicode__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField('Name', max_length=200, unique=True)

    def __unicode__(self):
        return self.name

class Person(models.Model):
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

class File(models.Model):
    PICTURE_TYPE = 'P'
    VIDEO_TYPE = 'V'
    NFO_TYPE = 'N'
    SUBTITLES_TYPE = 'S'
    FILETYPE_CHOICES = (
        (PICTURE_TYPE, 'Picture'),
        (VIDEO_TYPE, 'Video'),
        (NFO_TYPE, 'NFO'),
        (SUBTITLES_TYPE, 'Subtitles'),
    )
    filename = models.CharField('Filename', max_length=255)
    filetype = models.CharField('Type', choices=FILETYPE_CHOICES, max_length=1)
    mediainfo = models.TextField('Mediainfo')

    def __unicode__(self):
        return self.name

class MovieManager(models.Manager):
    def search(self, q):
        return self.filter(
            Q(title__icontains=q) |
            Q(runtime__icontains=q) |
            Q(year__icontains=q) |
            Q(notes__icontains=q)
        )

class Movie(models.Model):
    objects = MovieManager()

    # imdb
    imdb_id = models.PositiveIntegerField('IMDb ID', null=True, blank=True,
                                          validators=[validate_imdb_id])
    title = models.CharField('Title', max_length=400)
    akas = models.TextField('Also known as')
    year = models.PositiveIntegerField('Year', null=True, blank=True)
    rating = models.DecimalField('Rating', max_digits=3, decimal_places=1,
                                 null=True, blank=True)
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
    aspect_ratio = models.CharField('Aspect ratio', max_length=6, blank=True)
    plot_outline = models.TextField('Plot outline', blank=True)
    plot = models.TextField('Plot', blank=True)
    mpaa = models.CharField('MPAA', max_length=400, blank=True)
    cover_url = models.URLField('Cover url', blank=True)

    # storage
    files = models.ManyToManyField(File, verbose_name='Files')

    # misc
    added_on = models.DateField('Added on', null=True)
    imdb_sync_on = models.DateTimeField('IMDb sync on', null=True)
    seen = models.BooleanField('Seen', default=False)
    favourite = models.BooleanField('Favourite', default=False)
    notes = models.TextField('Notes', blank=True)

    def __unicode__(self):
        return u'%s (%s)' % (self.title, self.imdb_id)

    def sync_with_imdb(self, ia=None):
        """Update movie with IMDb data. Use ia as IMDb access."""
        if not self.imdb_id:
            return False
        if not ia:
            from imdb import IMDb
            ia = IMDb()
        im = ia.get_movie(
            self.imdb_id, info=('main', 'plot', 'akas', 'keywords'))

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
        if im.has_key('full-size cover url'):
            self.cover_ul = im['full-size cover url']
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

        # save movie
        self.imdb_sync_on = datetime.datetime.now()
        self.save()
        return True
