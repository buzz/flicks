define([
  'marionette',
  'movie'
], function(
  Marionette,
  Movie
) {

  var Router = Marionette.AppRouter.extend({

    appRoutes: {
      'movie/:id': 'showMovie'
    },
    controller: {

      showMovie: function(id) {
        App.state.set('selected_movie_id', id);
      }

    }
  });

  return Router;

});
