define([
  'backbone'
], function(
  Backbone
) {

  // TODO: persist to cookie

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

    onCollSync: function(coll) {
      if (!_.isUndefined(coll.total_count))
        this.set('results_count', coll.total_count);
    }
  });

  return AppState;

});
