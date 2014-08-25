define([
  'backbone'
], function(
  Backbone
) {

  var Movie = Backbone.Model.extend({

    defaults: {
      _selected: false,
      _fullFetch: false
    },

    urlRoot: '/movie/',

    initialize: function() {
      this.on('sync', this.onSync, this);
      this.on('change:_selected', this.onSelected, this);
    },

    getImageUrl: function() {
      return 'covers/movies_%d.jpg'.format(this.id);
    },

    onSelected: function(movie, selected) {
      if (selected && !this.get('_fullFetch'))
        movie.fetch();
    },

    url: function() {
      return '%s%s/'.format(this.urlRoot, this.id)
    },

    externalUrl: function(service) {
      var
      l = App.links,
      imdb_id = this.get('imdb_id'),
      title = this.get('title').replace(' ', '+');

      if (service === 'imdb') {
        if (imdb_id)
          return l.imdb_id.format(imdb_id);
        else
          return l.os_title.format(title);
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
    }

  });

  return Movie;

});
