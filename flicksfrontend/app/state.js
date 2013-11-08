define([
  'backbone'
], function(
  Backbone
) {

  // TODO: persist to cookie

  var AppState = Backbone.Model.extend({
    defaults: {
      'view-mode': 'grid',
      'selected-movie-id': null,
      search: null
    }
  });

  return AppState;

});
