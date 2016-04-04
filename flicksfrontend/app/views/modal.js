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
      'click @ui.btn_confirm': 'confirm'
    },

    initialize: function(opts) {
      var that = this;
      if ('confirm' in opts) {
        this.confirm = opts.confirm;
      }
      else {
        this.confirm = function() {};
      }
      this.on('render', function() {
        this.ui.modal.modal().on('hidden.bs.modal', function() {
          that.destroy();
        });
      });
    }

  });

  return ModalView;

});
