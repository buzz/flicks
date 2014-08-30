define([
  'backbone',
  'marionette',
  'util/formatter'
], function(
  Backbone,
  Marionette,
  formatter
) {

  var DetailsView = Marionette.ItemView.extend({

    template: 'details',
    id:       'details',

    ui: {
      cover_image:                        '.cover-image',
      btn_play:                           '.btn-play',
      btn_update:                         '.btn-update',
      btn_find_cover:                     '.btn-find-cover',
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
      'click @ui.cover_image':            'enlargeCover',
      'click @ui.btn_play':               'playClick',
      'click @ui.btn_update':             'updateClick',
      'click @ui.btn_find_cover':         'findCoverClick',
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

    behaviors: {

      ToolTips: {},

      PopOvers: {
        selectors: {

          // AKA titles
          '.top': {
            placement: 'right',
            title: '<strong>Also known as</strong>',
            content: function() {
              var model = App.layout.sidebar.currentView.model;
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
              var model = App.layout.sidebar.currentView.model;
              if (!model)
                return '';
              return '%d'.format(model.get('votes'));
            }
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
      // TODO
      console.info('details: TODO... update');
    },

    findCoverClick: function() {
      // TODO
      console.info('details: TODO... find-cover');
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
    }

  });

  return DetailsView;

});
