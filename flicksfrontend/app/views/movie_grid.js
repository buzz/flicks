define([
	'backbone',
	'slick.grid'
], function(
	Backbone,
	Slick
) {

	var columns = [
		{
			id:        'number',
			name:      '#',
			field:     'id',
			sortable:  true,
			maxWidth:  60,
			minWidth:  60,
			// formatter: function(row, cell, value, columnDef, dataContext) {
			// 	return 'number';
			// 	// return F.formatter.number_seen_fav(dataContext, value);
			// }
		},
		{
			id:        'title',
			name:      'Title',
			field:     'title',
			sortable:  true,
			width:     250,
			// formatter: function(row, cell, value, columnDef, dataContext) {
			// 	console.log(row);
			// 	// return F.formatter.number_seen_fav(dataContext, value);
			// }
		},
		{
			id:        'genres',
			name:      'Genres',
			field:     'genres',
			width:     190,
			sortable:  false,
			// formatter: function(row, cell, value, columnDef, dataContext) {
			// 	return 'genres';
			// 	// return F.formatter.concatenate(value);
			// }
		},
		{
			id:        'director',
			name:      'Director',
			field:     'directors',
			sortable:  false,
			width:     140,
			// formatter: function(row, cell, value, columnDef, dataContext) {
			// 	return 'director';
			// 	// return F.formatter.concatenate(value);
			// }
		},
		{
			id:        'year',
			name:      'Year',
			field:     'year',
			sortable:  true,
			cssClass:  'align-center',
			maxWidth:  60,
			minWidth:  60,
		},
		{
			id:        'rating',
			name:      'Rating',
			field:     'rating',
			maxWidth:  50,
			minWidth:  50,
			sortable:  true,
			cssClass:  'align-center',
			// formatter: function(row, cell, value, columnDef, dataContext) {
			// 	return value;
			// }
		},
		{
			id:        'runtime',
			name:      'Runtime (min)',
			field:     'runtime',
			minWidth:  60,
			maxWidth:  60,
			sortable:  true,
			cssClass:  'align-right'
		},
		{
			id:        'country',
			name:      'Country',
			field:     'countries',
			sortable:  false,
			minWidth:  69,
			maxWidth:  69,
			cssClass:  'align-center',
			// formatter: function(row, cell, value, columnDef, dataContext) {
			// 	return 'flag list'
			// 	// return F.formatter.flagList(value);
			// }
		},
		{
			id:        'language',
			name:      'Language',
			field:     'languages',
			sortable:  false,
			minWidth:  75,
			maxWidth:  75,
			cssClass:  'align-center',
			// formatter: function(row, cell, value, columnDef, dataContext) {
			// 	return 'languages'
			// 	// return F.formatter.flagList(value);
			// }
		},
	];
	var options = {
		editable: false,
		enableAddRow: false,
		forceFitColumns: true,
		// rowHeight: 19,
		multiSelect: false
	};

	var flag = false; //TODO delme

	var MovieGridView = Backbone.View.extend({
		initialize: function() {
			this.listenTo(App, 'resize', function() {
				this.grid.resizeCanvas();
				this.grid.autosizeColumns();
			}, this);
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

			this.grid = new Slick.Grid(this.el, this.collection, columns, options);
			this.grid.setSelectionModel(new Slick.RowSelectionModel());

			this.grid.onViewportChanged.subscribe(function() {
				that.loadViewport();
			});

			this.listenTo(this.collection, 'dataloaded', function(args) {
				for (var i = args.from; i <= args.to; ++i)
					that.grid.invalidateRow(i);
				that.grid.updateRowCount();
				that.grid.render();
			});

			// load initial rows
			this.loadViewport();
		}

	});

	return MovieGridView;

});
