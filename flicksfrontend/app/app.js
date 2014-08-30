define([
  'marionette',
  'router',
  'state',
  'collection',
  'util/jst_render',

  'views/layout',
  'views/toolbar',
  'views/details',
  'views/grid'
], function(
  Marionette,
  Router,
  AppState,
  MovieCollection,
  jstRender,

  AppLayout,
  ToolbarView,
  DetailsView,
  GridView
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

    /*
     * Events
     */

    App.state.listenTo(
      App.movie_collection, 'sync', App.state.onCollSync, App.state);

    App.listenTo(App.movie_collection, {

      'dataloaded': function(info) {
        if (info.request_count > 0)
          return;

        var sel_id = App.state.get('selected_movie_id');

        if (sel_id) {
          var movie = App.movie_collection.get(sel_id);
          if (!movie)
            // selected movie is not in the current set, trigger
            // selection of first movie
            sel_id = undefined;
          else if (!movie.get('_fullFetch'))
            movie.fetch();
        }
        if (!sel_id) {
          // select first movie if no other is selected
          var first = App.movie_collection.first();
          if (first) {
            first_id = first.get('id');
            App.router.navigate(
              'movie/%d'.format(first_id), { trigger: true });
            App.movie_collection.get(first_id).set('_selected', true);
          }
        }
      },

      'change:_fullFetch': function(movie) {
        // show details when data is available
        App.vent.trigger('display:details', movie);
      }

    });

    function viewModeChanged(state, view_mode) {
      if (view_mode === 'grid')
        App.vent.trigger('display:grid');
      else if (view_mode === 'tiles')
        App.vent.trigger('display:tiles');
    }

    App.listenTo(App.state, {
      'change:selected_movie_id': function(state, id) {
        // display details in sidebar
        var movie = App.movie_collection.get(id);
        if (movie) {
          if (movie.get('_fullFetch'))
            App.vent.trigger('display:details', movie);
          else
            movie.fetch();
        }
      },

      'change:view_mode': viewModeChanged

    });

    /*
     * App event aggregator
     */
    App.vent.on({

      'display:details': function(movie) {
        if (movie) {
          var details = App.layout.sidebar.currentView;
          if (!details) {
            // create view
            details = new DetailsView({ model: movie });
            App.layout.sidebar.show(details);
          }
          // reuse details view
          else {
            details.model = movie;
            details.render();
          }
        }
        else
          // TODO: is this doubled in layout.js?
          App.layout.sidebar.empty();
      },

      'display:grid': function() {
        var view = new GridView({ collection: App.movie_collection });
        App.layout.movies.show(view);
      },

      'display:tiles': function() {
        var view = new TilesView({ collection: App.movie_collection });
        App.layout.movies.show(view);
      }

    });

    // Init browser history
    Backbone.history.start({
      pushState: false,
      hashChange: true
    });

    // Start movie list view
    viewModeChanged(App.state, App.state.get('view_mode'));

  });

  // Content pane resize
  $(window).resize(function() {
    App.trigger('content-resize');
  });

  return App;
});
