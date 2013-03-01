from django.conf.urls import patterns, url, include

from flicksapp.api import MovieDetailResource, MovieListResource


movie_detail_resource = MovieDetailResource()
movie_list_resource = MovieListResource()

urlpatterns = patterns('flicksapp.views',
    url(r'^$', 'bootstrap', name='bootstrap'),
    # old API:
    url(r'^autocomplete/$', 'autocomplete'),
    url(r'^fav/$', 'fav'),
    url(r'^mark-seen/$', 'mark_seen'),
    # tastypie API
    (r'^', include(movie_detail_resource.urls)),
    (r'^', include(movie_list_resource.urls)),
)
