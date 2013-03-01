from django.utils import simplejson

from django.core.serializers import serialize
from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Min, Max, Count

from rest_framework import generics

from flicksapp.models import Movie, Person, Country, Genre, Keyword
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

# def grid(request):
#     if request.method == 'POST' and request.is_ajax():
#         # decode POST json
#         json_data = simplejson.loads(request.raw_post_data)
#         offset = json_data['offset']
#         count = json_data['count']
#         try:
#             q = json_data['q']
#         except KeyError:
#             q = None
#         try:
#             adv_search = json_data['adv_search']
#         except KeyError:
#             adv_search = None
#         try:
#             sortcol = json_data['sortcol']
#         except KeyError:
#             sortcol = 'title'
#         try:
#             sortasc = json_data['sortasc']
#         except KeyError:
#             sortasc = True
#         if sortasc:
#             sortdir = ''
#         else:
#             sortdir = '-'
#         # simple search
#         if not q is None and len(q) > 0:
#             movies_total = Movie.objects.simple_search(q)
#         # adv search
#         elif not adv_search is None:
#             movies_total = Movie.objects.adv_search(adv_search)
#         # no search (all movies)
#         else:
#             movies_total = Movie.objects.all()
#         # sorting
#         if sortcol == 'directors':
#             order_by = '%s%s__name' % (sortdir, sortcol)
#         else:
#             order_by = '%s%s' % (sortdir, sortcol)
#         # get results
#         movies = movies_total.order_by(order_by)\
#             [offset:offset + count].prefetch_related(*GRID_PREFETCH)
#         enc = FlicksJSONEncoder()
#         data = enc.encode({
#                 'total': movies_total.count(),
#                 'movies': serialize('python', movies, relations=GRID_PREFETCH,
#                                     excludes=GRID_EXCLUDES),
#                 })
#         return HttpResponse(data, mimetype='application/json')
#     return HttpResponse(enc.encode({ 'error': 'Malformed request!' }),
#                         mimetype='application/json', status=400)

# def add(request):
#     # TODO
#     pass

def autocomplete(request):
    q = request.POST.get('q', None)
    what = request.POST.get('what', None)
    if q is None or what is None:
        return HttpResponse(enc.encode({ 'error': 'Wrong arguments!' }),
                            mimetype='application/json', status=400)
    enc = FlicksJSONEncoder()
    searchterm = ' '.join(['+%s*' % t for t in q.split()])
    if what == 'title':
        titles = Movie.objects.filter(title__search=searchterm)
        akas = Movie.objects.filter(akas__search=searchterm)
        q = (titles | akas).values('title')
        data = enc.encode([m['title'] for m in q[:AC_LIMIT]])
    elif what == 'country':
        q = Country.objects.annotate(movies_count=Count('movies'))\
            .filter(name__search=searchterm).order_by('-movies_count')
        data = enc.encode([c.name for c in q[:AC_LIMIT]])
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
