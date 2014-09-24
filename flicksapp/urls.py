from django.conf.urls import patterns, url, include

from flicksapp.api import (DirectorResource, CastResource, CountryResource,
                           GenreResource, LanguageResource, KeywordResource,
                           MovieDetailResource, MovieListResource)


urlpatterns = patterns('flicksapp.views',

    url(r'^$', 'bootstrap', name='bootstrap'),
    url(r'^index-by-id/(?P<movie_id>\d+)/$', 'get_index_by_id',
        name='get_index_by_id'),
    url(r'^imdb-import/(?P<movie_id>\d+)/$', 'imdb_import', name='imdb_import'),
    url(r'^imdb-cover-import/(?P<movie_id>\d+)/$', 'imdb_cover_import',
        name='imdb_cover_import'),
    url(r'^imdb-search/$', 'imdb_search', name='imdb_search'),

    # REST API
    (r'^', include(DirectorResource().urls)),
    (r'^', include(CastResource().urls)),
    (r'^', include(CountryResource().urls)),
    (r'^', include(GenreResource().urls)),
    (r'^', include(LanguageResource().urls)),
    (r'^', include(KeywordResource().urls)),
    (r'^', include(MovieDetailResource().urls)),
    (r'^', include(MovieListResource().urls)),

)
