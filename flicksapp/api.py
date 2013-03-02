from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.paginator import Paginator
from tastypie.constants import ALL_WITH_RELATIONS

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
    Only lists all properties in the grid columns.
    """
    directors = fields.ToManyField(PersonResource, 'directors', full=True)
    genres = fields.ToManyField(PersonResource, 'genres', full=True)
    languages = fields.ToManyField(LanguageResource, 'languages', full=True)
    countries = fields.ToManyField(CountryResource, 'countries', full=True)
    class Meta:
        queryset = Movie.objects.only(*c.MOVIE_LIST_VIEW_FIELDS)\
            .prefetch_related('countries', 'genres', 'directors')
        fields = c.MOVIE_LIST_VIEW_FIELDS
        resource_name = 'movies'
        include_resource_uri = False
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
