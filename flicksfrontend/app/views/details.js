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

    onRender: function() {
      this.$('.enable-tooltip').tooltip(App.tooltipDefaults);
      this.$('.enable-tooltip-top').tooltip(
        _.extend(_.clone(App.tooltipDefaults), { placement: 'top' })
      );
    },

    dismiss: function() {
      this.model.set('_selected', false);
    },

    enlargeCover: function() {
      // TODO fullsize!
      return false;
    }

  });

  return DetailsView;

});
