define([
  'views/modal'
], function(
  ModalView
) {

  var FetchCoverView = ModalView.extend({

    template:  'modal-fetch-cover',

    ui: {
      modal:         '.modal',
      btn_save:      '.btn-save',
      spinner:       '.spinner',
      cover_wrapper: '.cover-wrapper',
      cover_img:     '.cover-wrapper img',
      alert_info:    '.alert-info',
      form_url:      'form.cover-image',
      input_url:     'input#input-cover-image-url'
    },

    events: {
      'click @ui.btn_save':  'clickSave',
      'input @ui.input_url': 'changeInput'
    },

    onRender: function() {
      var that = this;
      this.model.fetchCoverUrl(
        // success
        function(url) {
          that._url = url;
          that.ui.cover_img
            .one('load', function() {
              that.ui.spinner.hide();
              that.ui.cover_wrapper.removeClass('not-loaded');
              that.ui.btn_save.removeClass('disabled');
            })
            .attr('src', url);
        },
        // error
        function(resp) {
          that.ui.spinner.hide();
          if (resp.hasOwnProperty('error'))
            that.ui.alert_info.text(resp.error);
          else
            that.ui.alert_info.text('No cover image found!');
          that.ui.alert_info.show();
          that.ui.form_url.show();
        }
      );
    },

    clickSave:  function() {
      var that = this;
      this.ui.btn_save.addClass('disabled');
      App.vent.trigger(
        'action:save-cover', this.model, this._url,
        function() {
          that.ui.modal.modal('hide');
        },
        function(resp) {
          if (resp.hasOwnProperty('error'))
            that.ui.alert_info.text(resp.error);
          else
            that.ui.alert_info.text('Could not set cover image!');
          that.ui.alert_info.show();
          that.ui.btn_save.removeClass('disabled');
        }
      );
    },

    changeInput: function(evt) {
      var $i = this.ui.input_url, val = $i.val();
      this._url = val;
      if (val.length > 0)
        this.ui.btn_save.removeClass('disabled');
      else
        this.ui.btn_save.addClass('disabled');
    }

  });

  return FetchCoverView;

});
