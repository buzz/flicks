(function ($) {

  var F = $.flicks;

  F.actions = {};

  F.actions.favMovie = function(id, cb, unfav) {
    var data = { id: id };
    if (unfav)
      data.unfav = true;
    $.post(
      "/fav/",
      data,
      cb
    ).error(function() {
      F.modals.warning("Error: Could not set favourite flag for movie!");
    });
  };

  F.actions.markSeenMovie = function(id, cb, unmark) {
    var data = { id: id };
    if (unmark)
      data.unmark = true;
    $.post(
      "/mark-seen/",
      data,
      cb
    ).error(function() {
      F.modals.warning("Error: Could not set seen flag for movie!");
    });
  };

})(jQuery);
