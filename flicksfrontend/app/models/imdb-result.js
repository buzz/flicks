define([
  'backbone'
], function(
  Backbone
) {

  var ImdbResult = Backbone.Model.extend({

    defaults: {
      imdb_id:   undefined,
      title:     undefined,
      year:      undefined,
      in_db:     undefined,
      _selected: false
    },

    getImdbUrl: function() {
      return 'http://www.imdb.com/title/tt%07d/'.format(this.get('imdb_id'));
    }

  });

  return ImdbResult;

});
