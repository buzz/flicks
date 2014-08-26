from django.db.models import Q
from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.authorization import Authorization

from flicksapp.models import Movie, Person, Genre, Keyword, File, Language,\
    Country
import flicksapp.constants as c


class PersonResource(ModelResource):
    class Meta:
        queryset = Person.objects.all()
        resource_name = 'person'
        fields = ('name',)
        include_resource_uri = False
        filtering = {
            'name': 'search',
        }

class GenreResource(ModelResource):
    class Meta:
        queryset = Genre.objects.all()
        resource_name = 'genre'
        fields = ('name',)
        include_resource_uri = False
        filtering = {
            'name': 'search',
        }

class KeywordResource(ModelResource):
    class Meta:
        queryset = Keyword.objects.all()
        resource_name = 'keyword'
        fields = ('name',)
        include_resource_uri = False
        filtering = {
            'name': 'search',
        }

class FileResource(ModelResource):
    class Meta:
        queryset = File.objects.all()
        resource_name = 'file'
        fields = ('filename',)
        include_resource_uri = False

class LanguageResource(ModelResource):
    class Meta:
        queryset = Language.objects.all()
        resource_name = 'language'
        fields = ('name',)
        include_resource_uri = False
        filtering = {
            'name': 'search',
        }

class CountryResource(ModelResource):
    class Meta:
        queryset = Country.objects.all()
        resource_name = 'country'
        fields = ('name',)
        include_resource_uri = False
        filtering = {
            'name': 'search',
        }

class BaseMovieResource(ModelResource):
    """
    Basic dehydrate functions.
    """
    def dehydrate_cast(self, bundle):
        return [p.data['name'] for p in bundle.data['cast']]

    def dehydrate_directors(self, bundle):
        return [p.data['name'] for p in bundle.data['directors']]

    def dehydrate_producers(self, bundle):
        return [p.data['name'] for p in bundle.data['producers']]

    def dehydrate_writers(self, bundle):
        return [p.data['name'] for p in bundle.data['writers']]

    def dehydrate_genres(self, bundle):
        return [p.data['name'] for p in bundle.data['genres']]

    def dehydrate_keywords(self, bundle):
        return [p.data['name'] for p in bundle.data['keywords']]

    def dehydrate_files(self, bundle):
        return [p.data['filename'] for p in bundle.data['files']]

    def dehydrate_countries(self, bundle):
        return [p.data['name'] for p in bundle.data['countries']]

    def dehydrate_languages(self, bundle):
        return [p.data['name'] for p in bundle.data['languages']]

class MovieDetailResource(BaseMovieResource):
    """
    Lists all relevant properties.
    """
    cast = fields.ToManyField(PersonResource, 'cast', full=True, readonly=True)
    directors = fields.ToManyField(PersonResource, 'directors', full=True, readonly=True)
    producers = fields.ToManyField(PersonResource, 'producers', full=True, readonly=True)
    writers = fields.ToManyField(PersonResource, 'writers', full=True, readonly=True)
    genres = fields.ToManyField(GenreResource, 'genres', full=True, readonly=True)
    keywords = fields.ToManyField(KeywordResource, 'keywords', full=True, readonly=True)
    files = fields.ToManyField(FileResource, 'files', full=True, readonly=True)
    languages = fields.ToManyField(LanguageResource, 'languages', full=True, readonly=True)
    countries = fields.ToManyField(CountryResource, 'countries', full=True, readonly=True)
    # this makes sure aka is sent as json array
    akas = fields.ListField(attribute='akas', readonly=True)

    class Meta:
        queryset = Movie.objects.all()
        resource_name = 'movie'
        include_resource_uri = False
        authorization = Authorization() # anyone can write!
        always_return_data = True

class MovieListResource(BaseMovieResource):
    """
    Lists only properties necessary for the grid columns.

    We include only include fields that are shown in the grid. That
    way we can omit a lot of queries (eg. cast is not shown in
    grid). BUT: tastypie can't filter on fields that are not included
    as resource fields by default. This is why we implement a custom
    filter using 'build_filters' and add the remaining field manually.
    """

    # these are the related fields we need to show in the grid
    directors = fields.ToManyField(PersonResource,   'directors', full=True)
    genres = fields.ToManyField(PersonResource,      'genres',    full=True)
    languages = fields.ToManyField(LanguageResource, 'languages', full=True)
    countries = fields.ToManyField(CountryResource,  'countries', full=True)

    class Meta:
        max_limit = 200
        queryset = Movie.objects\
            .only(*c.MOVIE_LIST_VIEW_FIELDS)\
            .distinct()\
            .prefetch_related('countries', 'languages', 'genres', 'directors')
        fields = c.MOVIE_LIST_VIEW_FIELDS
        resource_name = 'movies'
        include_resource_uri = False
        ordering = ('id', 'title', 'year', 'rating', 'runtime')
        filtering = {
            'id': 'exact',
            'imdb_id': 'exact',
            'title': 'search',
            'mpaa': 'search',
            'seen': 'exact',
            'favourite': 'exact',
            'countries': ALL_WITH_RELATIONS,
            'languages': ALL_WITH_RELATIONS,
            'genres': ALL_WITH_RELATIONS,
            'keywords': ALL_WITH_RELATIONS,
            'cast': ALL_WITH_RELATIONS,
            'directors': ALL_WITH_RELATIONS,
            'producers': ALL_WITH_RELATIONS,
            'year': ('range', 'exact'),
            'runtime': 'range',
            'rating': 'range',
        }

    def build_filters(self, filters=None):
        if filters is None:
            filters = {}
        orm_filters = super(MovieListResource, self).build_filters(filters)

        # all the fields tastypie would ignore because they are not
        # fields in resource
        queries = ('cast__name__search', 'producers__name__search',
                   'writers__name__search', 'keywords__name__search',
                   'mpaa__search', 'languages__name__search')
        for q in queries:
            if q in filters:
                kwargs = { q: filters[q] }
                orm_filters[q] = Q(**kwargs)

        # "simple search" (the search input at the top of the app) is
        # special because instead of filtering (logical AND) it search
        # in several fields at the same time (logical OR).
        if 'q' in filters:
            q = filters['q']
            qs = Q(title__search=q) | Q(directors__name__search=q)
            if q.isdigit():
                qs = qs | Q(id__exact=q)
            orm_filters['q'] = qs

        return orm_filters

    def apply_filters(self, request, applicable_filters):
        """
        We override this method to support our custom filter 'q'
        """
        if 'q' in applicable_filters:
            q = applicable_filters.pop('q')
        else:
            q = None
        semi_filtered = super(MovieListResource, self).apply_filters(
            request, applicable_filters)
        return semi_filtered.filter(q) if q else semi_filtered
