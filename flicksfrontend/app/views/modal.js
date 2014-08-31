define([
  'marionette'
], function(
  Marionette
) {

  var ModalView = Marionette.ItemView.extend({

    template:  'modal',

    ui: {
      modal:       '.modal',
      btn_confirm: '.btn-confirm'
    },

    events: {
      'click @ui.btn_confirm': 'confirmCallback'
    },

    initialize: function() {
      var that = this;
      this.confirmCallback = this.options.confirm;
      this.on('render', function() {
        this.ui.modal.modal().on('hidden.bs.modal', function() {
          that.destroy();
        });
      });
    }

  });

  return ModalView;

});
