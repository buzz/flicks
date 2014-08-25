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
    editable: false,
    enableAddRow: false,
    forceFitColumns: true,
    multiSelect: false,
    enableColumnReorder: false
  };

  var GridView = Backbone.View.extend({

    id: 'grid',

    initialize: function() {
      var that = this;

      // grid resizing
      this.listenTo(App, 'content-resize', this.resize, this);

      // state events
      this.listenTo(App.state, {
        'change:order-by': this.loadViewport,
        'change:search':   this.loadViewport
      });

      // collection events
      this.listenTo(this.collection, {
        'change:_selected': this.selectMovie,

        dataloaded: function(args) {
          for (var i = args.from; i <= args.to; ++i)
            that.grid.invalidateRow(i);
          that.grid.updateRowCount();
          that.grid.render();
          that.selectMovie();
        },

        reset: function() {
          this.grid.invalidate();
        }
      });

      // create grid after DOM elements have been placed
      this.on('show', this.createGrid, this);
    },

    resize: function() {
      this.grid.resizeCanvas();
      this.grid.autosizeColumns();
    },

    loadViewport: function() {
      var vp = this.grid.getViewport();

      // ensure one extra screen of items before and after actual
      // range
      var count = vp.bottom - vp.top;
      var from = Math.max(0, vp.top - count)
      var to = vp.bottom + count
      this.collection.ensureData(from, to);
    },

    selectMovie: function(movie) {
      var rows = [];
      var movie = App.movie_collection.getSelected();
      if (movie) {
        var index = movie.get('index');
        rows.push(index);
      }
      if (this.grid.getSelectedRows() != rows)
        this.grid.setSelectedRows(rows);
    },

    createGrid: function() {
      var that = this;

      // create grid
      this.grid = new Slick.Grid(
        this.el, this.collection, columns, grid_options);
      this.grid.setSelectionModel(new Slick.RowSelectionModel());

      // set initial sorting from state
      var sort_field = App.state.get('order-by'), asc = true;
      if (sort_field.charAt(0) === '-') {
        sort_field = sort_field.slice(1);
        asc = false;
      }
      var sort_id = _.find(this.grid.getColumns(), { field: sort_field }).id;
      this.grid.setSortColumn(sort_id, asc);

      // load initial rows
      this.loadViewport();

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

      // user selected a row (by mouse, keyboard interaction)
      this.grid.onSelectedRowsChanged.subscribe(function(e, args) {
        if (args.rows.length == 1) {
          var index = args.rows[0]
          var movie = that.collection.findWhere({ index: index });
          if (movie)
            App.router.navigate('movie/%d'.format(movie.id), { trigger: true });
        }
      });

      // user changed the sorting
      this.grid.onSort.subscribe(function(ev, sort_info) {
        var field = sort_info.sortCol.field, asc = sort_info.sortAsc;
        App.state.set('order-by', '%s%s'.format(asc ? '' : '-', field));
      });
    },

    close: function() {
      // TODO: Unsubscribe grid events?
      console.log('CLOSE');
    }

  });

  return GridView;

});
