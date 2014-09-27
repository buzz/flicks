from django.conf.urls import patterns, url, include

from flicksapp.api import (DirectorResource, CastResource, CountryResource,
                           GenreResource, LanguageResource, KeywordResource,
                           MovieDetailResource, MovieListResource)


urlpatterns = patterns('flicksapp.views',

    # API views
    url(r'^$', 'bootstrap', name='bootstrap'),
    url(r'^index-by-id/(?P<movie_id>\d+)/$', 'get_index_by_id',
        name='get_index_by_id'),
    url(r'^imdb-import/(?P<movie_id>\d+)/$', 'imdb_import', name='imdb_import'),
    url(r'^imdb-cover-import/(?P<movie_id>\d+)/$', 'imdb_cover_import',
        name='imdb_cover_import'),
    url(r'^imdb-search/$', 'imdb_search', name='imdb_search'),

    # Statistics
    url(r'^stats/genres/$', 'stats_genres', name='stats_genres'),
    url(r'^stats/countries/$', 'stats_countries', name='stats_countries'),
    url(r'^stats/languages/$', 'stats_languages', name='stats_languages'),
    url(r'^stats/keywords/$', 'stats_keywords', name='stats_keywords'),
    url(r'^stats/directors/$', 'stats_directors', name='stats_directors'),
    url(r'^stats/cast/$', 'stats_cast', name='stats_cast'),
    url(r'^stats/producers/$', 'stats_producers', name='stats_producers'),
    url(r'^stats/writers/$', 'stats_writers', name='stats_writers'),
    url(r'^stats/rating/$', 'stats_rating', name='stats_rating'),
    url(r'^stats/year/$', 'stats_year', name='stats_year'),
    url(r'^stats/added_on/$', 'stats_added_on', name='stats_added_on'),
    url(r'^stats/imdb_sync_on/$', 'stats_imdb_sync_on', name='stats_imdb_sync_on'),
    url(r'^stats/runtime/$', 'stats_runtime', name='stats_runtime'),
    url(r'^stats/mpaa/$', 'stats_mpaa', name='stats_mpaa'),

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
