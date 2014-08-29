define([
  'marionette',
  'views/details',
  'views/grid',
  'views/tiles'
], function(
  Marionette,
  DetailsView,
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

    // moviesView: function(view_mode) {
    //   var ViewClass = view_mode === 'grid' ? GridView : TilesView;
    //   var view = new ViewClass({ collection: App.movie_collection });
    //   this.movies.show(view);
    //   return view;
    // },

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
