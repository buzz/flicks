define([
  'marionette'
], function(
  Marionette
) {

  var TokenView = Marionette.ItemView.extend({

    template: 'token',
    tagName: 'a',
    className: 'token badge',
    attributes: { href: '#' },

    events: {
      'click': 'onClick'
    },

    modelEvents: {
      change: '_setSelected'
    },

    onRender: function() {
      this._setSelected();
    },

    _setSelected: function() {
      if (this.model.get('_selected'))
        this.$el.addClass('selected')
      else
        this.$el.removeClass('selected')
    },

    onClick: function(evt) {
      evt.preventDefault();
      var s = this.model.get('_selected');
      this.model.set('_selected', !s);
    }

  });

  return TokenView;

});
