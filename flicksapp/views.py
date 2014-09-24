from django.conf import settings
from django.core.serializers import serialize
from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Min, Max, Count
from django.core.urlresolvers import reverse

from imdb import IMDb

from flicksapp.models import Movie, Person, Country, Language, Genre, Keyword
from flicksapp.api import MovieDetailResource, MovieListResource
from flicksapp.utils import FlicksJSONEncoder
import flicksapp.constants as c


def bootstrap(request):
    '''
    Serves as entry point for this web application.
    '''
    enc = FlicksJSONEncoder()
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
    enc = FlicksJSONEncoder()
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
    enc = FlicksJSONEncoder()
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
    enc = FlicksJSONEncoder()
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
    enc = FlicksJSONEncoder()
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
