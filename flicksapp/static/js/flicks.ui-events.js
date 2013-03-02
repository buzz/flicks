$(function() {

  //////////////////////////////////////////////////////////////////////////////
  // flicks.ui-events.js
  //
  // Registers all UI related events.
  //

  var F = $.flicks;

  // Connect UI user events
  F.ui.setupUIEvents = function() {

    ////////// Toolbar

    $("a.button.add").click(function() {
      console.log("Add movie button clicked.");
    });
    $("#top-search form").submit(function() {
      var $input = $(this).find("input[name=query]");
      F.search($input.val());
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
      F.search(q);
      return false;
    });
  // movie action buttons
  F.el.sidebar.on("click", "a.fav-add", function() {
    var id = F.el.sidebar.find(".id").text();
    F.movie.fav(id, false, function() {
      F.store.getItemById(id).favourite = F.movie.current.favourite = true;
      F.ui.currentMovieChanged();
    });
    return false;
  })
  .on("click", "a.fav-remove", function() {
    var id = F.el.sidebar.find(".id").text();
    F.movie.fav(id, true, function() {
      F.store.getItemById(id).favourite = F.movie.current.favourite = false;
      F.ui.currentMovieChanged();
    });
    return false;
  })
  .on("click", "a.mark-seen", function() {
    var id = F.el.sidebar.find(".id").text();
    F.movie.markSeen(id, false, function() {
      F.store.getItemById(id).seen = F.movie.current.seen = true;
      F.ui.currentMovieChanged();
    });
    return false;
  })
  .on("click", "a.unmark-seen", function() {
    var id = F.el.sidebar.find(".id").text();
    F.movie.markSeen(id, true, function() {
      F.store.getItemById(id).seen = F.movie.current.seen = false;
      F.ui.currentMovieChanged();
    });
    return false;
  });

  }

});
