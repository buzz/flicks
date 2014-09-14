define([
  'models/filter'
], function(
  Filter
) {

  var RangeFilter = Filter.extend({

    defaults: _.extend({}, Filter.prototype.defaults, {
      min: undefined,
      max: undefined,
      low: undefined,
      high: undefined,
      precision: 0,
      step: 1
    }),

    initialize: function() {
      Filter.prototype.initialize.apply(this, arguments);

      var key = this.get('key'), filters = App.state.get('filters')[key],
        low = this.get('min'), high = this.get('max');

      // restore from app state
      if ('low' in filters)
        low = filters.low;
      if ('high' in filters)
        high = filters.high;
      this.set('low', low);
      this.set('high', high);
    }

  });

  return RangeFilter;

});
