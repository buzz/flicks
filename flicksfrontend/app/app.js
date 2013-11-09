define([
  'marionette',
  'router',
  'state',
  'movie',
  'collection',
  'views/layout',
  'views/toolbar',
  'util/jst_render'
], function(
  Marionette,
  Router,
  AppState,
  Movie,
  MovieCollection,
  AppLayout,
  ToolbarView,
  jstRender
) {

  // Defaults
  var tooltipDefaults = {
    container: 'body',
    placement: 'auto bottom',
    trigger:   'manual'
  };

  var links = {
    imdb_id:    'http://www.imdb.com/title/tt%07d/',
    imdb_title: 'http://www.imdb.com/find?q=%s',
    karagarga:  'https://karagarga.net/browse.php?search_type=title&search=%s',
    os_title:   'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/moviename-%s',
    os_imdbid:  'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/imdbid-%07d'
  };

  Marionette.Renderer.render = jstRender;

  /*
   * Create app
   */
  App = new Marionette.Application({

    tooltipDefaults: tooltipDefaults,
    links: links,
    root: '/',
    regions: {
      main: 'body'
    }

  });
  App.root = '/';
  App.addRegions({ main: 'body' });

  App.addInitializer(function() {

    App.state = new AppState();
    App.movie_collection = new MovieCollection();
    App.router = new Router();
    App.layout = new AppLayout();
    App.main.show(App.layout);
    App.layout.toolbar.show(new ToolbarView({ model: App.state }));
    App.layout.contentView(App.state.get('view-mode'));

    App.state.listenTo(
      App.movie_collection, 'sync', App.state.onCollSync, App.state);

    /*
     * Events
     */

    App.listenTo(App.movie_collection, {
      'dataloaded': function() {
        if (!App.layout.sidebar.currentView)
          return;
        var movie = App.layout.sidebar.currentView.model;
        if (movie && !App.movie_collection.findWhere({ id: movie.id }))
          App.layout.sidebar.close();
      },

      'deselected': function() {
        App.router.navigate('', { trigger: true });
      }
    });

    App.listenTo(App.state, {
      'change:selected-movie-id': function(state, id) {
        var movie = App.movie_collection.get(id);
        if (movie && movie.get('_fullFetch'))
          App.layout.sidebarView(movie);
      },

      'change:view-mode': function(state, view_mode) {
        App.layout.contentView(view_mode);
      }
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
