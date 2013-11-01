define([
	'marionette',
	'views/details',
	'movie'
], function(
	Marionette,
	DetailsView,
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
				var movie = App.movie_collection.get(id);
				if (!movie)
					movie = App.movie_collection.create({ id: id });
				movie.fetch({
					success: function(movie) {
						var details = new DetailsView({ model: movie });
						App.layout.sidebar.show(details);
						App.trigger('content-resize');
					}
				});
			}

		}
	});

	return Router;

});
