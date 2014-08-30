define([
  'marionette',
  'views/grid',
  'views/tiles'
], function(
  Marionette,
  GridView,
  TilesView
) {

  var AppLayout = Marionette.LayoutView.extend({

    id:        'layout',
    template:  'layout',

    regions: {
      modal:   '#modal',
      toolbar: '#toolbar',
      movies:  '#movies',
      sidebar: '#sidebar'
    },

    modelEvents: {
      'change:sidebar_enabled': 'sidebarEnabledChanged',
      'change:selected_movie_id': 'selectedMovieIdChanged'
    },

    initialize: function() {
      this.listenTo(
        App.movie_collection, 'change:_fullFetch', this.sidebarView, this);
    },

    sidebarEnabledChanged: function(state, enabled) {
      var $el = App.layout.sidebar.$el;
      if (enabled)
        $el.removeClass('collapsed');
      else
        $el.addClass('collapsed');
      App.trigger('content-resize');
    },

    selectedMovieIdChanged: function(state, id) {
      if (!id)
        // TODO: is this doubled in app.js?
        this.sidebar.empty();
    }

  });

  return AppLayout;

});
