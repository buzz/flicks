define([
  'marionette'
], function(
  Marionette
) {

  var ModalView = Marionette.ItemView.extend({

    template:  'modal',

    ui: {
      modal:       '.modal'
    },

    initialize: function() {
      var that = this;
      this.on('render', function() {
        this.ui.modal.modal().on('hidden.bs.modal', function() {
          that.destroy();
        });
      });
    }

  });

  return ModalView;

});
