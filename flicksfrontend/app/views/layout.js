define([
  'marionette',
  'views/details',
  'views/grid',
  'views/tiles',
  'views/overlay'
], function(
  Marionette,
  DetailsView,
  GridView,
  TilesView,
  OverlayView
) {

  var AppLayout = Marionette.LayoutView.extend({

    id:        'layout',
    template:  'layout',

    regions: {
      overlay: '#overlay',
      toolbar: '#toolbar',
      movies:  '#movies',
      sidebar: '#sidebar'
    },

    events: {
      'click #overlay': 'hideOverlay'
    },

    modelEvents: {
      'change:sidebar_enabled': 'sidebarEnabledChanged',
      'change:selected_movie_id': 'selectedMovieIdChanged'
    },

    initialize: function() {
      this.listenTo(
        App.movie_collection, 'change:_fullFetch', this.sidebarView, this);
    },

    contentView: function(view_mode) {
      var ViewClass = view_mode === 'grid' ? GridView : TilesView;
      var view = new ViewClass({ collection: App.movie_collection });
      this.movies.show(view);
      this.listenTo(view, 'render', function() {
        console.log('render!');
      });
    },

    sidebarView: function(movie) {
      var details = this.sidebar.currentView;
      if (!details) {
        // create view
        details = new DetailsView({ model: movie });
        this.sidebar.show(details);
      }
      // reuse details view
      else {
        details.model = movie;
        details.render();
      }
    },

    showOverlay: function(movie) {
      var view = new OverlayView({ model: movie });
      this.overlay.show(view);
      this.overlay.$el.show();
    },

    hideOverlay: function() {
      var o = this.overlay;
      o.currentView.$el
        .one(
          'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
          function(a,b,c) { o.empty(); }
        )
        .css('opacity', '0.0');
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
        this.sidebar.empty();
    }

  });

  return AppLayout;

});
