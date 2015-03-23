define([
  'views/modal'
], function(
  ModalView
) {

  var PreferencesView = ModalView.extend({

    template:  'modal-preferences'

  });

  return PreferencesView;

});
