define([
  'marionette'
], function(
  Marionette
) {

  var DetailsView = Marionette.ItemView.extend({

    template: 'details',
    id: 'details',

    events: {
      'click .dismiss button': 'dismiss',
      'click .cover-image': 'enlargeCover'
    },

    dismiss: function() {
      App.router.navigate('', { trigger: true });
    },

    enlargeCover: function() {
      // TODO fullsize!
      return false;
    }

  });

  return DetailsView;

});
