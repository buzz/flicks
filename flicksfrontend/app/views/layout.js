define([
  'marionette'
], function(
  Marionette
) {

  var AppLayout = Marionette.Layout.extend({

    id: 'main-layout',
    template: 'layout',

    regions: {
      toolbar: '#toolbar',
      movies:  '#movies',
      sidebar: '#sidebar'
    },

    initialize: function() {
      this.listenTo(
        App.movie_collection, 'deselected', this.onDeselected, this);
      this.listenTo(
        App.movie_collection, 'change:_selected', this.onSelected, this);
      this.listenTo(
        App.movie_collection, 'dataloading', this.updateSpinner, this);
      this.listenTo(
        App.movie_collection, 'dataloaded', this.updateSpinner, this);
    },

    updateSpinner: function(args) {
      var $el = this.$('#spinner');
      if (args.request_count < 1)
        $el.fadeOut();
      else
        $el.fadeIn();
    },

    onSelected: function(movie, value) {
      if (value)
        this.$('#sidebar').removeClass('collapsed');
    },

    onDeselected: function(model, value) {
      this.$('#sidebar').addClass('collapsed');
    }

  });

  return AppLayout;

});
