$(function() {

  var F = $.flicks;

  // recreate state 
  // TODO:  sorting, last selected movie
  var q = F.state.get("q");
  if (q)
    F.store.setSearch(q);
  var sorting = F.state.get("sorting");
  console.log(sorting);
  if (sorting)
    F.store.setSort(sorting.field, sorting.asc);

  // load initial data
  F.gridChange();
  F.ui.relayout();

});
