define([
  'marionette'
], function(
  Marionette
) {

  var ToolbarView = Marionette.ItemView.extend({

    template: 'toolbar',
    className: 'navbar navbar-default navbar-static-top',

    events: {
      'change #radio-grid-tiles input': 'radioViewClick',

      'click #open-imdb':               'openImdb',
      'click #open-karagarga':          'openKaragarga',
      'click #open-opensubtitles':      'openOpensubtitles'
    },

    initialize: function() {
      this.listenTo(
        App.movie_collection, 'deselected', this.onDeselected, this);
      this.listenTo(
        App.movie_collection, 'change:_selected', this.onSelected, this);
    },

    onSelected: function(movie, selected) {
      if (selected) {
        var view = this;
        this.$('.movie-action').removeClass('disabled');
        _.each(['favourite', 'seen'], function(attr) {
          var value = movie.get(attr);
          var func = value ? 'addClass' : 'removeClass';
          view.$('.btn.%s'.format(attr))[func]('active');
        });
      }
    },

    onDeselected: function() {
      this.$('.movie-action').addClass('disabled');
      var view = this;
      _.each(['favourite', 'seen'], function(attr) {
        view.$('.btn.%s'.format(attr)).removeClass('active');
      });
    },

    radioViewClick: function(ev) {
      var $el = $(ev.currentTarget);
      var $label = $el.parent();
      if ($label.hasClass('active'))
          return;
      var $btn_group = $label.parent();
      $btn_group.children('label').removeClass('active');
      $label.addClass('active');
      App.state.set('view-mode', $el.val());
    },

    openKaragarga: function() {
      var title = App.state.getSelectedMovie().get('title');
      window.open(App.links.karagarga.format(title), '_blank');
      return false;
    },

    openImdb: function() {
      this.searchImdbIdOrTitle(App.links.imdb_id, App.links.imdb_title);
      return false;
    },

    openOpensubtitles: function() {
      this.searchImdbIdOrTitle(App.links.os_imdbid, App.links.os_title);
      return false;
    },

    searchImdbIdOrTitle: function(url_imdbid, url_title) {
      var movie = App.state.getSelectedMovie();
      var imdb_id = movie.get('imdb_id'), url;
      if (imdb_id)
        url = url_imdbid.format(imdb_id);
      else
        url = url_title.format(movie.get('title').replace(' ', '+'));
      window.open(url, '_blank');
    }

  });

  return ToolbarView;

});
