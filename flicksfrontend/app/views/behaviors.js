define([
  'marionette',
  'bootstrap-switch',
  'bootstrap-slider'
], function(
  Marionette,
  _bootstrap_switch,
  _bootstrap_slider
) {

  var tooltipDefaults = {
    placement: 'top',
    container: 'body'
  };

  window.Behaviors = {};

  window.Behaviors.ToolTips = Marionette.Behavior.extend({

    ui: {
      tooltip: '.enable-tooltip'
    },

    defaults: tooltipDefaults,

    onRender: function() {
      this.ui.tooltip.tooltip({
        container: this.options.container,
        placement: this.options.placement
      });
    },

    onBeforeDestroy: function() {
      this.ui.tooltip.tooltip('destroy');
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
      _.each(this.options, function(v, selector) {
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
    },

    onBeforeDestroy: function() {
      var that = this;
      _.each(this.options, function(v, selector) {
        that.$(selector).popover('destroy');
      });
    }

  });


  window.Behaviors.Collapsable = Marionette.Behavior.extend({

    ui: {
      collapse_icon: '.panel-heading i'
    },

    onRender: function() {
      this.$el.addClass('panel panel-default');
      var ui = this.ui;
      this.$el.on('show.bs.collapse', function () {
        ui.collapse_icon.addClass('fa-rotate-90');
      });
      this.$el.on('hide.bs.collapse', function () {
        ui.collapse_icon.removeClass('fa-rotate-90');
      });
    }

  });


  window.Behaviors.Switches = Marionette.Behavior.extend({

    onRender: function() {
      this.$el.on('click', '.bootstrap-switch-container *', function(evt) {
        evt.stopPropagation();
      });
      var that = this;
      _.each(this.options, function(v, k) {
        var options = _.clone(v);

        // wrap onSwitchChange/onInit callbacks
        var orig = {};
        _.each(['onSwitchChange', 'onInit'], function(name) {
          orig[name] = options[name];
          options[name] = function() {
            // anonymous callback
            if (_.isFunction(orig[name])) {
              orig[name].apply(that.view, arguments);
            }
            // callback on view
            else if (_.isString(orig[name])) {
              that.view[orig[name]].apply(that.view, arguments);
            }
          };
        });

        that.$(k)
          .on('init.bootstrapSwitch', function(event, state) {
            if (options.tooltipOptions) {
              var $el = $(this).parent().parent();
              var tooltipOptions = _.clone(tooltipDefaults);
              _.extend(tooltipOptions, options.tooltipOptions);
              $el.tooltip(tooltipOptions);
            }
          })
          .bootstrapSwitch(options);
      });
    },

    onBeforeDestroy: function() {
      var that = this;
      _.each(this.options, function(v, k) {
        that.$(k).bootstrapSwitch('destroy');
      });
    }

  });


  window.Behaviors.Sliders = Marionette.Behavior.extend({

    ui: {
      form_value_low:  '.slider-value-low form',
      input_value_low:  '.slider-value-low input',
      form_value_high:  '.slider-value-high form',
      input_value_high: '.slider-value-high input'
    },

    events: {
      'submit @ui.form_value_low':  'lowInputChange',
      'blur @ui.input_value_low':  'lowInputChange',
      'submit @ui.form_value_high': 'highInputChange',
      'blur @ui.input_value_high': 'highInputChange'
    },

    onRender: function() {
      var that = this;
      var default_options = {
        tooltip: 'hide'
      };
      _.each(that.options, function(v, k) {
        _.extend(v, default_options);
        var slider = that.$(k).slider(v);
        slider.slider('on', 'slide', function() {
          that._updateInputs.call(that, slider);
        });
        slider.slider('on', 'slideStop', function() {
          that._updateInputs.call(that, that.$(k));
          that.view.trigger('slider-change', slider.slider('getValue'), slider);
        });
        that._updateInputs.call(that, that.$(k));
      });
    },

    onBeforeDestroy: function() {
      var that = this;
      _.each(this.options, function(v, k) {
        that.$(k).slider('destroy');
      });
    },

    _updateInputs: function(slider) {
      var values = slider.slider('getValue');
      this.ui.input_value_low.val(values[0]);
      this.ui.input_value_high.val(values[1]);
    },

    lowInputChange: function(evt) {
      evt.preventDefault();
      var value = parseFloat(this.ui.input_value_low.val());
      this._inputChange(evt.target, value, true);
    },

    highInputChange: function(evt) {
      evt.preventDefault();
      var value = parseFloat(this.ui.input_value_high.val());
      this._inputChange(evt.target, value, false);
    },

    _inputChange: function(target, value, low) {
      var $el = $(target).parents('.range-slider').find('input.slider');
      if (!_.isNaN(value)) {
        var limits = $el.slider('getValue');
        limits[low ? 0 : 1] = value;
        $el.slider('setValue', limits);
        this._updateInputs($el);
        this.view.trigger('slider-change', limits, $el);
      }
    }

  });

});
