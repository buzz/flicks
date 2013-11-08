define([
  'marionette',
  'movie'
], function(
  Marionette,
  Movie
) {

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      '':          'hideDetails',
      'movie/:id': 'showDetails'
    },
    controller: {

      hideDetails: function() {
        if (App.layout.sidebar.currentView) {
          App.layout.sidebar.currentView.close();
          App.trigger('content-resize');
        }
      },

      showDetails: function(id) {
        App.selected_movie_id = id;
        var movie = App.movie_collection.get(id);
        if (movie)
          if (!movie.get('_fullFetch'))
            movie.fetch({ success: App.sidebarView });
          else
            App.sidebarView(movie);
      }

    }
  });

  return Router;

});
