define([
  'backbone',
  'constants'
], function(
  Backbone,
  Constants
) {

  var Movie = Backbone.Model.extend({

    defaults: {
      _selected:  false,
      _fullFetch: false,
      _index:     undefined
    },

    urlRoot: function() {
      return App.config.movie_root;
    },

    // when image is updated on the server-side
    cacheBreakImage: false,

    initialize: function() {
      this.on('sync', this.onSync, this);
    },

    url: function() {
      var url = Backbone.Model.prototype.url.apply(this, arguments);
      if (url[url.length - 1] !== '/')
        return url + '/';
      return url;
    },

    getImageUrl: function() {
      return Constants.formats.movie_image.format({
        url:          App.config.covers_root,
        movie_id:     this.id,
        cachebreaker: this.cacheBreakImage ? '?' + this.cacheBreakImage : ''
      });
    },

    // get external service urls
    externalUrl: function(service) {
      var
      l =       Constants.links,
      imdb_id = this.get('imdb_id'),
      title =   this.get('title').replace(' ', '+');

      if (service === 'imdb') {
        if (imdb_id)
          return l.imdb_id.format(imdb_id);
        else
          return l.imdb_title.format(title);
      }
      else if (service === 'karagarga') {
        var kg_id = this.get('karagarga_id');
        if (kg_id)
          return l.kg_id.format(kg_id);
        else if (imdb_id)
          return l.kg_imdb.format(imdb_id);
        else
          return l.kg_title.format(title);
      }
      else if (service === 'opensubtitles') {
        if (imdb_id)
          return l.os_imdb.format(imdb_id);
        else
          return l.os_title.format(title);
      }
      else if (service === 'youtube')
        return l.youtube.format(title);

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
    },

    updateImdb: function(cb) {
      var that = this;
      var url = App.config.imdb_import.replace('99999', this.get('id'));
      this.cacheBreakImage = new Date().getTime();
      $.ajax({
        url: url,
        dataType: 'json',
        success: function(attrs) {
          that.set(attrs);
          cb(that);
        },
        error: function() {
          alert('Error: Communication with server failed!');
        }
      });
    }

  });

  return Movie;

});
