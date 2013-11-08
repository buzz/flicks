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
