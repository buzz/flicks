define([
  'backbone'
], function(
  Backbone
) {

  var local_storage_id = 'settings';

  var AppState = Backbone.Model.extend({
    defaults: {
      'view_mode':          'grid',
      'selected_movie_id':  undefined,
      'search':             {},
      'results_count':      0,
      'order_by':           'title',
      'sidebar_enabled':    true,

      // preferences
      'image_url':          'covers/'
    },

    initialize: function() {
      this.on('change', this.save, this);
    },

    onCollSync: function(coll) {
      if (!_.isUndefined(coll.total_count))
        this.set('results_count', coll.total_count);
    },

    fetch: function() {
      this.set(JSON.parse(localStorage.getItem(local_storage_id)));
    },

    save: function(attributes) {
      localStorage.setItem(local_storage_id, JSON.stringify(this.toJSON()));
    },

    destroy: function(options) {
      localStorage.removeItem(local_storage_id);
    },

  });

  return AppState;

});
