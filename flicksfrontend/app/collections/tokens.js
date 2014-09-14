define([
  'backbone',
  'models/token'
], function(
  Backbone,
  Token
) {

  var TokenCollection = Backbone.Collection.extend({

    model: Token,

    parse: function(r) {
      return r.objects;
    }

  });

  return TokenCollection;

});
