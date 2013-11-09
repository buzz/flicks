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

    onSelected: function(movie, selected) {
      if (selected && !this.get('_fullFetch'))
        movie.fetch();
    },

    url: function() {
      return '%s%s/'.format(this.urlRoot, this.id)
    },

    onSync: function() {
      this.set('_fullFetch', true);
    }

  });

  return Movie;

});
