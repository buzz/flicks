define([
  'backbone',
  'slick.grid',
  'grid/columns'
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
      this.listenTo(App, 'content-resize', this.resize, this);
      this.listenTo(App.movie_collection, 'deselected', function() {
        this.grid.setSelectedRows([]);
      }, this);
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
      if (movie)
        rows = [ movie.get('index') ];
      this.grid.setSelectedRows(rows);
    },

    createGrid: function() {
      var that = this;

      this.grid = new Slick.Grid(
        this.el, this.collection, columns, grid_options);
      this.grid.setSelectionModel(new Slick.RowSelectionModel());

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
          var model = that.collection.findWhere({ index: index });
          if (model)
            model.set('_selected', true);
          that.grid.scrollRowIntoView(index);
        }
      });

      this.listenTo(this.collection, 'dataloaded', function(args) {
        for (var i = args.from; i <= args.to; ++i)
          that.grid.invalidateRow(i);
        that.grid.updateRowCount();
        that.grid.render();
        that.selectMovie();
      });

      this.listenTo(App.movie_collection, 'change:_selected', this.selectMovie);

      // load initial rows
      this.loadViewport();
    }

  });

  return GridView;

});
