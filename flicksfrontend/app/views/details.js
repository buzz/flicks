define([
  'marionette'
], function(
  Marionette
) {

  var DetailsView = Marionette.ItemView.extend({

    template: 'details',
    id:       'details',

    events: {
      'click .dismiss button': 'dismiss',
      'click .cover-image':    'enlargeCover'
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
    }

  });

  return DetailsView;

});
