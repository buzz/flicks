$(function() {

  var F = $.flicks;

  // Connect UI user events
  F.ui.setupUIEvents = function() {

    // Toolbar

    $("a.button.add").click(function() {
      console.log("Add movie button clicked.");
    });
    $("#top-search form").submit(function() {
      var $input = $(this).find("input[name=query]");
      F.search($input.val());
      return false;
    });
    $("#top-search .clear-search").click(function() {
      F.search.clear();
      return false;
    });
    // show advanced search button
    F.el.tb.find("#show-advanced a").click(function() {
      F.ui.show_adv_search();
      return false;
    });

    // Sidebar

    // handle click
    $("#sidebar .handle").click(function() {
      F.state.set('sidebar_collapsed', !F.state.get('sidebar_collapsed'));
      F.ui.relayout();
    });

    // make director names, etc... in sidebar clickable
    $(document).on("click", "a.lookup", function() {
      var $this = $(this);
      var classes = $this.attr('class').split(" ");
      classes.splice(classes.indexOf("lookup"), 1);
      var q = {};
      q[classes[0]] = '"' + $this.text() + '"';
      F.search(q);
      return false;
    });

  }

});
