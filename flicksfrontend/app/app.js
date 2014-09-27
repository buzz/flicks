define([
  'marionette',
  'router',
  'models/state',
  'util/jst_render',

  'collections/movies',
  'collections/filters',
  'collections/imdb-results',

  'views/layout',
  'views/toolbar',
  'views/filters',
  'views/details',
  'views/grid',
  'views/tiles',
  'views/modal',
  'views/add-movie',
  'views/statistics',
  'views/preferences'
], function(
  Marionette,
  Router,
  AppState,
  jstRender,

  MovieCollection,
  FilterCollection,
  ImdbResultCollection,

  AppLayout,
  ToolbarView,
  FiltersView,
  DetailsView,
  GridView,
  TilesView,
  ModalView,
  AddMovieView,
  StatisticsView,
  PreferencesView
) {

  Marionette.Renderer.render = jstRender;

  /*
   * Create app
   */
  App = new Marionette.Application({
    root: '/',
    regions: {
      main: 'body'
    }
  });
  App.root = '/';
  App.addRegions({ main: 'body' });

  // select first movie if no other is selected
  App.selectFirstOrNone = function() {
    var first = App.movie_collection.first();
    if (first) {
      first_id = first.get('id');
      App.router.navigate('movie/%d'.format(first_id), { trigger: true });
      App.movie_collection.get(first_id).set('_selected', true);
    }
    else {
      // no movie in list? -> no movie selected
      App.state.set('selected_movie_id', undefined);
      App.router.navigate('', { trigger: false });
    }
  }

  App.addInitializer(function() {

    App.state = new AppState();
    App.state.fetch();

    App.movie_collection = new MovieCollection();
    App.imdb_results = new ImdbResultCollection();
    App.router = new Router();
    App.layout = new AppLayout({ model: App.state });
    App.main.show(App.layout);
    App.layout.toolbar.show(new ToolbarView({ model: App.state }));

    /*
     * Filters
     */
    App.filters = new FilterCollection();
    App.filters.addFromDefinition([
      {
        name: 'Genres',
        key: 'genres',
        type: 'token',
        url: '/genre/',
        enable_search: false
      },
      {
        name: 'Keywords',
        key: 'keywords',
        type: 'token',
        url: '/keyword/'
      },
      {
        name: 'Directors',
        key: 'directors',
        type: 'token',
        url: '/director/'
      },
      {
        name: 'Cast',
        key: 'cast',
        type: 'token',
        url: '/cast/'
      },
      {
        name: 'Countries',
        key: 'countries',
        type: 'token',
        url: '/country/'
      },
      {
        name: 'Languages',
        key: 'languages',
        type: 'token',
        url: '/language/'
      },
      {
        name: 'Year',
        key: 'year',
        type: 'range',
        min: App.config.year_min,
        max: App.config.year_max,
        precision: 0
      },
      {
        name: 'Rating',
        key: 'rating',
        type: 'range',
        min: 0.0,
        max: 10.0,
        precision: 1,
        step: 0.1
      },
      {
        name: 'Runtime',
        key: 'runtime',
        type: 'range',
        min: App.config.runtime_min,
        max: App.config.runtime_max
      }
    ]);

    App.layout.filters.show(new FiltersView({
      model:      App.state,
      collection: App.filters
    }));
    App.movie_collection.setSearchArgs(
      App.state.get('search'), App.layout.filters.currentView.getSearchArgs());

    /*
     * Events
     */

    App.state.listenTo(
      App.movie_collection, 'sync', App.state.onCollSync, App.state);

    App.listenTo(App.movie_collection, {

      // select movie after load
      'dataloaded': function(info) {
        if (info.request_count > 0)
          return;

        var sel_id = App.state.get('selected_movie_id');

        if (sel_id) {
          var movie = App.movie_collection.get(sel_id);
          if (!movie) {
            // selected movie is not in the current set, trigger
            // selection of first movie
            sel_id = undefined;
          }
          else {
            movie.set('_selected', true);
            if (!movie.get('_fullFetch'))
              movie.fetch();
          }
        }
        if (!sel_id)
          App.selectFirstOrNone();
      },

      // show details when data is available
      'change:_fullFetch': function(movie) {
        App.vent.trigger('display:details', movie);
      }

    });

    function viewModeChanged(state, view_mode) {
      if (view_mode === 'grid')
        App.vent.trigger('display:grid-mode');
      else if (view_mode === 'tiles')
        App.vent.trigger('display:tiles-mode');
    }

    App.listenTo(App.state, {
      // display details
      'change:selected_movie_id': function(state, id) {
        if (!id) {
          App.vent.trigger('display:details', undefined);
          return;
        }
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

      // DISPLAY

      'display:grid-mode': function() {
        var view = new GridView({ collection: App.movie_collection });
        App.layout.movies.show(view);
      },

      'display:tiles-mode': function() {
        var view = new TilesView({ collection: App.movie_collection });
        App.layout.movies.show(view);
      },

      'display:toggle-filters': function() {
        v = !App.state.get('filters_enabled');
        App.state.set('filters_enabled', v);
      },

      'display:details': function(movie) {
        if (movie) {
          var details = App.layout.details.currentView;
          if (details)
            details.destroy();
          details = new DetailsView({ model: movie });
          App.layout.details.show(details);
        }
        else
          App.layout.details.empty();
      },

      'display:toggle-details': function() {
        v = !App.state.get('details_enabled');
        App.state.set('details_enabled', v);
      },

      'display:add-movie': function() {
        var view = new AddMovieView();
        App.layout.modal.show(view);
      },

      'display:statistics': function() {
        var view = new StatisticsView({ model: App.state });
        App.layout.modal.show(view);
      },

      'display:preferences': function() {
        var view = new PreferencesView({ model: App.state });
        App.layout.modal.show(view);
      },

      'display:cover': function(movie) {
        var view = new ModalView({
          model: new Backbone.Model({
            title:     movie.get('title'),
            image_url: movie.getImageUrl()
          }),
          template: 'modal-cover'
        });
        App.layout.modal.show(view);
      },

      'display:confirm-delete': function(movie) {
        var view = new ModalView({
          model:    movie,
          template: 'modal-confirm-delete',
          confirm:  function() {
            App.vent.trigger('action:delete', movie);
          }
        });
        App.layout.modal.show(view);
      },

      'display:fetch-movies': function() {
        App.movie_collection.setSearchArgs(
          App.state.get('search'),
          App.layout.filters.currentView.getSearchArgs());
        App.movie_collection.reset();
      },

      // ACTIONS

      'action:add': function(m) {
        var that = this;
        m.save({}, {
          success: function(m) {
            // reload collection
            that.listenToOnce(App.movie_collection, 'dataloaded', function() {
              // select new movie
              App.movie_collection.getIndexById(m.id, function(index) {
                App.layout.movies.currentView.scrollToRow(index);
                App.router.navigate('movie/%d'.format(m.id), { trigger: true });
              });
            });
            App.movie_collection.reset();
          },
          error: function() {
            alert('Error: Could not create movie!');
          }
        });
      },

      'action:delete': function(movie) {
        movie.destroy({
          success: function() {
            App.movie_collection.reset();
          },
          error: function() {
            alert('Error deleting movie…');
          }
        });
      },

      'action:update': function(movie, cb) {
        movie.updateImdb(cb);
      },

      'action:fetch-cover': function(movie) {
        movie.fetchCover();
      },

      'action:set-flag': function(movie, flag, value) {
        var attrs = {};
        attrs[flag] = value;
        movie.save(attrs, {
          patch: true,
          error: function() {
            alert('Error saving movie…');
          }
        });
      },

      'action:open-external-url': function(url) {
        window.open(url, '_blank');
      },

      'action:search': function(q) {
        App.state.set('search', q);
      },

      'action:add-token-filter': function(key, value) {
        App.state.addTokenFilter(key, value);
        App.vent.trigger('display:fetch-movies');
      },

      'action:remove-token-filter': function(key, value) {
        App.state.removeTokenFilter(key, value);
        App.vent.trigger('display:fetch-movies');
      },

      'action:set-token-filter-any': function(key, any) {
        App.state.setFilterAny(key, any);
        App.vent.trigger('display:fetch-movies');
      },

      'action:add-range-filter': function(key, value) {
        App.state.addRangeFilter(key, value);
        App.vent.trigger('display:fetch-movies');
      },

      'action:remove-range-filter': function(key) {
        App.state.removeRangeFilter(key);
        App.vent.trigger('display:fetch-movies');
      },

      'action:imdb-search': function(q) {
        App.imdb_results.fetch({
          reset: true,
          data: { q: q }
        });
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

  // Load configuration
  // TODO: Bootstrap into index.html (prod) or hard-coded (dev)
  App.config = window.FLICKS_CONFIG;

  // Content pane resize
  $(window).resize(function() {
    App.vent.trigger('display:content-resize');
  });

  return App;
});
