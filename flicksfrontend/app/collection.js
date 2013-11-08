define([
  'backbone',
  'movie'
], function(
  Backbone,
  Movie
) {

  // size of one page
  var PAGESIZE = 100;
  // we will wait a certain time before actually loading data. this
  // prevents that if the user is scrolling quickly all the data
  // blocks are loaded at once. on the other hand scrolling slowly
  // should load new data on the fly. so it mustn't be too high!
  var FETCH_DELAY = 180

  var timeout = null;

  // keep track of current requests (keys are the offset)
  var req_info = {};

  var MovieCollection = Backbone.Collection.extend({

    model: Movie,
    url:   '/movies/',

    initialize: function() {
      this.on('dataloaded', function(args) {
        var sel_id = App.state.get('selected-movie-id');
        if (!sel_id)
          return;
        _.every(this.models, function(movie) {
          if (movie.id == sel_id) {
            movie.set('_selected', true);
            return false;
          }
          return true;
        });
      });

      this.on('change:_selected', function(sel_movie, value) {
        // just one movie selected at a time
        if (value) {
          _.each(this.where({ _selected: true }),
                 function(movie) {
                   if (movie !== sel_movie)
                     movie.set('_selected', false);
                 });
        }
        else if (!this.getSelected()) {
          this.trigger('deselected');
        }
      });
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
      var model = this.findWhere({ index: i });
      if (model)
        return model.attributes;
    },

    _fetchPages: function(fromPage, toPage) {
      var that = this;
      for (var i = fromPage; i <= toPage; ++i) {

        var offset = i * PAGESIZE

        // ignore if an identical request is pending
        if (offset in req_info)
          continue;

        // create request
        var req = this.fetch({
          remove: false,
          data: {
            offset: offset,
            limit: PAGESIZE
          },
          success: function(coll, resp) {
            var offset = resp.meta.offset;
            for (var j = 0; j < resp.objects.length; ++j) {
              // set table index
              var obj = resp.objects[j];
              var model = coll.get(obj.id);
              model.set('index', j + offset);
            }
          }
        }).success(function(resp) {
          that.trigger('dataloaded', {
            from: resp.meta.offset,
            to: resp.meta.offset + resp.objects.length - 1,
            request_count: _.keys(req_info).length - 1
          });
        }).always(function(resp) {
          // remove request info
          delete req_info[offset]
        });

        // save request info
        req_info[offset] = req;

        // trigger event
        this.trigger('dataloading', {
          request_count: _.keys(req_info).length
        });
      }
    },

    ensureData: function(from, to) {
      var that = this;

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
      if (timeout)
        clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        that._fetchPages(fromPage, toPage);
      }, FETCH_DELAY);

    },

    getSelected: function() {
      return this.findWhere({ _selected: true });
    }

  });

  return MovieCollection;

});
