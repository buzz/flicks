define([
  'marionette'
], function(
  Marionette
) {

  var AppLayout = Marionette.LayoutView.extend({

    id:        'layout',
    template:  'layout',

    regions: {
      modal:   '#modal',
      toolbar: '#toolbar',
      movies:  '#movies',
      filters: '#filters',
      details: '#details'
    },

    modelEvents: {
      'change:details_enabled':   'detailsEnabledChanged'
    },

    filtersEnabledChanged: function(state, enabled) {
      var $el = App.layout.filters.$el;
      if (enabled)
        $el.removeClass('collapsed');
      else
        $el.addClass('collapsed');
      App.vent.trigger('display:content-resize');
    },

    detailsEnabledChanged: function(state, enabled) {
      var $el = App.layout.details.$el;
      if (enabled)
        $el.removeClass('collapsed');
      else
        $el.addClass('collapsed');
      App.vent.trigger('display:content-resize');
    }


  });

  return AppLayout;

});
