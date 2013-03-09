(function() {

  var F = $.flicks;

  F.setupGrid = function() {

    // a flag we use for indicating we have to reload the sidebar
    // after next data loading
    F._rowCountChangedFlag = false;
    F.setGridRowCountChangedFlag = function() {
      F._rowCountChangedFlag = true;
    };

    // model store
    F.store = Slick.Data.RemoteRestModel();
    // react on changed data
    F.store.onDataLoaded.subscribe(function(e, args) {
      for (var i = args.from; i <= args.to; ++i)
        F.grid.invalidateRow(i);
      F.grid.updateRowCount();
      F.grid.render();
      // select row
      var vp = F.grid.getViewport();
      if (F.grid.getActiveCell() === null)
        F.grid.setActiveCell(Math.max(0, vp.top), 0);
      // reload sidebar if movie was added/removed
      else if (F._rowCountChangedFlag) {
        F._rowCountChangedFlag = false;
        var movie = F.store.getItem(F.grid.getActiveCell().row);
        F.movie.get(movie.id, F.ui.renderSidebar);
      }
    });
    F.store.onError.subscribe(function(e, args) {
      F.modals.error("<strong>Could not load movies!</strong><br><br>Error text: "
                     + args.r.statusText);
      F.ui.disableSpinner();
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
        formatter: function(row, cell, value, columnDef, dataContext) {
          return F.formatter.number_seen_fav(dataContext, value);
        }
      },
      {
        id:        'title',
        name:      'Title',
        field:     'title',
        sortable:  true,
        width:     250
      },
      {
        id:        'genres',
        name:      'Genres',
        field:     'genres',
        width:     190,
        sortable:  false,
        formatter: function(row, cell, value, columnDef, dataContext) {
          return F.formatter.concatenate(value);
        }
      },
      {
        id:        'director',
        name:      'Director',
        field:     'directors',
        sortable:  false,
        width:     140,
        formatter: function(row, cell, value, columnDef, dataContext) {
          return F.formatter.concatenate(value);
        }
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
        formatter: function(row, cell, value, columnDef, dataContext) {
          return value;
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
      {
        id:        'country',
        name:      'Country',
        field:     'countries',
        sortable:  false,
        minWidth:  69,
        maxWidth:  69,
        cssClass:  'align-center',
        formatter: function(row, cell, value, columnDef, dataContext) {
          return F.formatter.flagList(value);
        }
      },
      {
        id:        'language',
        name:      'Language',
        field:     'languages',
        sortable:  false,
        minWidth:  75,
        maxWidth:  75,
        cssClass:  'align-center',
        formatter: function(row, cell, value, columnDef, dataContext) {
          return F.formatter.flagList(value);
        }
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
        var movie = F.store.getItem(args.rows[0]);
        if (movie)
          F.movie.get(movie.id, F.ui.renderSidebar);
      }
    });
    F.grid.onViewportChanged.subscribe(function(e, args) {
      F.gridChange();
    });

  };

})();
