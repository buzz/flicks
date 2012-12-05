$(function() {

  var F = $.flicks;

  // grid change
  F.gridChange = function() {
    if (F.grid !== undefined && F.store !== undefined) {
      var vp = F.grid.getViewport();
      F.store.ensureData(vp.top, vp.bottom);
    }
  }

  var columns = [
    {
      id:        'number',
      name:      '#',
      field:     'id',
      sortable:  true,
      maxWidth:  60,
      minWidth:  60,
			cssClass:  'align-right',
      formatter: function(row, cell, value, columnDef, dataContext) {
        return F.formatter.seen(dataContext.seen, value);
      }
    },
    {
      id:        'title',
      name:      'Title',
      field:     'title',
      sortable:  true,
      width:     300
    },
    {
      id:        'director',
      name:      'Director',
      field:     'directors',
      sortable:  true,
      formatter: F.formatter.concatenate
    },
    {
      id:        'year',
      name:      'Year',
      field:     'year',
      sortable:  true,
      maxWidth:  60,
      minWidth:  60,
      maxWidth:  120,
			cssClass:  'align-right'
    },
    {
      id:        'rating',
      name:      'Rating',
      field:     'imdb_id',
      maxWidth:  50,
      minWidth:  50,
      sortable:  true,
			cssClass:  'align-center',
      formatter: function(row, cell, value, columnDef, dataContext) {
        return F.formatter.imdb(value, dataContext);
      }
    },
    {
      id:        'language',
      name:      'Language',
      field:     'languages',
      sortable:  true,
      minWidth:  75,
      maxWidth:  75,
      formatter: function(row, cell, value, columnDef, dataContext) {
        return F.formatter.flagList(value);
      }
    },
    {
      id:        'subtiles',
      name:      'Subtitles',
      field:     'subtitles',
      sortable:  true,
      minWidth:  65,
      maxWidth:  65,
      formatter: function(row, cell, value, columnDef, dataContext) {
        return F.formatter.flagList(value);
      }
    },
    {
      id:        'country',
      name:      'Country',
      field:     'countries',
      sortable:  true,
      minWidth:  69,
      maxWidth:  69,
      formatter: function(row, cell, value, columnDef, dataContext) {
        return F.formatter.flagList(value);
      }
    },
    {
      id:        'genres',
      name:      'Genres',
      field:     'genres',
      width:     200,
      sortable:  true,
      formatter: F.formatter.concatenate
    },
    {
      id:        'runtime',
      name:      'Runtime (min)',
      field:     'runtime',
      sortable:  true,
			cssClass:  'align-right'
    },
  ];
  var options = {
    editable: false,
    enableAddRow: false,
    forceFitColumns: true,
    rowHeight: 19,
    multiSelect: false,
  };
  var rows = []
  for (var i = 0; i < 253; ++i) {
    rows.push({
      'title': 'CrossSword-' + i,
      'runtime': Math.round(Math.random() * 200),
    });
  }

  F.grid = new Slick.Grid(F.el.grid, F.store, columns, options);
  F.grid.setSelectionModel(new Slick.RowSelectionModel());
  F.grid.onSort.subscribe(function(e, args) {
    F.store.setSort(args.sortCol.field, args.sortAsc);
    F.gridChange();
  });
  F.grid.onSelectedRowsChanged.subscribe(function(e, args) {
    if (args.rows.length == 1) {
      F.ui.loadMovieDetails(F.store.getItem(args.rows[0]));
    }
  });
  F.grid.onViewportChanged.subscribe(function(e, args) {
    F.gridChange();
  });

});
