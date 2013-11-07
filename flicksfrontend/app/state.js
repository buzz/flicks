define([
  'backbone'
], function(
  Backbone
) {

  // TODO: persist to cookie

  var AppState = Backbone.Model.extend({
    defaults: {
      'view-mode': 'grid',
      search: null
    }
  });

  return AppState;

});
