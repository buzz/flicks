from django.conf.urls import patterns, url

from flicksapp.views import MovieList, MovieDetail

urlpatterns = patterns('flicksapp.views',
    url(r'^$', 'bootstrap', name='bootstrap'),
    # old API:
#    url(r'^grid/$', 'grid', name='grid'),
    # url(r'^cast/$', 'cast', name='cast'),
    # url(r'^add$', 'add', name='add'),
    url(r'^autocomplete/$', 'autocomplete'),
    url(r'^fav/$', 'fav'),
    url(r'^mark-seen/$', 'mark_seen'),
    # REST API
    url(r'^movies/$', MovieList.as_view(), name='movie-list'),
    url(r'^movies/(?P<pk>\d+)/$', MovieDetail.as_view(), name='movie-detail'),
)
