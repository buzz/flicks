from django.conf.urls import patterns, url

urlpatterns = patterns('flicksapp.views',
    url(r'^$', 'home', name='home'),
    url(r'^grid/$', 'grid', name='grid'),
    url(r'^cast/$', 'cast', name='cast'),
    url(r'^add$', 'add', name='add'),
    url(r'^autocomplete/$', 'autocomplete'),
    url(r'^fav/$', 'fav'),
    url(r'^mark-seen/$', 'mark_seen'),
)
