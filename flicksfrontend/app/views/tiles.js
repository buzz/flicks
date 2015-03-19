define([
  'marionette',
  'views/tile'
], function(
  Marionette,
  TileView
) {

  var TilesView = Marionette.CollectionView.extend({

    id: 'tiles',

    childView: TileView,

    events: {
      'scroll': 'loadViewport'
    },

    initialize: function() {
      // tile dimensions, TODO make configurable using App.state
      this.tile_width  = 192;
      this.tile_height = Math.floor(this.tile_width * 1.3);
      this.tile_padding  = 6;

      // collection events
      this.listenTo(this.collection, {

        dataloaded: function(args) {
          this.render();
        },

        reset: function() {
          this.loadViewport();
        }

      }, this);

      this.listenTo(
        App.vent, 'display:content-resize', this.loadViewport, this);
    },

    onShow: function() {
      this.loadViewport();
    },

    loadViewport: function() {
      // calculate how many tiles will fit into viewport
      var $e = this.$el;
      var vp_width = $e.width();
      var vp_height = $e.height();
      var vp_scroll_top = $e.scrollTop();

      this.cols = Math.floor(vp_width / this.tile_width);
      var scrolled_rows = Math.floor(vp_scroll_top / this.tile_height);

      var top = scrolled_rows * this.cols;
      var bottom = Math.ceil(
        (vp_scroll_top + vp_height) / this.tile_height) * this.cols - 1;

      // ensure one extra screen of items before and after actual
      // range
      var count = bottom - top + 1;
      var from = Math.max(0, top - count)
      var to = bottom + count

      // console.log('top %d'.format(top));
      // console.log('bottom %d'.format(bottom));
      // console.log('count %d'.format(count));
      // console.log('from %d'.format(from));
      // console.log('to %d'.format(to));

      this.collection.ensureData(from, to);
    },

    keypress: function(key_code) {
      // TODO
    }

  });

  return TilesView;

});
