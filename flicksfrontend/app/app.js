define([
  'marionette',
  'router',
  'state',
  'movie',
  'collection',
  'views/layout',
  'views/toolbar',
  'grid/view',
  'views/tiles'
], function(
  Marionette,
  Router,
  AppState,
  Movie,
  MovieCollection,
  AppLayout,
  ToolbarView,
  GridView,
  TilesView
) {

  // Defaults
  var tooltipDefaults = {
    container: 'body',
    placement: 'bottom'
  };

  var links = {
    imdb_id:    'http://www.imdb.com/title/tt%07d/',
    imdb_title: 'http://www.imdb.com/find?q=%s',
    karagarga:  'https://karagarga.net/browse.php?search_type=title&search=%s',
    os_title:   'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/moviename-%s',
    os_imdbid:  'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/imdbid-%07d'
  };

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
  App = new Marionette.Application({

    tooltipDefaults: tooltipDefaults,
    links: links,

    contentView : function(view_mode) {
      var ViewClass = view_mode === 'grid' ? GridView : TilesView;
      var view = new ViewClass({ collection: App.movie_collection });
      App.layout.movies.show(view);
    }

  });
  App.root = '/';
  App.addRegions({ main: 'body' });

  App.addInitializer(function() {

    App.movie_collection = new MovieCollection();

    App.router = new Router();
    App.state = new AppState();

    App.layout = new AppLayout();
    App.main.show(App.layout);

    var toolbar = new ToolbarView({ model: App.state });
    App.layout.toolbar.show(toolbar);

    App.contentView(App.state.get('view-mode'));

    /*
     * Events
     */

    App.listenTo(App.movie_collection, 'change:_selected', function(movie, selected) {
      if (selected)
        App.router.navigate('movie/%d'.format(movie.id), { trigger: true });
    });

    App.listenTo(App.movie_collection, 'deselected', function() {
      App.router.navigate('', { trigger: true });
    });

    App.listenTo(App.state, 'change:view-mode', function(state, view_mode) {
      App.contentView(view_mode);
    });

    // on DOM ready
    $(function () {
      // App router
      Backbone.history.start({
        pushState: false,
        hashChange: true
      });
    });

  });

  // Content pane resize
  $(window).resize(function() {
    App.trigger('content-resize');
  });

  return App;
});
