define([
  'marionette'
], function(
  Marionette
) {

  window.Behaviors = {};

  window.Behaviors.ToolTips = Marionette.Behavior.extend({
    ui: {
      tooltip: '.enable-tooltip'
    },

    defaults: {
      placement: 'top',
      container: 'body'
    },

    onRender: function() {
      this.ui.tooltip.tooltip({
        container: this.options.container,
        placement: this.options.placement
      });
    }
  });

  window.Behaviors.PopOvers = Marionette.Behavior.extend({
    defaults: {
      placement: 'right',
      container: 'body',
      html:      true,
      trigger:   'hover focus'
    },

    onRender: function() {
      var that = this;
      _.each(this.options.selectors, function(v, selector) {
        var placement = v.placement || that.options.placement;
        that.$(selector).popover({
          container: that.options.container,
          placement: placement,
          title:     v.title,
          content:   v.content,
          html:      true,
          trigger:   that.options.trigger
        });
      });
    }
  });

});
