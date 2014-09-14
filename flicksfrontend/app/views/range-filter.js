define([
  'marionette'
], function(
  Marionette
) {

  var RangeFilterView = Marionette.ItemView.extend({

    ui: {
      badge:            '.panel-heading .badge',
      slider:           'input.slider',
      input_value_low:  '.slider-value-low input',
      input_value_high: '.slider-value-high input'
    },

    template: 'range-filter',

    behaviors: {
      ToolTips: { placement: 'right' },

      Collapsable: {},

      Sliders: {
        'input.slider': {}
      }
    },

    modelEvents: {
      'change:filters_count': 'changeFiltersCount'
    },

    events: {
      'click @ui.badge': 'clickFilterReset'
    },

    onRender: function() {
      this.listenTo(this, 'slider-change', this.sliderChange, this);
      this.sliderChange([this.model.get('low'), this.model.get('high')]);
    },

    sliderChange: function(limits, slider) {
        // disable filter?
        if (limits[0] === this.model.get('min') &&
            limits[1] === this.model.get('max')) {
          App.vent.trigger('action:remove-range-filter', this.model.get('key'));
          this.model.set('filters_count', 0);
        }
        else {
          App.vent.trigger(
            'action:add-range-filter', this.model.get('key'), limits);
          this.model.set('filters_count', 1);
          this.model.set('low', limits[0]);
          this.model.set('high', limits[1]);
          this.updateBadgeText();
        }
      },

    reset: function() {
      this.ui.slider.slider(
        'setValue', [this.model.get('min'), this.model.get('max')]);
      this.ui.input_value_low.val(this.model.get('min'));
      this.ui.input_value_high.val(this.model.get('max'));
      App.vent.trigger('action:remove-range-filter', this.model.get('key'));
      this.model.set('filters_count', 0);
    },

    getSearchArgs: function() {
      var key = this.model.get('key'), search_args = {},
        filter = App.state.get('filters')[key];
      if ('low' in filter && 'high' in filter)
        search_args['%s__range'.format(key)] =
          '%f,%f'.format(filter.low, filter.high);
      return search_args;
    },

    changeFiltersCount: function(model, count) {
      if (count > 0) {
        this.$el.addClass('filtered');
        this.updateBadgeText();
        this.ui.badge.fadeIn();
      }
      else {
        this.$el.removeClass('filtered');
        this.ui.badge.fadeOut();
      }
    },

    updateBadgeText: function() {
      var badge_text = '%s - %s'.format(
        this.model.get('low'), this.model.get('high'));
      this.ui.badge.html(badge_text);
    },

    // UI callbacks

    clickFilterReset: function(evt) {
      evt.stopPropagation();
      this.reset();
    }

  });

  return RangeFilterView;

});
