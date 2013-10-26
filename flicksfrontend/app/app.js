define([
	'marionette',
	'router',
	'movies_dataview',
	'views/toolbar',
	'views/movie_grid'
], function(
	Marionette,
	Router,
	MovieCollection,
	ToolbarView,
	MovieGridView
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

	App = new Marionette.Application();
	App.root = '/';
	App.addRegions({ main: 'body' });
	App.addInitializer(function() {
		var AppLayout = Marionette.Layout.extend({
			id: 'main-layout',
			className: 'container-fluid',
			template: 'layout',
			regions: {
				toolbar: '#toolbar',
				movies:  '#movies',
				sidebar: '#sidebar'
			}
		});

		App.movie_collection = new MovieCollection();

		App.layout = new AppLayout();
		App.main.show(App.layout);

		var toolbar = new ToolbarView();
		App.layout.toolbar.show(toolbar);

		var movie_grid = new MovieGridView({
			collection: App.movie_collection,
			id: 'movie-grid'
		});
		App.layout.movies.show(movie_grid);

		// Slickgrid reads container height. So wait for DOM...
		$(function () { movie_grid.createGrid(); });

		// All links with the role attribute set to nav-main will navigate through
		// the application's router.
		// $('a[role=nav-main]').click(function(e) {
		// e.preventDefault();
		// App.Router.navigate($(this).attr('href'), {
		// trigger: true
		// });
		// });
	});

	// Central resize event
	$(window).resize(function(evt) { App.trigger('resize', evt) });

	return App;
});
