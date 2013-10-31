define([
	'marionette'
], function(
	Marionette
) {

	var ToolbarView = Marionette.ItemView.extend({
		template: 'toolbar',
		className: 'navbar navbar-default navbar-static-top',

		modelEvents: {
			'change:selected_movie_id': 'updateButtons'
		},

		events: {
			'click #open-imdb':          'openImdb',
			'click #open-karagarga':     'openKaragarga',
			'click #open-opensubtitles': 'openOpensubtitles'
		},

		onRender: function() {
			this.$('.enable-tooltip').tooltip(App.tooltipDefaults);
		},

		updateButtons: function(model, value) {
			var func = value ? 'removeClass' : 'addClass';
			this.$('.movie-action')[func]('disabled');
		},

		openKaragarga: function() {
			var title = App.state.getSelectedMovie().get('title');
			window.open(App.links.karagarga.format(title), '_blank');
			return false;
		},

		openImdb: function() {
			this.searchImdbIdOrTitle(App.links.imdb_id, App.links.imdb_title);
			return false;
		},

		openOpensubtitles: function() {
			this.searchImdbIdOrTitle(App.links.os_imdbid, App.links.os_title);
			return false;
		},

		searchImdbIdOrTitle: function(url_imdbid, url_title) {
			var movie = App.state.getSelectedMovie();
			var imdb_id = movie.get('imdb_id'), url;
			if (imdb_id)
				url = url_imdbid.format(imdb_id);
			else
				url = url_title.format(movie.get('title').replace(' ', '+'));
			window.open(url, '_blank');
		}

	});

	return ToolbarView;

});
