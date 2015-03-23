define([
  'views/modal'
], function(
  ModalView
) {

  var EditMovieView = ModalView.extend({

    template:  'modal-edit-movie',

    ui: {
      modal:      '.modal',
      alert_info: '.alert-info',
      btn_save  : '.btn-save-movie',
      input:      '#input-imdb-number'
    },

    events: {
      'click @ui.btn_save': 'clickSave'
    },

    initialize: function() {
      var that = this;
      this.on('render', function() {
        that.ui.modal.modal().on('shown.bs.modal', function() {
          that.ui.input.focus();
        });
      });
    },

    clickSave: function() {
      this.model.save('imdb_id', this.ui.input.val(), {
        patch: true,
        success: function() {
          console.log('SUCCESS!');
        },
        error: function(resp) {
          if (resp.hasOwnProperty('error_message'))
            that.ui.alert_info.text(resp.error);
          else
            that.ui.alert_info.text('Error…');
          that.ui.alert_info.show();
        }
      });
      this.ui.modal.modal('hide');
    }

  });

  return EditMovieView;

});
