define([
  'marionette',
  'movie'
], function(
  Marionette,
  Movie
) {

  var Router = Marionette.AppRouter.extend({

    appRoutes: {
      '':          'root',
      'movie/:id': 'showMovie'
    },

    controller: {

      // select the first movie in the list or nothing if the list is
      // empty
      root: function() {
        var sel_id = App.state.get('selected_movie_id');
        if (sel_id)
          App.router.navigate('movie/%d'.format(sel_id), { trigger: true });
        else
          App.selectFirstOrNone();
      },

      showMovie: function(id) {
        App.movie_collection.getIndexById(id, function(index) {
          if (index >= 0)
            App.state.set('selected_movie_id', id);
          else
            App.router.navigate('', { trigger: true });
        });
      }

    }

  });

  return Router;

});
