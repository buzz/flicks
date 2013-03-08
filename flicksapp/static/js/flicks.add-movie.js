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
            // let new movie (with highest id) appear at top of the
            // list
            F.store.setSort('id', false);
            F.store.clear();
            var i = 0;
            while (i < F.grid.getDataLength())
              F.grid.invalidateRow(i++);
            F.gridChange();
            F.el['dialog-add-movie'].dialog('close');
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
