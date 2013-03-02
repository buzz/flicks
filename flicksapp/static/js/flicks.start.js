(function() {

  var F = $.flicks;

  $(function() {
    F.prepare();
    F.setupGrid();

    // app state
    F.state.restore();
    F.state.recreateAppState();

    // UI
    F.addMovie.init();
    F.modals.init();
    F.ui.setupUI();
    F.ui.setupUIEvents();
    F.ui.relayout();

    // load initial data
    F.gridChange();
  });

})();
