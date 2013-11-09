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
    multiSelect: false
  };

  var GridView = Backbone.View.extend({

    id: 'grid',

    initialize: function() {
      var that = this;

      // grid resizing
      this.listenTo(App, 'content-resize', this.resize, this);

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
        this.grid.scrollRowIntoView(index);
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

      // grid events
      this.grid.onViewportChanged.subscribe(function() {
        that.loadViewport();
      });
      this.grid.onActiveCellChanged.subscribe(function() {
        // prevent any cell from being active
        // TODO: better way to do this?
        that.grid.resetActiveCell()
      });
      this.grid.onSelectedRowsChanged.subscribe(function(e, args) {
        if (args.rows.length == 1) {
          var index = args.rows[0]
          var movie = that.collection.findWhere({ index: index });
          if (movie)
            App.router.navigate('movie/%d'.format(movie.id), { trigger: true });
        }
      });

      // load initial rows
      this.loadViewport();
    }

  });

  return GridView;

});
