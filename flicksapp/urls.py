from django.conf.urls import patterns, url, include

from flicksapp.api import MovieDetailResource, MovieListResource


movie_detail_resource = MovieDetailResource()
movie_list_resource = MovieListResource()

urlpatterns = patterns('flicksapp.views',

    # REST API
    (r'^', include(movie_detail_resource.urls)),
    (r'^', include(movie_list_resource.urls)),

    url(r'^$', 'bootstrap', name='bootstrap'),
    url(r'^index-by-id/(?P<movie_id>\d+)/$', 'get_index_by_id',
        name='get_index_by_id'),
    url(r'^imdb-import/(?P<movie_id>\d+)/$', 'imdb_import', name='imdb_import'),
    url(r'^imdb-search/$', 'imdb_search', name='imdb_search'),

    # old frontend
    # url(r'^$', 'bootstrap_OLD', name='bootstrap'),
    # url(r'^autocomplete/$', 'autocomplete_OLD'),
    # url(r'^fav/$', 'fav'),
    # url(r'^mark-seen/$', 'mark_seen_OLD'),
    # url(r'^imdb-search/$', 'imdb_search_OLD'),
    # url(r'^imdb-import/(?P<movie_id>\d+)/$', 'imdb_import_OLD'),

)
