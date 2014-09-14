define([
  'marionette',
  'views/token-filter',
  'views/range-filter'
], function(
  Marionette,
  TokenFilterView,
  RangeFilterView
) {

  var FiltersView = Marionette.CompositeView.extend({

    template: 'filters',
    childViewContainer: '.panel-group',

    getChildView: function(filter) {
      if (filter.get('type') === 'token')
        return TokenFilterView;
      else if (filter.get('type') === 'range')
        return RangeFilterView;
      else
        throw('Invalid filter type: %s'.format(def.type));
    },

    ui: {
      total_filters_count: '.total-filters-count'
    },

    behaviors: {
      ToolTips: { placement: 'right' }
    },

    events: {
      'click @ui.total_filters_count': 'resetClick'
    },

    modelEvents: {
      'change:filters_count': 'changeFiltersCount'
    },

    collectionEvents: {
      'change:filters_count': 'changeTotalFiltersCount'
    },

    onRender: function() {
      this.changeFiltersCount(this.model, this.model.get('filters_count'));
    },

    changeTotalFiltersCount: function(model) {
      var sum = this.collection.reduce(function(memo, filter) {
        return memo + (filter.get('filters_count') || 0);
      }, 0);
      this.model.set('filters_count', sum);
    },

    changeFiltersCount: function(model, count) {
      if (count > 0) {
        this.$el.addClass('filtered');
        this.ui.total_filters_count.html(count).fadeIn();
      }
      else {
        this.$el.removeClass('filtered');
        this.ui.total_filters_count.fadeOut();
      }
    },

    getSearchArgs: function() {
      var search_args = {};
      this.children.each(function(view) {
        _.extend(search_args, view.getSearchArgs());
      });
      return search_args;
    },

    // UI handler

    resetClick: function(evt) {
      evt.preventDefault();
      this.children.invoke('reset');
    }

  });

  return FiltersView;

});
