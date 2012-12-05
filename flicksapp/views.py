from django.core.serializers import serialize
from django.shortcuts import render
from django.http import HttpResponse

from flicksapp.models import Movie
from flicksapp.utils import FlicksJSONEncoder

def home(request):
    return render(request, 'list.html', {'film_table': None})

def grid(request):
    if request.method == 'POST':
        q = request.POST.get('q', None)
        offset = int(request.POST.get('offset', 0))
        count = int(request.POST.get('count', 0))
        sortcol = request.POST.get('sortcol', 'title')
        if request.POST.get('sortasc', 'true') == 'true':
            sortdir = ''
        else:
            sortdir = '-'
        if not q is None and len(q) > 0:
            movies_total = Movie.objects.search(q)
        else:
            movies_total = Movie.objects.all()
        prefetch = ('countries', 'directors', 'producers', 'writers', 'genres',
                    'languages', 'files', 'keywords')
        movies = movies_total.order_by('%s%s' % (sortdir, sortcol))\
            [offset:offset + count].prefetch_related(*prefetch)
        enc = FlicksJSONEncoder()
        data = enc.encode({
                'total': movies_total.count(),
                'movies': serialize('python', movies, relations=prefetch,
                                    excludes=('cast',)),
                })
        return HttpResponse(data, mimetype='application/json')
    return HttpResponse('')

def cast(request):
    enc = FlicksJSONEncoder()
    movie_id = request.POST.get('movie_id', None)
    try:
        cast = Movie.objects.get(id=movie_id).cast.all()
    except Movie.DoesNotExist:
        return HttpResponse(enc.encode({ 'error': 'Could not find movie' }),
                            mimetype='application/json', status=404)
    data = enc.encode({
            'cast': serialize('python', cast),
            })
    return HttpResponse(data, mimetype='application/json')

def add(request):
    pass

def search(request):
    pass
