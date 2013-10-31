define([
	'backbone'
], function(
	Backbone
) {

	// TODO: persist to cookie

	var AppState = Backbone.Model.extend({
		defaults: {
			selected_movie_id: null,
			search:            null
		},

		initialize: function() {
			this.on('change:selected_movie_id', this.changeSelected, this);
		},

		getSelectedMovie: function() {
			return App.movie_collection.get(this.get('selected_movie_id'));
		},

		changeSelected: function(model, id) {
			App.selectMovie(id);
		}
	});

	return AppState;

});
