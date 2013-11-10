define([
  'marionette',
  'views/details',
  'views/grid',
  'views/tiles'
], function(
  Marionette,
  DetailsView,
  GridView,
  TilesView
) {

  var AppLayout = Marionette.Layout.extend({

    id: 'main-layout',
    template: 'layout',

    regions: {
      toolbar: '#toolbar',
      movies:  '#movies',
      sidebar: '#sidebar'
    },

    events: {
      'mouseenter .enable-tooltip': 'showTooltip',
      'mouseleave .enable-tooltip': 'hideTooltip'
    },

    initialize: function() {
      this.listenTo(
        App.state, 'change:selected-movie-id', function(state, id) {
          if (!id)
            this.sidebar.close();
        }, this
      );

      this.listenTo(
        App.movie_collection, 'change:_fullFetch', this.sidebarView, this);
    },

    contentView: function(view_mode) {
      var ViewClass = view_mode === 'grid' ? GridView : TilesView;
      var view = new ViewClass({ collection: App.movie_collection });
      this.movies.show(view);
    },

    sidebarView: function(movie) {
      var details = this.sidebar.currentView;
      if (!details) {
        // create view
        details = new DetailsView({ model: movie });
        this.sidebar.show(details);
        this.listenTo(details, 'close', function() {
          App.layout.sidebar.$el.addClass('collapsed');
          App.trigger('content-resize');
        });
      }
      // reuse details view
      else {
        details.model = movie;
        details.render();
      }

      // relayout
      App.layout.sidebar.$el.removeClass('collapsed');
      App.trigger('content-resize');
    },

    showTooltip: function(ev) {
      var $el = $(ev.target);
      $el.tooltip(App.tooltipDefaults).tooltip('show');
      $el.on('remove', function() { $el.tooltip('hide'); });
    },

    hideTooltip: function(ev) {
      $(ev.target).tooltip('hide');
    }

  });

  return AppLayout;

});
