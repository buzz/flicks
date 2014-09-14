define([
  'backbone',
  'models/movie',
  'constants'
], function(
  Backbone,
  Movie,
  Constants
) {

  // size of one page
  var PAGESIZE = 100;
  // we will wait a certain time before actually loading data. this
  // prevents that if the user is scrolling quickly all the data
  // blocks are loaded at once. on the other hand scrolling slowly
  // should load new data on the fly. so it mustn't be too high!
  var FETCH_DELAY = 180

  var MovieCollection = Backbone.Collection.extend({

    model: Movie,

    url: function() {
      return App.config.movies_root;
    },

    order_by_args: {},
    search_args:   {},

    // keep track of current requests (keys are the offset)
    req_info: {},

    // this cache avoids multiple requests
    index_by_id_cache: {},

    initialize: function() {

      this.throttledFetchPages = _.throttle(
        this._fetchPages, FETCH_DELAY, { leading: false });

      this.listenTo(App.state, {

        // set _selected flag on movie while ensuring there's always
        // only one movie selected at a time
        'change:selected_movie_id': function(state, id) {
          // deselect previous
          var movie = this.findWhere({ _selected: true });
          if (movie)
            movie.set('_selected', false);

          // select current
          if (id) {
            var movie = this.get(id);
            if (movie)
              movie.set('_selected', true);
          }
        },
        'change:order_by': function() {
          this.setSorting.apply(this, arguments);
          this.reset();
        }
      }, this);

      this.on({
        reset: function() {
          this.index_by_id_cache = {};
          this.total_count = 0;
        }
      }, this);
    },

    parse: function(r) {
      this.total_count = r.meta.total_count;
      return r.objects;
    },

    // Slickgrid dataview interface
    // returns total count
    getLength: function() {
      return this.total_count;
    },

    // Slickgrid dataview interface
    // returns item using table row index
    getItem: function(i) {
      var model = this.findWhere({ _index: i });
      if (model)
        return model.attributes;
    },

    // Returns index of movie in the result list even if movie is not
    // in current client-side cached results. This is important for
    // views to be able to jump directly to a movie. Also returns
    // total_count that is needed for movie views that rely on
    // getLength().
    getIndexById: function(id, cb) {
      var that = this;
      var movie = this.get(id);
      if (movie) {
        // movie is already loaded
        cb(movie.get('_index'));
        return;
      }

      // cache hit?
      if (id in this.index_by_id_cache) {
        cb(this.index_by_id_cache[id]);
        return;
      }

      // asking server
      var data = {};
      var url = App.config.get_index_by_id.replace('99999', id);
      _.extend(data, this.order_by_args);
      _.extend(data, this.search_args);
      $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        success: function(resp) {
          that.total_count = resp.total_count;
          that.index_by_id_cache[id] = resp.index;
          cb(resp.index);
        },
        error: function() {
          alert('Error: Communication with server failed!');
        }
      });
    },

    setSorting: function(state, order_by) {
      if (order_by !== this.order_by_args.order_by) {
        this.order_by_args = { order_by: order_by };
      }
    },

    // set filters and search query
    setSearchArgs: function(query, search_args) {
      if (typeof(query) === 'string' && query.length > 0)
        search_args.q = query;
      this.search_args = search_args;
    },

    _fetchPages: function(fromPage, toPage) {
      var that = this;
      for (var i = fromPage; i <= toPage; ++i) {

        var data = {
          // pagination
          offset: i * PAGESIZE,
          limit: PAGESIZE
        };

        // ignore if an identical request is pending
        if (data.offset in this.req_info)
          continue;

        // ordering/search/filtering
        _.extend(data, this.order_by_args);
        _.extend(data, this.search_args);

        // create request
        var req = this.fetch({
          remove: false,
          data: data,
          success: function(coll, resp, opts) {
            var offset = opts.data.offset;

            // remove req reference
            delete that.req_info[offset];

            // set index (important for ordering)
            for (var j = 0; j < resp.objects.length; ++j) {
              var obj = resp.objects[j];
              var model = coll.get(obj.id);
              model.set('_index', j + offset);
            }

            // trigger event
            that.trigger('dataloaded', {
              from: resp.meta.offset,
              to: resp.meta.offset + resp.objects.length - 1,
              request_count: _.keys(that.req_info).length
            });
          },
          error: function(coll, resp, opts) {
            // remove req reference
            delete that.req_info[opts.data.offset];
            alert('Error: Fetching movies failed!');
          }
        });

        // save request info
        this.req_info[data.offset] = req;

        // trigger event
        this.trigger('dataloading', {
          request_count: _.keys(this.req_info).length
        });
      }
    },

    ensureData: function(from, to) {
      // valid range check
      if (from < 0)
        from = 0;
      if (this.total_count && to > this.total_count)
        to = this.total_count;

      var fromPage = Math.floor(from / PAGESIZE);
      var toPage = Math.floor(to / PAGESIZE);

      // check data cache if pages are already loaded by narrowing
      // down the slice that has to be loaded
      while (this.getItem(fromPage * PAGESIZE) && fromPage < toPage)
        fromPage++;
      while (this.getItem(toPage * PAGESIZE) && fromPage < toPage)
        toPage--;

      // load data or already cached?
      if (fromPage > toPage ||
          (fromPage == toPage) && this.getItem(fromPage * PAGESIZE))
        return;

      // fetch items (delay loading so it doesn't get triggered if
      // user just scrolls down the list quickly
      this.throttledFetchPages(fromPage, toPage);
    }

  });

  return MovieCollection;

});
