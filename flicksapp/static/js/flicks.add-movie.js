(function() {

  //////////////////////////////////////////////////////////////////////////////
  //
  // Add movie process
  //

  var F = $.flicks;
  F.addMovie = {};

  // focus and select new movie after creation
  function focusNewMovie() {
    F.store.clear();
    F.store.setSort('id', false);
    var i = 0;
    while (i < F.grid.getDataLength())
      F.grid.invalidateRow(i++);
    F.gridChange();
    F.grid.setActiveCell(0, 0);
  };

  F.addMovie.init = function() {
    F.el['dialog-add-movie'].dialog({
      autoOpen: false,
      modal: true,
      minWidth: 600,
      minHeight: 640,
      buttons: {
        Create: function() {
          var $dialog = F.el['dialog-add-movie'],
            imdb_id = $dialog.find('#add_movie_imdb_id').val();
          if (imdb_id.length > 0) {
            // Add via IMDb ID
            var movie = {
              imdb_id: imdb_id,
              genres: [],
              countries: [],
              languages: [],
              directors: [],
            };
            F.movie.add(movie, function() {
              focusNewMovie();
              F.el['dialog-add-movie'].dialog('close');
            });
          }
        },
        Cancel: function() {
          $(this).dialog('close');
        }
      }
    });
  };

  // do title search
  F.addMovie.doTitleSearch = function() {
    var $dialog = F.el['dialog-add-movie'],
      title = $dialog.find('#add_movie_title').val();
    if (title.length > 0) {
      $dialog.find('.results').slideUp();
      F.addMovie.enableSpinner();
      F.movie.imdbSearch(title, function(data) {
        F.addMovie.disableSpinner();
        var template = _.template(
          $("#title-search-results-template").html(), data);
        $dialog.find('.results').html(template).slideDown();
      });
    }
  };

  // title search spinner
  F.addMovie.enableSpinner = function() {
    $('#dialog-add-movie .spinner').slideDown();
  };
  F.addMovie.disableSpinner = function() {
    $('#dialog-add-movie .spinner').slideUp();
  };

})();
