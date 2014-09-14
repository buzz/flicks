define([
  'marionette',
  'collections/tokens',
  'views/token'
], function(
  Marionette,
  TokenCollection,
  TokenView
) {

  var TokensView = Marionette.CompositeView.extend({

    childViewContainer: '.token-list',
    childView: TokenView,

    collectionEvents: {
      'reset': 'render'
    },

    initialize: function() {
      this.collection = new TokenCollection();
      this.collection.filter_key = this.model.get('key');
      this.collection.url = this.model.get('url');
      this.collection.fetch();
    }

  });

  return TokensView;

});
