define([
  'models/filter'
], function(
  Filter
) {

  var TokenFilter = Filter.extend({

    defaults: _.extend({}, Filter.prototype.defaults, {
      any: false,
      enable_search: true
    }),

    initialize: function() {
      Filter.prototype.initialize.apply(this, arguments);
      // prepare filter representation in state
      var filters = App.state.get('filters')[this.get('key')];
      if (!('ids' in filters))
        filters.ids = [];
      if (!('any' in filters))
        filters.any = this.defaults.any;
      // restore from app state
      this.set('any', filters.any);
    }

  });

  return TokenFilter;

});
