define([
  'backbone'
], function(
  Backbone
) {

  var Filter = Backbone.Model.extend({

    defaults: {
      name: undefined,
      key: undefined,
      filters_count: 0,
      _selected: false
    },

    initialize: function() {
      // prepare filter representation in state
      var key = this.get('key');
      var filters = App.state.get('filters');
      if (!(key in filters)) {
        filters[key] = {};
      }
    }

  });

  return Filter;

});
