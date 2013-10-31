define([
	'marionette',
	'router',
	'state',
	'movie',
	'collection',
	'views/layout',
	'views/toolbar',
	'grid/view',
	'views/details'
], function(
	Marionette,
	Router,
	AppState,
	Movie,
	MovieCollection,
	AppLayout,
	ToolbarView,
	GridView,
	DetailsView
) {

	/* 
	 * The following will make Marionette's template retrieval work with
	 * in both development (templates found in html files) and production
	 * environment (templates all compiled AS JST templates into the require.js
	 * file. This will also use JST instead of the Marionette.TemplateCache.
	 */
	Marionette.Renderer.render = function(templateId, data) {
		if (typeof templateId == 'function') {
			return templateId(data);
		} else {
			var path = 'app/templates/' + templateId + '.html';

			// Localize or create a new JavaScript Template object.
			var JST = window.JST = window.JST || {};

			// Make a blocking ajax call (does not reduce performance in production,
			// because templates will be contained by the require.js file).
			if (!JST[path]) {
				$.ajax({
					url: App.root + path,
					async: false
				}).then(function(templateHtml) {
					JST[path] = _.template(templateHtml);
					JST[path].__compiled__ = true;
				});
			}

			if (!JST[path]) {
				var msg = 'Could not find "' + templateId + '"';
				var error = new Error(msg);
				error.name = 'NoTemplateError';
				throw error;
			}

			return JST[path](data);
		}
	};

	/*
	 * Create app
	 */
	App = new Marionette.Application();
	App.root = '/';
	App.addRegions({ main: 'body' });

	// Defaults
	App.tooltipDefaults = {
		container: 'body',
		placement: 'bottom'
	};
	App.links = {
		imdb_id:    'http://www.imdb.com/title/tt%07d/',
		imdb_title: 'http://www.imdb.com/find?q=%s',
		karagarga:  'https://karagarga.net/browse.php?search_type=title&search=%s',
		os_title:   'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/moviename-%s',
		os_imdbid:  'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/imdbid-%07d'
	};

	App.addInitializer(function() {

		App.movie_collection = new MovieCollection();

		App.router = new Router();
		App.state = new AppState();

		App.layout = new AppLayout();
		App.main.show(App.layout);

		var toolbar = new ToolbarView({ model: App.state });
		App.layout.toolbar.show(toolbar);

		var grid = new GridView({ collection: App.movie_collection });
		App.layout.movies.show(grid);

		// helper functions
		App.selectMovie = function(id) {
			// fetch full movie info
			var movie = new Movie({ id: id });
			movie.fetch({
				success: function(movie) {
					var details = new DetailsView({ model: movie });
					App.layout.sidebar.show(details);
				}
			});
		};

		// on DOM ready
		$(function () {
			// Slickgrid needs container height
			grid.createGrid();
			// App router
			Backbone.history.start({
				pushState: false,
				hashChange: true
			});
		});

	});

	// Central resize event
	$(window).resize(function(evt) { App.trigger('resize', evt) });

	return App;
});
