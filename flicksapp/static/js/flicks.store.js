$(function() {

  var F = $.flicks;

  F.store = Slick.Data.RemoteDjangoModel();
  F.store.onDataLoading.subscribe(F.ui.enable_spinner);
  F.store.onDataLoaded.subscribe(function(e, args) {
    if (F.store.getReqCount() < 1)
      F.ui.disable_spinner();
    for (var i = args.from; i <= args.to; ++i)
      F.grid.invalidateRow(i);
    F.el.grid.show();
    F.el.sidebar.show();
    F.grid.updateRowCount();
    F.grid.render();
    F.el.info.html("Found  <strong>" + F.store.getLength() + "</strong> movie" +
                   (F.store.getLength() > 1 ? "s" : "") + ".");
    // select first row
    if (F.grid.getActiveCell() === null) {
      F.grid.setActiveCell(0, 0);
    }
  });

});
