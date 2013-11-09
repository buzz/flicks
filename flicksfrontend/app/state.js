define([
  'backbone'
], function(
  Backbone
) {

  // TODO: persist to cookie

  var AppState = Backbone.Model.extend({
    defaults: {
      'view-mode':          'grid',
      'selected-movie-id':  null,
      'search':             {},
      'results-count':      0,
      'order-by':           'title'
    },

    onCollSync: function(coll) {
      if (!_.isUndefined(coll.total_count))
        this.set('results-count', coll.total_count);
    }
  });

  return AppState;

});
