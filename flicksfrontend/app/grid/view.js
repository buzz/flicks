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
          var model = that.collection.findWhere({ index: args.rows[0] });
          if (model)
            model.set('_selected', true);
        }
      });

      this.listenTo(this.collection, 'dataloaded', function(args) {
        for (var i = args.from; i <= args.to; ++i)
          that.grid.invalidateRow(i);
        that.grid.updateRowCount();
        that.grid.render();
        // select row
        var movie = App.movie_collection.getSelected();
        if (movie)
          that.grid.setSelectedRows([movie.get('index')]);
      });

      this.listenTo(
        App.state, 'change:selected_movie_id', function(app_state, id) {
        var movie = app_state.getSelectedMovie();
        var rows = [];
        if (movie)
          rows = [ movie.get('index') ];
        that.grid.setSelectedRows(rows);
      }, this);

      // load initial rows
      this.loadViewport();
    }

  });

  return GridView;

});
