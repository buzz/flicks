(function() {

  //////////////////////////////////////////////////////////////////////////////
  //
  // Add movie process
  //

  var F = $.flicks;
  F.addMovie = {};

  F.addMovie.init = function() {
    F.el['dialog-add-movie'].dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Create: function() {
          var imdb_id = F.el['dialog-add-movie']
            .find('#add_movie_imdb_id').val();
          var movie = {
            imdb_id: imdb_id,
            genres: [],
            countries: [],
            languages: [],
            directors: [],
          };
          F.movie.add(movie, function() {
            F.el['dialog-add-movie'].dialog('close');
            F.store.clear();
            F.grid.invalidate();
            F.gridChange();
          });
        },
        Cancel: function() {
          $(this).dialog('close');
        }
      },
      close: function() {
      }
    });
  };

})();
