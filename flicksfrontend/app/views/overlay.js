define([
  'marionette'
], function(
  Marionette
) {

  var OverlayView = Marionette.ItemView.extend({

    template:  'overlay',
    className: 'overlay-wrapper',

    initialize: function() {
      this.listenTo(App.state, 'change:selected_movie_id', function(state, id) {
        if (_.isNull(id))
          this.close();
        else {
          this.model = App.movie_collection.getSelected();
          this.render();
        }
      }, this);
    },

    serializeData: function() {
      return {
        title:     this.model.get('title'),
        image_url: this.model.getImageUrl()
      }
    },

    onRender: function() {
      var that = this;
      // HACK: give UI some cycles or CSS transition won't trigger
      _.defer(function() { that.$el.css('opacity', '1.0'); });
    }

  });

  return OverlayView;

});
