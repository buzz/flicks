define([
  'backbone'
], function(
  Backbone
) {

  // External links
  var links = {
    imdb_id:    'http://www.imdb.com/title/tt%07d/',
    imdb_title: 'http://www.imdb.com/find?q=%s',
    kg_id:      'https://karagarga.net/details.php?id=%d',
    kg_imdb:    'https://karagarga.net/browse.php?search_type=imdb&search=%07d',
    kg_title:   'https://karagarga.net/browse.php?search_type=title&search=%s',
    os_imdb:    'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/imdbid-%07d',
    os_title:   'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/moviename-%s',
    youtube:    'https://www.youtube.com/results?search_query=%s'
  };

  var Movie = Backbone.Model.extend({

    defaults: {
      _selected:  false,
      _fullFetch: false,
      _index:     undefined
    },

    urlRoot: '/movie/',

    initialize: function() {
      this.on('sync', this.onSync, this);
    },

    getImageUrl: function() {
      return '%smovies_%d.jpg'.format(App.state.get('image_url'), this.id);
    },

    // get external service urls
    externalUrl: function(service) {
      var
      imdb_id = this.get('imdb_id'),
      title = this.get('title').replace(' ', '+');

      if (service === 'imdb') {
        if (imdb_id)
          return links.imdb_id.format(imdb_id);
        else
          return links.imdb_title.format(title);
      }
      else if (service === 'karagarga') {
        var kg_id = this.get('karagarga_id');
        if (kg_id)
          return links.kg_id.format(kg_id);
        else if (imdb_id)
          return links.kg_imdb.format(imdb_id);
        else
          return links.kg_title.format(title);
      }
      else if (service === 'opensubtitles') {
        if (imdb_id)
          return links.os_imdb.format(imdb_id);
        else
          return links.os_title.format(title);
      }
      else if (service === 'youtube')
        return links.youtube.format(title);
      throw Error('Wrong argument!');
    },

    onSync: function() {
      this.set('_fullFetch', true);
    },

    // exclude attrs that start with _
    save: function(attrs, options) {
      attrs = attrs || this.toJSON();
      options = options || {};

      attrs = _.pick(attrs, function(v, k) {
        return k.indexOf('_') !== 0;
      });

      Backbone.Model.prototype.save.call(this, attrs, options);
    }

  });

  return Movie;

});
