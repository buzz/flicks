$(function() {

  var F = $.flicks;

  // django model store
  F.store = Slick.Data.RemoteDjangoModel();
  // react on changed data
  F.store.onDataLoaded.subscribe(function(e, args) {
    for (var i = args.from; i <= args.to; ++i)
      F.grid.invalidateRow(i);
    F.grid.updateRowCount();
    F.grid.render();
    // select first row
    if (F.grid.getActiveCell() === null)
      F.grid.setActiveCell(0, 0);
    // update grid sort column glyph
    var sortinfo = F.store.getSort();
    F.grid.setSortColumn(sortinfo.sortcol, sortinfo.sortasc);
  });
  F.store.onError.subscribe(function(e, args) {
    F.modals.error("<strong>Could not load movies!</strong><br><br>Error text: "
                   + args.r.statusText);
    F.ui.disable_spinner();
  });

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
        return F.formatter.number_seen_fav(dataContext, value);
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
      sortable:  false,
      formatter: function(row, cell, value, columnDef, dataContext) {
        return F.formatter.concatenate(value);
      }
    },
    {
      id:        'year',
      name:      'Year',
      field:     'year',
      sortable:  true,
      maxWidth:  60,
      minWidth:  60,
    },
    {
      id:        'rating',
      name:      'Rating',
      field:     'imdb_id',
      sortField: 'rating',
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
      sortable:  false,
      minWidth:  75,
      maxWidth:  75,
      formatter: function(row, cell, value, columnDef, dataContext) {
        return F.formatter.flagList(value);
      }
    },
    {
      id:        'country',
      name:      'Country',
      field:     'countries',
      sortable:  false,
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
      sortable:  false,
      formatter: function(row, cell, value, columnDef, dataContext) {
        return F.formatter.concatenate(value);
      }
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
  ];
  var options = {
    editable: false,
    enableAddRow: false,
    forceFitColumns: true,
    rowHeight: 19,
    multiSelect: false,
  };

  // create grid
  F.grid = new Slick.Grid(F.el.grid, F.store, columns, options);
  F.grid.setSelectionModel(new Slick.RowSelectionModel());

  // events
  F.grid.onSort.subscribe(function(e, args) {
    var sortField = ("sortField" in args.sortCol) ?
      args.sortCol.sortField : args.sortCol.field;
    F.store.setSort(sortField, args.sortAsc);
    F.state.set('sorting', {
      field: sortField,
      asc: args.sortAsc,
    });
    F.gridChange();
  });
  F.grid.onSelectedRowsChanged.subscribe(function(e, args) {
    if (args.rows.length == 1) {
      F.movie.loadMovie(F.store.getItem(args.rows[0]).id, F.ui.renderSidebar);
    }
  });
  F.grid.onViewportChanged.subscribe(function(e, args) {
    F.gridChange();
  });

});
