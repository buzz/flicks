define([
  'marionette',
  'util/formatter'
], function(
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
      var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(
        this, arguments);
      data.image_url = this.model.getImageUrl();
      return data;
    },

    // UI handler

    enlargeCover: function(e) {
      e.preventDefault();
      App.layout.showOverlay(this.model);
    },

    playClick: function() {
      // TODO
      console.log('TODO... play');
    },

    updateClick: function() {
      // TODO
      console.log('TODO... update');
    },

    findCoverClick: function() {
      // TODO
      console.log('TODO... find-cover');
    },

    markSeenClick: function() {
      // TODO
      console.log('TODO... mark-seen');
    },

    markFavClick: function() {
      // TODO
      console.log('TODO... mark-fav');
    },

    editClick: function() {
      // TODO
      console.log('TODO... edit');
    },

    deleteClick: function() {
      // TODO
      console.log('TODO... delete');
    },

    openKaragarga: function() {
      window.open(this.model.externalUrl('karagarga'), '_blank');
    },

    openImdb: function() {
      window.open(this.model.externalUrl('imdb'), '_blank');
    },

    openOpensubtitles: function() {
      window.open(this.model.externalUrl('opensubtitles'), '_blank');
    },

    openYoutube: function() {
      window.open(this.model.externalUrl('youtube'), '_blank');
    }

    // onSelected: function(movie, selected) {
    //   // disable/enable movie actions
    //   if (selected) {
    //     var view = this;
    //     this.$('.movie-action').removeClass('disabled');
    //     _.each(['favourite', 'seen'], function(attr) {
    //       var value = movie.get(attr);
    //       var func = value ? 'addClass' : 'removeClass';
    //       view.$('.btn.%s'.format(attr))[func]('active');
    //     });
    //   }
    //   else {
    //     this.$('.movie-action').addClass('disabled');
    //     var view = this;
    //     _.each(['favourite', 'seen'], function(attr) {
    //       view.$('.btn.%s'.format(attr)).removeClass('active');
    //     });
    //   }
    // },

  });

  return DetailsView;

});
