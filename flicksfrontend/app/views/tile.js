define([
  'marionette'
], function(
  Marionette
) {

  var TileView = Marionette.ItemView.extend({

    template: 'movie-tile',
    className: 'tile',

    events: {
      'click img': 'tileClick'
    },

    modelEvents: {
      'change:_selected': 'changeSelected'
    },

    initialize: function() {
      this.parent_view = App.layout.movies.currentView;
      // this.calcPos();
    },

    tileClick: function() {
      this.model.set('_selected', !this.model.get('_selected'));
    },

    changeSelected: function() {
      var func = this.model.get('_selected') ? 'addClass' : 'removeClass';
      this.$el[func]('selected');
    },

    calcPos: function() {
      // var $e = this.$el, p = this.parent_view;
      // var index = this.model.collection.indexOf(this.model);
      // var x = index % p.cols;
      // var y = Math.floor(index / p.cols);
      // this.left = p.tile_padding + x * (p.tile_width + 4 * p.tile_padding);
      // this.top = p.tile_padding + y * (p.tile_height + 4 * p.tile_padding);
      // $e.css('left', this.left);
      // $e.css('top', this.top);
    }

  });

  return TileView;

});
