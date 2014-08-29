define([
  'marionette',
  'movie'
], function(
  Marionette,
  Movie
) {

  var Router = Marionette.AppRouter.extend({

    appRoutes: {
      'movie/:id': 'showMovie',
      'search/':   'search',
      'search/:q': 'search'
    },
    controller: {

      showMovie: function(id) {
        App.state.set('selected_movie_id', id);
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
