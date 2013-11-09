define([
  'marionette',
  'movie'
], function(
  Marionette,
  Movie
) {

  var Router = Marionette.AppRouter.extend({

    appRoutes: {
      '':          'showDetails',
      'movie/:id': 'showDetails',
      'search/':   'search',
      'search/:q': 'search'
    },
    controller: {

      showDetails: function(id) {
        App.state.set('selected-movie-id', id);
        if (id) {
          var movie = App.movie_collection.get(id);
          if (movie)
            movie.set('_selected', true);
        }
      },

      search: function(q) {
        App.state.set('search', q);
      }

    }
  });

  return Router;

});
