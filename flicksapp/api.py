from django.db.models import Q
from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.paginator import Paginator
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
        fields = ('name',)
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

class MovieDetailResource(ModelResource):
    """
    Lists all relevant properties.
    """
    cast = fields.ToManyField(PersonResource, 'cast', full=True)
    directors = fields.ToManyField(PersonResource, 'directors', full=True)
    producers = fields.ToManyField(PersonResource, 'producers', full=True)
    writers = fields.ToManyField(PersonResource, 'writers', full=True)
    genres = fields.ToManyField(GenreResource, 'genres', full=True)
    keywords = fields.ToManyField(KeywordResource, 'keywords', full=True)
    files = fields.ToManyField(FileResource, 'files', full=True)
    languages = fields.ToManyField(LanguageResource, 'languages', full=True)
    countries = fields.ToManyField(CountryResource, 'countries', full=True)
    class Meta:
        queryset = Movie.objects.all()
        resource_name = 'movie'
        include_resource_uri = False

class MovieListResource(ModelResource):
    """
    Lists only properties necessary for the grid columns.

    We include only include fields that are shown in the grid. That
    way we can omit a lot of queries (eg. cast is not shown in
    grid). BUT: tastypie can't filter on fields that are not included
    as resource fields by default. This is why we implement a custom
    filter using 'build_filters' and add the remaining field manually.
    """

    # these are the related fields we need to show in the grid
    directors = fields.ToManyField(PersonResource, 'directors', full=True)
    genres = fields.ToManyField(PersonResource, 'genres', full=True)
    languages = fields.ToManyField(LanguageResource, 'languages', full=True)
    countries = fields.ToManyField(CountryResource, 'countries', full=True)
    class Meta:
        queryset = Movie.objects.only(*c.MOVIE_LIST_VIEW_FIELDS)\
            .prefetch_related('countries', 'genres', 'directors')\
            .distinct()
        fields = c.MOVIE_LIST_VIEW_FIELDS
        resource_name = 'movies'
        include_resource_uri = False
        authorization = Authorization() # anyone can write!
        ordering = ('id', 'title', 'year', 'rating', 'runtime')
        filtering = {
            'title': 'search',
            'mpaa': 'search',
            'seen': 'exact',
            'favourite': 'exact',
            'countries': ALL_WITH_RELATIONS,
            'genres': ALL_WITH_RELATIONS,
            'keywords': ALL_WITH_RELATIONS,
            'cast': ALL_WITH_RELATIONS,
            'directors': ALL_WITH_RELATIONS,
            'producers': ALL_WITH_RELATIONS,
            'year': 'range',
            'runtime': 'range',
            'rating': 'range',
        }
        paginator_class = Paginator

    def build_filters(self, filters=None):
        if filters is None:
            filters = {}
        orm_filters = super(MovieListResource, self).build_filters(filters)
        # all the fields tastypie would ignore because they are not
        # fields in resource
        queries = ('cast__name__search', 'producers__name__search',
                   'writers__name__search', 'keywords__name__search')
        for q in queries:
            if q in filters:
                kwargs = { q: filters[q] }
                orm_filters[q] = Q(**kwargs)
        print "resulting orm:"
        print orm_filters
        return orm_filters
