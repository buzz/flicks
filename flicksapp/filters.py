import django_filters

from flicksapp.models import Movie

class MovieFilterSet(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_type='search')
    countries = django_filters.CharFilter(lookup_type='name__search')
    genres = django_filters.CharFilter(lookup_type='name__search')
    keywords = django_filters.CharFilter(lookup_type='name__search')
    cast = django_filters.CharFilter(lookup_type='name__search')
    directors = django_filters.CharFilter(lookup_type='name__search')
    writers = django_filters.CharFilter(lookup_type='name__search')
    producers = django_filters.CharFilter(lookup_type='name__search')
    mpaa = django_filters.CharFilter(lookup_type='search')
    year = django_filters.RangeFilter()
    runtime = django_filters.RangeFilter()
    rating = django_filters.RangeFilter()
    class Meta:
        model = Movie
        order_by = ('id', 'title', 'director', 'year', 'rating', 'language',
                    'country', 'genres', 'runtime')
        fields = ('title', 'countries', 'genres', 'keywords', 'cast',
                  'directors', 'writers', 'producers', 'mpaa', 'seen',
                  'favourite', 'year', 'runtime', 'rating')
