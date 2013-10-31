define([
	'marionette'
], function(
	Marionette
) {

	var Router = Marionette.AppRouter.extend({
		appRoutes: {
			'':          'deselectMovie',
			'movie/:id': 'selectMovie'
		},
		controller: {

			deselectMovie: function() {
				App.state.set('selected_movie_id', null);
			},

			selectMovie: function(id) {
				App.state.set('selected_movie_id', id);
			}

		}
	});

	return Router;

});
