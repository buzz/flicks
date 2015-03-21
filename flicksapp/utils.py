from decimal import Decimal
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.query import QuerySet
from imdb import IMDb
from flicksapp.models import Movie



class FlicksJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            # django encoder serializes decimal to str??
            return float(obj)
        if isinstance(obj, QuerySet):
            return serialize('python', obj)
        return super(self.__class__, self).default(obj)


def search_imdb(q, i=IMDb()):
    results = []
    for r in i.search_movie(q):
        imdb_id = int(i.get_imdbID(r))
        movie = {
            'imdb_id': imdb_id,
            'title':   r['title'],
            'in_db':   Movie.objects.filter(imdb_id=imdb_id).count() > 0,
        }
        # year is sometimes not present
        try:
            movie['year'] = r['year']
        except KeyError:
            movie['year'] = '????'
        results.append(movie)
    return results
