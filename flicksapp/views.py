from django.utils import simplejson
from django.core.serializers import serialize
from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Min, Max, Count
from rest_framework import generics
from imdb import IMDb

from flicksapp.models import Movie, Person, Country, Language, Genre, Keyword
from flicksapp.utils import FlicksJSONEncoder
import flicksapp.constants as c


# limit auto-complete results
AC_LIMIT = 20

def bootstrap(request):
    """
    Serves as entry point for this web application.
    """
    enc = FlicksJSONEncoder()
    agg = Movie.objects.aggregate(Min('year'), Max('year'),
                                  Min('rating'), Max('rating'),
                                  Min('runtime'), Max('runtime'))
    ctx = {
        'hidden_info': enc.encode({
            'year_min': agg['year__min'],
            'year_max': agg['year__max'],
            'rating_min': agg['rating__min'],
            'rating_max': agg['rating__max'],
            'runtime_min': agg['runtime__min'],
            'runtime_max': agg['runtime__max'],
        })
    }
    return render(request, 'base.html', ctx)

def autocomplete(request):
    q = request.POST.get('q', None)
    what = request.POST.get('what', None)
    if q is None or what is None:
        return HttpResponse(enc.encode({ 'error': 'Wrong arguments!' }),
                            mimetype='application/json', status=400)
    enc = FlicksJSONEncoder()
    searchterm = ' '.join(['+%s*' % t for t in q.split()])
    data = {}
    if what == 'title':
        titles = Movie.objects.filter(title__search=searchterm)
        akas = Movie.objects.filter(akas__search=searchterm)
        q = (titles | akas).values('title')
        data = enc.encode([m['title'] for m in q[:AC_LIMIT]])
    elif what == 'country':
        q = Country.objects.annotate(movies_count=Count('movies'))\
            .filter(name__search=searchterm).order_by('-movies_count')
        data = enc.encode([c.name for c in q[:AC_LIMIT]])
    elif what == 'language':
        q = Language.objects.annotate(movies_count=Count('movies'))\
            .filter(name__search=searchterm).order_by('-movies_count')
        data = enc.encode([l.name for l in q[:AC_LIMIT]])
    elif what == 'genre':
        q = Genre.objects.annotate(movies_count=Count('movies'))\
            .filter(name__search=searchterm).order_by('-movies_count')
        data = enc.encode([g.name for g in q[:AC_LIMIT]])
    elif what == 'keyword':
        q = Keyword.objects.annotate(movies_count=Count('movies'))\
            .filter(name__search=searchterm).order_by('-movies_count')
        data = enc.encode([g.name for g in q[:AC_LIMIT]])
    elif what == 'cast':
        q = Person.objects.actors().filter(
            name__search=searchterm).order_by('-acted_in_count')
        data = enc.encode([a.name for a in q[:AC_LIMIT]])
    elif what == 'director':
        q = Person.objects.directors().filter(
            name__search=searchterm).order_by('-directed_count')
        data = enc.encode([a.name for a in q[:AC_LIMIT]])
    elif what == 'writer':
        q = Person.objects.writers().filter(
            name__search=searchterm).order_by('-written_count')
        data = enc.encode([a.name for a in q[:AC_LIMIT]])
    return HttpResponse(data, mimetype='application/json')

def fav(request):
    """(Un)favourite a movie."""
    id = request.POST.get('id', None)
    unfav = request.POST.get('unfav', None)
    enc = FlicksJSONEncoder()
    try:
        movie = Movie.objects.get(id=id)
    except Movie.DoesNotExist():
        return HttpResponse(enc.encode({ 'error': 'Movie does not exist!' }),
                            mimetype='application/json', status=404)
    if unfav:
        movie.favourite = False
    else:
        movie.favourite = True
    movie.save()
    return HttpResponse(enc.encode({ 'success': True }),
                        mimetype='application/json')

def mark_seen(request):
    """(Un)mark a movie seen."""
    id = request.POST.get('id', None)
    unmark = request.POST.get('unmark', None)
    enc = FlicksJSONEncoder()
    try:
        movie = Movie.objects.get(id=id)
    except Movie.DoesNotExist():
        return HttpResponse(enc.encode({ 'error': 'Movie does not exist!' }),
                            mimetype='application/json', status=404)
    if unmark:
        movie.seen = False
    else:
        movie.seen = True
    movie.save()
    return HttpResponse(enc.encode({ 'success': True }),
                        mimetype='application/json')

def imdb_search(request):
    """Search IMDb."""
    enc = FlicksJSONEncoder()
    data = {
        'results': [],
    }
    q = request.GET.get('q', None)
    if q:
        i = IMDb()
        results = i.search_movie(q)
        data['results'] = [{
                'imdb_id': int(i.get_imdbID(r)),
                'title': r['title'],
                'year': r['year'],
            } for r in results]
    return HttpResponse(enc.encode(data), mimetype='application/json')
