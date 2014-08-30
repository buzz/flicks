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
      sidebar: '#sidebar'
    },

    modelEvents: {
      'change:sidebar_enabled':   'sidebarEnabledChanged'
    },

    sidebarEnabledChanged: function(state, enabled) {
      var $el = App.layout.sidebar.$el;
      if (enabled)
        $el.removeClass('collapsed');
      else
        $el.addClass('collapsed');
      App.vent.trigger('display:content-resize');
    }

  });

  return AppLayout;

});
