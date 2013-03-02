(function ($) {

  //////////////////////////////////////////////////////////////////////////////
  // flicks.movie.js
  //
  // Code related to movie model (Retrieving, update, ...). This is
  // the interface to the movie model no the server side.
  //

  var F = $.flicks;

  F.movie = {};

  // load movie
  F.movie.loadMovie = function(id, cb) {
    $.ajax({
      url: "/movie/" + id,
      dataType: "json",
      type: "GET",
      success: function(movie) {
        F.movie.current = movie;
        cb(movie);
      },
      error: function (r) {
        F.modals.error(
          "<strong>Loading movie details failed " + movie.id +
            "!</strong><br><br>Error text: " + r.statusText);
      }
    });
  }

  // (un)favourite
  F.movie.fav = function(id, unfav, cb) {
    var data = { id: id };
    if (unfav)
      data.unfav = true;
    $.post("/fav/", data, cb).error(function(r) {
      F.modals.error(
        "<strong>Could not set favourite flag for movie!</strong><br><br>"
          + "Error text: " + r.statusText);
    });
  };

  // mark (un)seen
  F.movie.markSeen = function(id, unmark, cb) {
    var data = { id: id };
    if (unmark)
      data.unmark = true;
    $.post("/mark-seen/", data, cb).error(function(r) {
      F.modals.error(
        "<strong>Could not set seen flag for movie!</strong><br><br>"
          + "Error text: " + r.statusText);
    });
  };

})(jQuery);
