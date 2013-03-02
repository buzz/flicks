(function() {

  //////////////////////////////////////////////////////////////////////////////
  // flicks.ui-events.js
  //
  // Registers all UI related events.
  //

  var F = $.flicks;

  // Connect UI user events
  F.ui.setupUIEvents = function() {

    ////////// Window resize

    $(window).resize(F.ui.relayout);

    ////////// Toolbar

    $("a.button.tile-view").click(function() {
      console.log("Tiel view button clicked.");
    });
    $("a.button.add").click(function() {
      F.el['dialog-add-movie'].dialog('open');
    });
    $("#top-search form").submit(function() {
      var $input = $(this).find("input[name=query]");
      F.search.do($input.val());
      return false;
    });
    $(document).on('click', '#top-search .clear-search', function() {
      F.search.clear();
      return false;
    });
    // show advanced search button
    F.el.tb.find("#show-advanced a").click(function() {
      F.ui.show_adv_search();
      return false;
    });

    ////////// Adv. search form

    $(document).on('click', '#adv-search .clear-search', function() {
      F.search.clear();
      F.ui.render_adv_search();
      return false;
    });
    $(document).on('click', '#adv-search .close', function() {
      F.el['adv-search'].slideUp('fast');
      return false;
    });
    // adv. search submit
    $(document).on('submit', '#adv-search form', F.ui.submitAdvancedSearch);

    ////////// Sidebar

    // sidebar toggle
    $("#sidebar .handle").click(F.ui.toggle_sidebar);
    // make director names, etc... in sidebar clickable
    $(document).on("click", "a.lookup", function() {
      var $this = $(this);
      var classes = $this.attr('class').split(" ");
      classes.splice(classes.indexOf("lookup"), 1);
      var field = classes[0], q = {};
      // for all string searches we wrap the term in quotes to match
      // exactly that name (except year which works numerically)
      if (field === 'year')
        q[field] = $this.text();
      else
        q[field] = '"' + $this.text() + '"';
      F.search.do(q);
      return false;
    });
  // movie action buttons
  F.el.sidebar.on("click", "a.fav-add", function() {
    var id = F.movie.current.id;
    F.movie.fav(id, false, function() {
      F.store.getItemById(id).favourite = F.movie.current.favourite = true;
      F.ui.currentMovieChanged();
    });
    return false;
  })
  .on("click", "a.fav-remove", function() {
    var id = F.movie.current.id;
    F.movie.fav(id, true, function() {
      F.store.getItemById(id).favourite = F.movie.current.favourite = false;
      F.ui.currentMovieChanged();
    });
    return false;
  })
  .on("click", "a.mark-seen", function() {
    var id = F.movie.current.id;
    F.movie.markSeen(id, false, function() {
      F.store.getItemById(id).seen = F.movie.current.seen = true;
      F.ui.currentMovieChanged();
    });
    return false;
  })
  .on("click", "a.unmark-seen", function() {
    var id = F.movie.current.id;
    F.movie.markSeen(id, true, function() {
      F.store.getItemById(id).seen = F.movie.current.seen = false;
      F.ui.currentMovieChanged();
    });
    return false;
  })
  .on("click", "a.delete", function() {
    F.movie.delete(F.movie.current, function(movie) {
      F.store.clear();
      F.grid.invalidate();
      F.gridChange();
      F.modals.info(
        '<strong>Movie deleted: "' + movie.title + '" (' + movie.id + ')!');
    });
    return false;
  });

  }

})();
