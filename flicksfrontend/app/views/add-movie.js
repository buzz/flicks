define([
  'views/modal'
], function(
  ModalView
) {

  var AddMovieView = ModalView.extend({

    template:  'modal-add-movie',

    events: {
      'click @ui.btn_search': 'searchClick'
    },

    searchClick: function() {
      console.log('search click');
    }

  });

  return AddMovieView;

});
