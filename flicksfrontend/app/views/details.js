define([
  'marionette',
  'util/formatter'
], function(
  Marionette,
  formatter
) {

  var DetailsView = Marionette.ItemView.extend({

    template: 'details',

    ui: {
      cover_image_wrapper:                '.cover-image',
      cover_image:                        '.cover-image img',
      btn_play:                           '.btn-play',
      btn_update:                         '.btn-update',
      btn_update_i:                       '.btn-update i',
      btn_fetch_cover:                    '.btn-fetch-cover',
      btn_fetch_cover_i:                  '.btn-fetch-cover i',
      btn_mark_seen:                      '.btn-mark-seen',
      btn_mark_fav:                       '.btn-mark-fav',
      btn_mark_trumpable:                 '.btn-mark-trumpable',
      btn_edit:                           '.btn-edit',
      btn_delete:                         '.btn-delete',
      btn_open_imdb:                      '.btn-open-imdb',
      btn_open_karagarga:                 '.btn-open-karagarga',
      btn_open_opensubtitles:             '.btn-open-opensubtitles',
      btn_open_youtube:                   '.btn-open-youtube'
    },

    events: {
      'click @ui.cover_image_wrapper':    'enlargeCover',
      'click @ui.btn_play':               'playClick',
      'click @ui.btn_update':             'updateClick',
      'click @ui.btn_fetch_cover':        'fetchCoverClick',
      'click @ui.btn_mark_seen':          'markSeenClick',
      'click @ui.btn_mark_fav':           'markFavClick',
      'click @ui.btn_mark_trumpable':     'markTrumpableClick',
      'click @ui.btn_edit':               'editClick',
      'click @ui.btn_delete':             'deleteClick',
      'click @ui.btn_open_imdb':          'openImdb',
      'click @ui.btn_open_karagarga':     'openKaragarga',
      'click @ui.btn_open_opensubtitles': 'openOpensubtitles',
      'click @ui.btn_open_youtube':       'openYoutube'
    },

    modelEvents: {
      'change': 'render',
      'change-image': 'changeImage'
    },

    behaviors: {

      ToolTips: {},

      PopOvers: {
        // AKA titles
        '.top': {
          placement: 'left',
          title: '<strong>Also known as</strong>',
          content: function() {
            var model = App.layout.details.currentView.model;
            if (!model)
              return '';
            var lis = _.map(model.get('akas'), function(aka) {
              return '<li>%s</li>'.format(formatter.aka(aka));
            }).join('');
            return '<ul class="akas">%s</ul>'.format(lis)
          }
        },
        // number of votes
        '.row.rating .value': {
          placement: 'top',
          title: '<strong># votes</strong>',
          content: function() {
            var model = App.layout.details.currentView.model;
            if (!model)
              return '';
            return '%d'.format(model.get('votes'));
          }
        }
      }
    },

    serializeData: function() {
      var data = Marionette.ItemView.prototype.serializeData.apply(
        this, arguments);
      data.image_url = this.model.getImageUrl();
      return data;
    },

    // UI handler

    enlargeCover: function(e) {
      e.preventDefault();
      App.vent.trigger('display:cover', this.model);
    },

    playClick: function() {
      // TODO
      console.info('details: TODO... play');
    },

    updateClick: function() {
      var ui = this.ui;
      ui.btn_update.addClass('disabled')
      ui.btn_update_i.addClass('fa-spin');
      App.vent.trigger('action:update', this.model, function() {
        ui.btn_update.removeClass('disabled')
        ui.btn_update_i.removeClass('fa-spin');
      });
    },

    fetchCoverClick: function() {
      var ui = this.ui, that = this;
      ui.btn_fetch_cover.addClass('disabled');
      ui.btn_fetch_cover_i.addClass('fa-spin')
        .addClass('fa-refresh')
        .removeClass('fa-file-image-o');
      this.model.once('change-image', function() {
        ui.btn_fetch_cover.removeClass('disabled');
        ui.btn_fetch_cover_i.removeClass('fa-spin')
          .removeClass('fa-refresh')
          .addClass('fa-file-image-o');
      });
      App.vent.trigger('action:fetch-cover', this.model);
    },

    markSeenClick: function() {
      App.vent.trigger('action:set-flag',
                       this.model, 'seen', !this.model.get('seen'));
    },

    markFavClick: function() {
      App.vent.trigger('action:set-flag',
                       this.model, 'favourite', !this.model.get('favourite'));
    },

    markTrumpableClick: function() {
      App.vent.trigger('action:set-flag',
                       this.model, 'trumpable', !this.model.get('trumpable'));
    },

    editClick: function() {
      // TODO
      console.info('details: TODO... edit');
    },

    deleteClick: function() {
      App.vent.trigger('display:confirm-delete', this.model);
    },

    openKaragarga: function() {
      var url = this.model.externalUrl('karagarga');
      App.vent.trigger('action:open-external-url', url);
    },

    openImdb: function() {
      var url = this.model.externalUrl('imdb');
      App.vent.trigger('action:open-external-url', url);
    },

    openOpensubtitles: function() {
      var url = this.model.externalUrl('opensubtitles');
      App.vent.trigger('action:open-external-url', url);
    },

    openYoutube: function() {
      var url = this.model.externalUrl('youtube');
      App.vent.trigger('action:open-external-url', url);
    },

    changeImage: function(movie) {
      this.ui.cover_image.attr('src', movie.getImageUrl());
    }

  });

  return DetailsView;

});
