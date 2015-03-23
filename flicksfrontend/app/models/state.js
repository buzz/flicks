define([
  'backbone'
], function(
  Backbone
) {

  var local_storage_id = 'settings';

  var AppState = Backbone.Model.extend({
    defaults: {
      // current state
      'display_mode':       'grid',
      'selected_movie_id':  undefined,
      'search':             '',
      'filters':            {},
      'filters_count':      0,
      'results_count':      0,
      'order_by':           'title',
      'filters_enabled':    false,
      'details_enabled':    true,

      // preferences
      // empty for now...
    },

    initialize: function() {
      this.on('change', this.save, this);
      this.on('change:search', function() {
        App.vent.trigger('display:fetch-movies');
      }, this);
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

    addTokenFilter: function(key, value) {
      App.state.get('filters')[key].ids.push(value);
      this.save();
    },

    removeTokenFilter: function(key, value) {
      App.state.get('filters')[key].ids.pop(value);
      this.save();
    },

    setFilterAny: function(key, any) {
      this.get('filters')[key].any = any;
      this.save();
    },

    addRangeFilter: function(key, limits) {
      var filter = App.state.get('filters')[key];
      filter.low = limits[0];
      filter.high = limits[1];
      this.save();
    },

    removeRangeFilter: function(key) {
      App.state.get('filters')[key] = {};
      this.save();
    }

  });

  return AppState;

});
