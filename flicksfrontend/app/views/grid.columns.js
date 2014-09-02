define([
  'util/formatter'
], function(
  formatter
) {

  var columns = [
    {
      id:        'number',
      name:      '#',
      field:     'id',
      sortable:  true,
      maxWidth:  60,
      minWidth:  60,
      formatter: function(row, cell, value, columnDef, dataContext) {
        return formatter.number_seen_fav(dataContext, value);
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
        return formatter.concatenate(value);
      }
    },
    {
      id:        'director',
      name:      'Director',
      field:     'directors',
      sortable:  false,
      width:     140,
      formatter: function(row, cell, value, columnDef, dataContext) {
        return formatter.concatenate(value);
      }
    },
    {
      id:        'year',
      name:      'Year',
      field:     'year',
      sortable:  true,
      cssClass:  'align-center',
      maxWidth:  60,
      minWidth:  60
    },
    {
      id:        'rating',
      name:      'Rating',
      field:     'rating',
      maxWidth:  80,
      minWidth:  80,
      sortable:  true,
      cssClass:  'align-center',
      formatter: function(row, cell, value, columnDef, dataContext) {
        if (!value)
          return 'N/A';
        return '%.1f'.format(value);
      }
    },
    {
      id:        'runtime',
      name:      'Runtime',
      field:     'runtime',
      minWidth:  80,
      maxWidth:  80,
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
        return formatter.flagList(value);
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
        return formatter.flagList(value);
      }
    }
  ];


  return columns;

});
