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
    }
  ];

  return columns;

});
