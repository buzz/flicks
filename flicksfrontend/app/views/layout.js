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
      'change:filters_enabled':    'filtersEnabledChanged',
      'change:details_enabled':   'detailsEnabledChanged'
    },

    events: {
      'keyup #movies': 'keyupMovies'
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
    },

    // key on movie grid/tiles region
    keyupMovies: function(evt) {
      var movies_view = this.movies.currentView;
      if (movies_view)
        movies_view.keypress(evt.which);
    }

  });

  return AppLayout;

});
