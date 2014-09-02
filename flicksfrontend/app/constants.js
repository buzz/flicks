define({

  // image url builder
  formats: {
    movie_image: '%(url)smovies_%(movie_id)d.jpg%(cachebreaker)s'
  },

  // external links
  links: {
    imdb_id:    'http://www.imdb.com/title/tt%07d/',
    imdb_title: 'http://www.imdb.com/find?q=%s',
    kg_id:      'https://karagarga.net/details.php?id=%d',
    kg_imdb:    'https://karagarga.net/browse.php?search_type=imdb&search=%07d',
    kg_title:   'https://karagarga.net/browse.php?search_type=title&search=%s',
    os_imdb:    'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/imdbid-%07d',
    os_title:   'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/moviename-%s',
    youtube:    'https://www.youtube.com/results?search_query=%s'
  }

});
