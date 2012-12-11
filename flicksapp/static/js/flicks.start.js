$(function() {

  var F = $.flicks;

  // TODO: recreate state using cookies (eg. sorting, search, last
  // selected movie, ...)
  F.grid.onViewportChanged.notify();

});
