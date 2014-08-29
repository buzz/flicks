define([
  'marionette',
  'router',
  'state',
  'collection',
  'views/layout',
  'views/toolbar',
  'views/grid',
  'util/jst_render'
], function(
  Marionette,
  Router,
  AppState,
  MovieCollection,
  AppLayout,
  ToolbarView,
  GridView,
  jstRender
) {

  // External links
  var links = {
    imdb_id:    'http://www.imdb.com/title/tt%07d/',
    imdb_title: 'http://www.imdb.com/find?q=%s',
    kg_id:      'https://karagarga.net/details.php?id=%d',
    kg_imdb:    'https://karagarga.net/browse.php?search_type=imdb&search=%07d',
    kg_title:   'https://karagarga.net/browse.php?search_type=title&search=%s',
    os_imdb:    'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/imdbid-%07d',
    os_title:   'http://www.opensubtitles.org/en/search/sublanguageid-eng,ger/moviename-%s',
    youtube:    'https://www.youtube.com/results?search_query=%s'
  };

  Marionette.Renderer.render = jstRender;

  /*
   * Create app
   */
  App = new Marionette.Application({
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
    App.layout = new AppLayout({ model: App.state });
    App.main.show(App.layout);
    App.layout.toolbar.show(new ToolbarView({ model: App.state }));

    // Grid view
    // TODO: consider view_mode
    var view = new GridView({ collection: App.movie_collection });
    App.listenToOnce(view, 'render', function(view) {
      console.log('run!');
      var movie_id = App.state.get('selected_movie_id');
      if (!movie_id)
        view.loadViewport();
      else
        App.movie_collection.getIndexById(movie_id, function(index) {
          if (index >= 0) {
            view.grid.updateRowCount();
            view.scrollToRow(index);
          }
          else
            view.loadViewport();
        });
    });
    App.layout.movies.show(view);

    /*
     * Events
     */

    App.state.listenTo(
      App.movie_collection, 'sync', App.state.onCollSync, App.state);

    App.listenTo(App.movie_collection, {
      'dataloaded': function() {
        var c = App.movie_collection, selected = c.getSelected();

        if (!selected) {
          var f = c.first();
          if (f)
            f.set('_selected', true);
          else
            App.layout.sidebar.empty();
        }
      }
    });

    App.listenTo(App.state, {
      'change:selected_movie_id': function(state, id) {
        var movie = App.movie_collection.get(id);
        if (movie && movie.get('_fullFetch')) {
          App.layout.sidebarView(movie);
        }
      },

      'change:view_mode': function(state, view_mode) {
        App.layout.moviesView(view_mode);
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
