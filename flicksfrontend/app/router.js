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
        App.state.set('selected-movie-id', id);
        var movie = App.movie_collection.get(id);
        if (movie)
          movie.set('_selected', true);
      }

    }
  });

  return Router;

});
