from django.db.models import Q, Count
from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.authorization import Authorization
from tastypie.exceptions import InvalidFilterError


from flicksapp.models import Movie, Person, Genre, Keyword, File, Language,\
    Country
import flicksapp.constants as c


class NumMoviesMixin(object):
    def dehydrate_num_movies(self, bundle):
        try:
            return bundle.obj.num_movies
        except AttributeError:
            return None


class PersonResource(ModelResource, NumMoviesMixin):
    num_movies = fields.IntegerField()
    class Meta:
        queryset = Person.objects.all()
        resource_name = 'person'
        fields = ('id', 'name', 'num_movies')
        include_resource_uri = False
        filtering = {
            'id': ('exact', 'in'),
            'name': 'icontains',
        }


class DirectorResource(PersonResource):
    class Meta:
        queryset = Person.objects.directors().add_num_movies('directed')
        resource_name = 'director'
        filtering = {
            'id': ('exact', 'in'),
            'name': 'icontains',
        }


class CastResource(PersonResource):
    class Meta:
        queryset = Person.objects.actors().add_num_movies('acted_in')
        resource_name = 'cast'
        filtering = {
            'id': ('exact', 'in'),
            'name': 'icontains',
        }


class GenreResource(ModelResource, NumMoviesMixin):
    num_movies = fields.IntegerField()
    class Meta:
        queryset = Genre.objects.add_num_movies()
        resource_name = 'genre'
        fields = ('id', 'name', 'num_movies')
        include_resource_uri = False
        filtering = {
            'id': ('exact', 'in'),
            'name': 'icontains',
        }
        max_limit = None
        limit = 9999


class KeywordResource(ModelResource, NumMoviesMixin):
    num_movies = fields.IntegerField()
    class Meta:
        queryset = Keyword.objects.add_num_movies()
        resource_name = 'keyword'
        fields = ('id', 'name', 'num_movies')
        include_resource_uri = False
        filtering = {
            'id': ('exact', 'in'),
            'name': 'icontains',
        }


class LanguageResource(ModelResource, NumMoviesMixin):
    num_movies = fields.IntegerField()
    class Meta:
        queryset = Language.objects.add_num_movies()
        resource_name = 'language'
        fields = ('id', 'name', 'num_movies')
        include_resource_uri = False
        filtering = {
            'id': ('exact', 'in'),
            'name': 'icontains',
        }


class CountryResource(ModelResource, NumMoviesMixin):
    num_movies = fields.IntegerField()
    class Meta:
        queryset = Country.objects.add_num_movies()
        resource_name = 'country'
        fields = ('id', 'name', 'num_movies')
        include_resource_uri = False
        filtering = {
            'id': ('exact', 'in'),
            'name': 'icontains',
        }


class FileResource(ModelResource):
    class Meta:
        queryset = File.objects.all()
        resource_name = 'file'
        fields = ('filename',)
        include_resource_uri = False


class BaseMovieResource(ModelResource):
    '''
    Basic dehydrate functions.
    '''
    def _dehydrate_field_only(self, bundle, key, fieldname='name'):
        return [{
            fieldname: p.data[fieldname],
        } for p in bundle.data[key]]
        return [p.data[fieldname] for p in bundle.data[key]]

    def _dehydrate_name_id_only(self, bundle, key):
        return [{
            'id': p.data['id'],
            'name': p.data['name'],
        } for p in bundle.data[key]]

    def dehydrate_cast(self, bundle):
        return self._dehydrate_name_id_only(bundle, 'cast')

    def dehydrate_directors(self, bundle):
        return self._dehydrate_name_id_only(bundle, 'directors')

    def dehydrate_producers(self, bundle):
        return self._dehydrate_name_id_only(bundle, 'producers')

    def dehydrate_writers(self, bundle):
        return self._dehydrate_name_id_only(bundle, 'writers')

    def dehydrate_genres(self, bundle):
        return self._dehydrate_name_id_only(bundle, 'genres')

    def dehydrate_keywords(self, bundle):
        return self._dehydrate_name_id_only(bundle, 'keywords')

    def dehydrate_files(self, bundle):
        return self._dehydrate_field_only(bundle, 'files', fieldname='filename')

    def dehydrate_countries(self, bundle):
        return self._dehydrate_name_id_only(bundle, 'countries')

    def dehydrate_languages(self, bundle):
        return self._dehydrate_name_id_only(bundle, 'languages')


class MovieDetailResource(BaseMovieResource):
    '''
    Lists all relevant properties.
    '''
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
    '''
    Lists only properties necessary for the grid columns.

    We include only include fields that are shown in the grid. That
    way we can omit a lot of queries (eg. cast is not shown in
    grid). BUT: tastypie can't filter on fields that are not included
    as resource fields by default. This is why we implement a custom
    filter using 'build_filters' and add the remaining field manually.
    '''

    # these are the related fields we need to show in the grid
    directors = fields.ToManyField(PersonResource,   'directors', full=True)
    genres    = fields.ToManyField(PersonResource,   'genres',    full=True)
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
            'year': 'range',
            'runtime': 'range',
            'rating': 'range',
        }

    def dehydrate_directors(self, bundle):
        return self._dehydrate_field_only(bundle, 'directors')

    def dehydrate_genres(self, bundle):
        return self._dehydrate_field_only(bundle, 'genres')

    def dehydrate_countries(self, bundle):
        return self._dehydrate_field_only(bundle, 'countries')

    def dehydrate_languages(self, bundle):
        return self._dehydrate_field_only(bundle, 'languages')

    def build_filters(self, filters=None):
        if filters is None:
            filters = {}
        try:
            orm_filters = super(MovieListResource, self).build_filters(filters)
        except InvalidFilterError:
            orm_filters = {}

        # list of Qs not handled by tastypie that evaluated manually
        # in apply_filters
        qs = []

        # id filters
        id_lists = ('cast', 'directors', 'writers', 'producers', 'keywords',
                    'countries', 'languages', 'genres')
        for q in id_lists:
            id_key = '%s__id[]' % q
            any_key = '%s__any' % q
            if id_key in filters:

                try:
                    ids = map(int, filters.getlist(id_key))
                except ValueError:
                    continue

                try:
                    any = filters[any_key] == '1' and True or False
                except KeyError:
                    any = True

                if any:
                    # any of the ids
                    orm_filters['%s__id__in' % q] = ids
                else:
                    # all ids
                    for id in ids:
                        kwargs = {}
                        kwargs['%s__id' % q] = id
                        qs.append(Q(**kwargs))

        # range filters
        ranges = ('year', 'rating', 'runtime')
        for q in ranges:
            range_key = '%s__range' % q
            if range_key in filters:
                limits = filters[range_key].split(',')
                if len(limits) == 2:
                    orm_filters[range_key] = limits

        # text search over multiple fields
        if 'q' in filters:
            q_str = filters['q']
            q = Q(title__search=q_str) | Q(directors__name__search=q_str)
            if q_str.isdigit():
                q = q | Q(id__exact=q_str)
            qs.append(q)

        if len(qs) > 0:
            orm_filters['qs'] = qs
        return orm_filters

    def apply_filters(self, request, applicable_filters):
        '''
        We override this method to support our custom filter 'q'
        '''
        if 'qs' in applicable_filters:
            qs = applicable_filters.pop('qs')
        else:
            qs = None

        f = super(MovieListResource, self).apply_filters(
            request, applicable_filters)

        if qs:
            for q in qs:
                f = f.filter(q)
        return f
