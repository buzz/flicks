define([
  'backbone'
], function(
  Backbone
) {

  var Token = Backbone.Model.extend({

    defaults: {
      id: undefined,
      name: undefined,
      _selected: false,
      any: true
    },

    initialize: function() {
      // restore from app state
      var filters = App.state.get('filters'), key = this.collection.filter_key;
      if (key in filters) {
        var ids = filters[key].ids;
        if (_.indexOf(ids, this.get('id')) > -1) {
          this.set('_selected', true);
        }
      }
    }

  });

  return Token;

});
