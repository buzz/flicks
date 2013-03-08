(function() {

  //////////////////////////////////////////////////////////////////////////////
  // flicks.movie.js
  //
  // Code related to movie model (Retrieving, update, ...). This is
  // the interface to the movie model no the server side.
  //

  var F = $.flicks;

  F.movie = {};

  // load movie
  F.movie.get = function(id, cb) {
    $.ajax({
      url: '/movie/' + id + '/',
      dataType: 'json',
      type: 'GET',
      success: function(movie) {
        F.movie.current = movie;
        cb(movie);
      },
      error: function (r) {
        F.modals.error(
          '<strong>Loading movie details failed ' + movie.id +
            '!</strong><br><br>Error text: ' + r.statusText);
      }
    });
  }

  // add movie
  F.movie.add = function(movie, cb) {
    var data = JSON.stringify(movie);
    $.ajax({
      url: '/movies/',
      data: data,
      dataType: 'json',
      type: 'POST',
      processData: false,
      contentType: 'application/json',
      success: function(movie) {
        F.movie.current = movie;
        cb(movie);
      },
      error: function (r) {
        F.modals.error(
          '<strong>Could not add new movie' +
            '!</strong><br><br>Error text: ' + r.statusText);
      }
    });
  }

  // delete movie
  F.movie.delete = function(movie, cb) {
    $.ajax({
      url: '/movies/' + movie.id,
      type: 'DELETE'
    }).done(function() {
      cb(movie);
    }).fail(function (r) {
      F.modals.error(
        '<strong>Could not delete movie with id ' + movie.id +
          '!</strong><br><br>Error text: ' + r.statusText);
    });
  }

  // (un)favourite
  F.movie.fav = function(id, unfav, cb) {
    var data = { id: id };
    if (unfav)
      data.unfav = true;
    $.post('/fav/', data, cb).error(function(r) {
      F.modals.error(
        '<strong>Could not set favourite flag for movie!</strong><br><br>'
          + 'Error text: ' + r.statusText);
    });
  };

  // mark (un)seen
  F.movie.markSeen = function(id, unmark, cb) {
    var data = { id: id };
    if (unmark)
      data.unmark = true;
    $.post('/mark-seen/', data, cb).error(function(r) {
      F.modals.error(
        '<strong>Could not set seen flag for movie!</strong><br><br>'
          + 'Error text: ' + r.statusText);
    });
  };

})();
