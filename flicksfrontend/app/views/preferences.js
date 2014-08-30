define([
  'views/modal'
], function(
  ModalView
) {

  var PreferencesView = ModalView.extend({

    template:  'modal-preferences',

    events: {
      'click @ui.btn_search': 'searchClick'
    },

    searchClick: function() {
      console.log('search click');
    }

  });

  return PreferencesView;

});
