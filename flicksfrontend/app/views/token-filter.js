define([
  'views/tokens'
], function(
  TokensView
) {

  var TokenFilterView = TokensView.extend({

    template: 'token-filter',

    ui: {
      filters_count: '.filters-count',
      switch: 'input[name=filter-any]',
      search_form: 'form[role=search]',
      search_input: 'form[role=search] input[type=text]',
      btn_clear_search: 'form[role=search] .btn-clear-search'
    },

    behaviors: {
      ToolTips: { placement: 'right' },

      Collapsable: {},

      Switches: {
        'input[name=filter-any]': {
          onSwitchChange: 'switchChange',
          tooltipOptions: {
            placement: 'right',
            title: 'Match all / Match any',
          }
        }
      }
    },

    modelEvents: {
      'change:filters_count': 'changeFiltersCount'
    },

    collectionEvents: {
      add: 'countSelected',
      remove: 'countSelected',
      'change:_selected': function(token, selected) {
        var token_id = token.get('id'), key = this.model.get('key'), action;
        if (selected)
          action = 'action:add-token-filter';
        else
          action = 'action:remove-token-filter';
        App.vent.trigger(action, key, token_id);
        this.countSelected();
      }
    },

    events: {
      'click @ui.filters_count': 'clickFilterReset',
      'submit @ui.search_form': 'searchFormSubmit',
      'input @ui.search_input': 'searchInputChange',
      'click @ui.btn_clear_search': 'clickButtonClearSearch'
    },

    initialize: function() {
      TokensView.prototype.initialize.call(this);
      this.search = _.throttle(this._search, 500, { leading: false });
    },

    onRender: function() {
      this.changeFiltersCount(this.model, this.model.get('filters_count'));
    },

    countSelected: function() {
      var count = this.collection.where({ _selected: true }).length;
      this.model.set('filters_count', count);
    },

    changeFiltersCount: function(model, count) {
      if (count > 0) {
        this.$el.addClass('filtered');
        this.ui.filters_count.html(count).fadeIn();
      }
      else {
        this.$el.removeClass('filtered');
        this.ui.filters_count.fadeOut();
      }
    },

    reset: function() {
      _.invoke(this.collection.where({ _selected: true }),
               'set', { _selected: false });
    },

    getSearchArgs: function() {
      // we get the data from the app state not the model state. this
      // is because on load time the filter models are not fetched
      var key = this.model.get('key'), search_args = {};
      var filter = App.state.get('filters')[key], ids = filter.ids;
      if (ids.length > 0) {
        search_args['%s__id'.format(key)] = ids;
        search_args['%s__any'.format(key)] = filter.any ? 1 : 0;
      }
      return search_args;
    },

    _search: function(v) {
      this.model.set('search', v);
      this.collection.fetch({ data: { name__icontains: v } });
    },

    // UI callbacks

    switchChange: function(evt, any) {
      this.model.set('any', any);
      App.vent.trigger(
        'action:set-token-filter-any', this.model.get('key'), any);
    },

    clickFilterReset: function(evt) {
      evt.stopPropagation();
      this.reset();
    },

    searchFormSubmit: function(evt) {
      evt.preventDefault();
      var v = this.ui.search_input.val();
      this.search(v);
    },

    searchInputChange: function() {
      var v = this.ui.search_input.val();
      if (v.length > 0)
        this.ui.btn_clear_search.removeClass('disabled');
      else
        this.ui.btn_clear_search.addClass('disabled');
      this.search(v);
    },

    clickButtonClearSearch: function() {
      this.ui.search_input.val('');
      this.ui.btn_clear_search.addClass('disabled');
      this.search('');
    }

  });

  return TokenFilterView;

});
