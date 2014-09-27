import math

from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Min, Max
from django.core.urlresolvers import reverse

from imdb import IMDb

from flicksapp.models import Movie, Person, Country, Language, Genre, Keyword
from flicksapp.api import MovieDetailResource, MovieListResource
from flicksapp.utils import FlicksJSONEncoder
import flicksapp.constants as c
from flicksapp.stats import (bar_data, bar_data_hist, pie_data, mpaa_data,
                             imdb_sync_on_data)


enc = FlicksJSONEncoder()

def bootstrap(request):
    '''
    Serves as entry point for this web application.
    '''
    agg = Movie.objects.aggregate(Min('year'), Max('year'),
                                  Min('runtime'), Max('runtime'))

    movie_root = reverse('api_dispatch_list', kwargs={
        'resource_name': 'movie'
    })
    movies_root = reverse('api_dispatch_list', kwargs={
        'resource_name': 'movies'
    })
    get_index_by_id = reverse('get_index_by_id', kwargs={ 'movie_id': 99999 })
    imdb_import = reverse('imdb_import', kwargs={ 'movie_id': 99999 })
    imdb_cover_import = reverse(
        'imdb_cover_import', kwargs={ 'movie_id': 99999 })
    imdb_search = reverse('imdb_search')
    ctx = {
        'config': enc.encode({
            # app config
            'movie_root':        movie_root,
            'movies_root':       movies_root,
            'covers_root':       settings.COVERS_URL,
            'get_index_by_id':   get_index_by_id,
            'imdb_import':       imdb_import,
            'imdb_cover_import': imdb_cover_import,
            'imdb_search':       imdb_search,

            # for search form
            'year_min':          agg['year__min'],
            'year_max':          agg['year__max'],
            'runtime_min':       agg['runtime__min'],
            'runtime_max':       agg['runtime__max'],
        })
    }
    return render(request, 'index.html', ctx)


def imdb_search(request):
    '''Search IMDb.'''
    data = {
        'results': [],
        'meta': {},
    }
    q = request.GET.get('q', None)
    if q:
        i = IMDb()
        results = i.search_movie(q)
        for r in results:
            imdb_id = int(i.get_imdbID(r))
            movie = {
                'imdb_id': imdb_id,
                'title':   r['title'],
                'in_db':   Movie.objects.filter(imdb_id=imdb_id).count() > 0
            }
            # year is sometimes not present
            try:
                movie['year'] = r['year']
            except KeyError:
                movie['year'] = '????'
            data['results'].append(movie)
    data['meta']['total_count'] = len(data['results'])
    return HttpResponse(enc.encode(data), content_type='application/json')


def imdb_import(request, movie_id):
    '''
    Import movie data from IMDb.
    '''
    movie_id = int(movie_id)
    res = MovieDetailResource()
    bundle = res.build_bundle(request=request)

    try:
        movie = res.obj_get(bundle, id=movie_id)
    except Movie.DoesNotExist():
        return HttpResponse(enc.encode({ 'error': 'Movie does not exist!' }),
                            content_type='application/json', status=404)

    movie.sync_with_imdb()
    movie.save()

    json = res.serialize(None, res.full_dehydrate(bundle), 'application/json')
    return HttpResponse(json, content_type='application/json')


def imdb_cover_import(request, movie_id):
    '''
    Import cover from IMDb.
    '''
    movie_id = int(movie_id)
    res = MovieDetailResource()
    bundle = res.build_bundle(request=request)

    try:
        movie = res.obj_get(bundle, id=movie_id)
    except Movie.DoesNotExist():
        return HttpResponse(enc.encode({ 'error': 'Movie does not exist!' }),
                            content_type='application/json', status=404)

    if movie.fetch_cover_from_imdb():
        json = res.serialize(None, res.full_dehydrate(bundle), 'application/json')
    else:
        return HttpResponse(enc.encode({ 'error': 'No cover found.' }),
                            content_type='application/json', status=404)
        json = res.serialize(None, res.full_dehydrate(bundle), 'application/json')
    return HttpResponse(json, content_type='application/json')


def get_index_by_id(request, movie_id):
    '''Get index in result list by movie id.'''
    movie_id = int(movie_id)
    res = MovieListResource()
    bundle = res.build_bundle(request=request)
    qs = res.obj_get_list(bundle)
    qs = qs.only('id')
    qs = res.apply_sorting(qs, options=request.GET)
    l = list(qs.values_list('id', flat=True))

    try:
        index = l.index(movie_id)
    except ValueError:
        index = -1

    ret = {
        'success':     True,
        'index':       index,
        'total_count': len(l),
    }
    return HttpResponse(enc.encode(ret), content_type='application/json')


## Statistics

def stats_genres(request):
    data = pie_data(Genre.objects)
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_countries(request):
    data = pie_data(Country.objects)
    return HttpResponse(enc.encode(data), content_type='application/json')

def stats_languages(request):
    data = pie_data(Language.objects)
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_keywords(request):
    data = bar_data(Keyword.objects.add_num_movies().only('name'), 'num_movies')
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_directors(request):
    data = bar_data(Person.objects.directors().only('name'), 'directed_count')
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_cast(request):
    data = bar_data(Person.objects.actors().only('name'), 'acted_in_count')
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_producers(request):
    data = bar_data(Person.objects.producers().only('name'), 'produced_count')
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_writers(request):
    data = bar_data(Person.objects.writers().only('name'), 'written_count')
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_rating(request):
    agg = Movie.objects.aggregate(Min('rating'), Max('rating'))
    rating_min = int(math.floor(agg['rating__min']))
    rating_max = int(math.floor(agg['rating__max']))
    data = bar_data_hist(
        Movie.objects, lambda x, y: { 'rating__range': (x, y) },
        rating_min, rating_max, 0.2)
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_year(request):
    agg = Movie.objects.aggregate(Min('year'), Max('year'))
    year_min = int(math.floor(agg['year__min'] / 10) * 10)
    year_max = int(math.floor(agg['year__max'] / 10) * 10) + 10
    data = bar_data_hist(
        Movie.objects, lambda x, y: { 'year__range': (x, y) },
        year_min, year_max, 5)
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_added_on(request):
    agg = Movie.objects.aggregate(Min('added_on'), Max('added_on'))
    added_on_min_year = agg['added_on__min'].year
    added_on_max_year = agg['added_on__max'].year
    data = bar_data_hist(
        Movie.objects, lambda x, y: { 'added_on__year': x },
        added_on_min_year, added_on_max_year)
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_imdb_sync_on(request):
    data = imdb_sync_on_data(Movie.objects)
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_runtime(request):
    agg = Movie.objects.aggregate(Min('runtime'), Max('runtime'))
    runtime_min = int(math.floor(agg['runtime__min'] / 10) * 10)
    runtime_max = c.STATS_MAX_RUNTIME
    data = bar_data_hist(
        Movie.objects, lambda x, y: { 'runtime__range': (x, y) },
        runtime_min, runtime_max, 10)
    return HttpResponse(enc.encode(data), content_type='application/json')


def stats_mpaa(request):
    data = mpaa_data(Movie.objects)
    return HttpResponse(enc.encode(data), content_type='application/json')
