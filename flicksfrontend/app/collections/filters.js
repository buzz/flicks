define([
  'backbone',
  'models/filter',
  'models/token-filter',
  'models/range-filter'
], function(
  Backbone,
  Filter,
  TokenFilter,
  RangeFilter
) {

  var FilterCollection = Backbone.Collection.extend({

    model: Filter,

    addFromDefinition: function(definitions) {

      // add filters
      var that = this;
      _.each(definitions, function(def) {
        var Cls;
        if (def.type === 'token')
          Cls = TokenFilter;
        else if (def.type === 'range')
          Cls = RangeFilter;
        else
          throw('Invalid filter type: %s'.format(def.type));

        that.add(new Cls(def));
      });

    },

    getSearchArgs: function() {
      var search_args = {};
      this.each(function(filter) {
        _.extend(search_args, filter.getSearchArgs());
      });
      console.log('search_args',search_args);
      return search_args;
    }

  });

  return FilterCollection;

});
