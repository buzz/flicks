define([
  'marionette'
], function(
  Marionette
) {

  var DetailsView = Marionette.ItemView.extend({

    template: 'details',
    id:       'details',

    events: {
      'click .dismiss button':            'dismiss',
      'click .cover-image':               'enlargeCover',

      'click .action-open-imdb':          'openImdb',
      'click .action-open-karagarga':     'openKaragarga',
      'click .action-open-opensubtitles': 'openOpensubtitles',
      'click .action-open-youtube':       'openYoutube'
    },

    dismiss: function() {
      App.router.navigate('', { trigger: true });
    },

    serializeData: function() {
      var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(
        this, arguments);
      data.image_url = this.model.getImageUrl();
      return data;
    },

    enlargeCover: function(e) {
      e.preventDefault();
      App.layout.showOverlay(this.model);
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

  });

  return DetailsView;

});
