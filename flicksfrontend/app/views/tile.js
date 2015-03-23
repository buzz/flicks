define([
  'marionette'
], function(
  Marionette
) {

  var TileView = Marionette.ItemView.extend({

    template: 'tile',
    className: 'tile',

    ui: {
      image: 'img'
    },

    events: {
      'click @ui.image': 'tileClick',
      'dblclick @ui.image': 'tileDblClick'
    },

    modelEvents: {
      'change:_selected': 'changeSelected',
      'change-image': 'changeImage'
    },

    behaviors: {
      BrokenImageReplace: {}
    },

    onRender: function() {
      this.changeSelected();
    },

    serializeData: function() {
      var data = Marionette.ItemView.prototype.serializeData.apply(
        this, arguments);
      data.image_url = this.model.getImageUrl();
      return data;
    },

    tileClick: function() {
      App.router.navigate('movie/%d'.format(this.model.id), { trigger: true });
    },

    tileDblClick: function() {
      App.vent.trigger('display:cover', this.model);
    },

    changeSelected: function() {
      var func = this.model.get('_selected') ? 'addClass' : 'removeClass';
      this.$el[func]('selected');
    },

    changeImage: function(movie) {
      this.ui.image.attr('src', movie.getImageUrl());
    }

  });

  return TileView;

});
