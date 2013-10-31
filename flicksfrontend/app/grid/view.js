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

	var flag = false; //TODO delme

	var MovieGridView = Backbone.View.extend({
		id: 'grid',

		initialize: function() {
			this.listenTo(App, 'resize', this.resize, this);
			this.listenTo(
				App.state, 'change:selected_movie_id', this.movieSelect, this);
		},

		resize: function() {
			this.grid.resizeCanvas();
			this.grid.autosizeColumns();
		},

		movieSelect: function(model, value) {
			// only do expensive resize if sidebar really opened/closed
			var old = model.previous('selected_movie_id');
			if (value === null && old !== null ||
					value !== null && old === null)
				this.resize();
		},

		loadViewport: function() {
			var that = this;
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
				that.grid.resetActiveCell()
			});

			this.grid.onSelectedRowsChanged.subscribe(function(e, args) {
				if (args.rows.length == 1) {
					var model = that.collection.findWhere({ index: args.rows[0] });
					if (model)
						App.router.navigate('movie/%d'.format(model.id), { trigger: true });
				}
			});

			this.listenTo(this.collection, 'dataloaded', function(args) {
				for (var i = args.from; i <= args.to; ++i)
					that.grid.invalidateRow(i);
				that.grid.updateRowCount();
				that.grid.render();
				// select row
				var movie = App.state.getSelectedMovie();
				if (movie)
					that.grid.setSelectedRows([movie.get('index')]);
			});

			this.listenTo(App.state, 'change:selected_movie_id', function(app_state, id) {
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

	return MovieGridView;

});
