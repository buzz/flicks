define([
  'views/modal'
], function(
  ModalView
) {

  var AddMovieView = ModalView.extend({

    template:  'modal-add-movie',

    ui: {
      modal: '.modal',
      form:  '.form-add-movie-search'
    },

    events: {
      'submit @ui.form': 'searchFormSubmit'
    },

    searchFormSubmit: function(evt) {
      evt.preventDefault();
      console.info('add movie: search submit');
    }

  });

  return AddMovieView;

});
