define([
  'backbone',
  'slick.grid',
  'views/grid.columns'
], function(
  Backbone,
  Slick,
  columns
) {

  var grid_options = {
    editable:             false,
    enableAddRow:         false,
    forceFitColumns:      true,
    multiSelect:          false,
    enableColumnReorder:  false,
    rowHeight:            25
  };

  var GridView = Backbone.View.extend({

    id: 'grid',

    initialize: function() {
      // grid resizing
      this.listenTo(App, 'content-resize', this.resize, this);

      // state events
      this.listenTo(App.state, {
        'change:order_by':            this.loadViewport,
        'change:search':              this.loadViewport,
        'change:selected_movie_id':   this.selectedMovieIdChanged
      });

      // collection events
      this.listenTo(this.collection, {

        // when a movie changes re-render that row
        'change': function(model, options) {
          this.grid.invalidateRow(model.get('_index'));
          this.grid.render();
        },

        dataloaded: function(args) {
          for (var i = args.from; i <= args.to; ++i)
            this.grid.invalidateRow(i);
          this.grid.updateRowCount();
          this.grid.render();
        },

        reset: function() {
          this.loadViewport();
          var movie_id = App.state.get('selected_movie_id');
          this.selectedMovieIdChanged(App.state, movie_id);
        }

      }, this);

      this.on('render', function(view) {
        var movie_id = App.state.get('selected_movie_id');
        if (!movie_id)
          // no selected movie -> just load first chunk
          this.loadViewport();
        else
          // set selected movie
          this.selectedMovieIdChanged(App.state, movie_id);
      });

    },

    render: function() {
      var that = this;
      // without defer element dimenions are wrong
      _.defer(function() {
        that.trigger('before:render', that);
        that.createGrid();
        that.trigger('render', that);
      });
      return this;
    },

    scrollToRow: function(index) {
      this.grid.scrollRowToTop(index);
    },

    // loads data pages for the current visible range of rows
    loadViewport: function() {
      var vp = this.grid.getViewport();
      // ensure one extra screen of items before and after actual
      // range
      var count = vp.bottom - vp.top;
      var from = Math.max(0, vp.top - count);
      var to = vp.bottom + count;
      this.collection.ensureData(from, to);
    },

    createGrid: function() {
      var that = this;

      // create grid
      this.grid = new Slick.Grid(
        this.el, this.collection, columns, grid_options);
      this.grid.setSelectionModel(new Slick.RowSelectionModel());

      // set initial sorting from state
      var sort_field = App.state.get('order_by'), asc = true;
      if (sort_field.charAt(0) === '-') {
        sort_field = sort_field.slice(1);
        asc = false;
      }
      var sort_id = _.find(this.grid.getColumns(), { field: sort_field }).id;
      this.grid.setSortColumn(sort_id, asc);

      // GRID EVENTS

      // size of viewport changed
      this.grid.onViewportChanged.subscribe(function() {
        that.loadViewport();
      });

      // cell get active (we prevent it or it causes clicks to be
      // swallowed)
      this.grid.onActiveCellChanged.subscribe(function() {
        // prevent any cell from being active
        // TODO: better way to do this?
        that.grid.resetActiveCell()
      });

      // user selected a row
      this.grid.onSelectedRowsChanged.subscribe(function(e, args) {
        if (args.rows.length == 1) {
          // select movie
          var index = args.rows[0]
          var movie = that.collection.findWhere({ _index: index });
          if (movie)
            App.router.navigate('movie/%d'.format(movie.id), { trigger: true });
        }
      });

      // user changed the sorting
      this.grid.onSort.subscribe(function(ev, sort_info) {
        var field = sort_info.sortCol.field, asc = sort_info.sortAsc;
        App.state.set('order_by', '%s%s'.format(asc ? '' : '-', field));
      });
    },

    // event handlers

    selectedMovieIdChanged: function(model, movie_id) {
      var that = this;
      App.movie_collection.getIndexById(movie_id, function(index) {
        // update grid selected rows
        var rows = [index];
        if (that.grid.getSelectedRows() != rows)
          that.grid.setSelectedRows(rows);

        // scroll to row if not in viewport
        var vp = that.grid.getViewport();
        if (index < vp.top || index > vp.bottom) {
          that.grid.updateRowCount();
          that.scrollToRow(index);
        } else
          that.loadViewport();
      });
    },

    resize: function() {
      this.grid.resizeCanvas();
      this.grid.autosizeColumns();
    },

    close: function() {
      this.grid.unsubscribeAll();
    }

  });

  return GridView;

});
