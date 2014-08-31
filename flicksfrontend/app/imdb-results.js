define([
  'backbone',
  'imdb-result'
], function(
  Backbone,
  ImdbResult
) {

  var ImdbResultCollection = Backbone.Collection.extend({

    model: ImdbResult,
    url:   '/imdb-search/',

    initialize: function() {
      // only one selected result at a time
      this.on('change:_selected', function(entry, selected) {
        var that = this;
        if (selected) {
          var all_selected = that.where({ _selected: true });
          _.each(all_selected, function(other) {
            if (entry.get('imdb_id') !== other.get('imdb_id'))
              other.set('_selected', false);
          });
        }
      }, this);
    },

    parse: function(r) {
      return r.results;
    }

  });

  return ImdbResultCollection;

});
