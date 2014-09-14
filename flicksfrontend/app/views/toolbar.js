define([
  'marionette'
], function(
  Marionette
) {

  var ToolbarView = Marionette.ItemView.extend({

    template:  'toolbar',
    className: 'navbar navbar-default navbar-static-top',

    ui: {
      display_mode:                    '.radio-display-mode',
      display_mode_input:              '.radio-display-mode input',
      btn_toggle_filters:              '.btn-toggle-filters',
      btn_toggle_details:              '.btn-toggle-details',
      btn_add_movie:                   '.btn-add-movie',
      btn_prefs:                       '.btn-prefs',
      status_text:                     '.status-text',
      spinner:                         '.spinner',
      search_form:                     'form[role=search]',
      search_input:                    'form[role=search] input',
      btn_clear_search:                'form[role=search] .btn-clear-search',
      btn_submit_search:               'form[role=search] button[type=submit]'
    },

    events: {
      'change @ui.display_mode_input': 'displayModeClick',
      'click  @ui.btn_toggle_filters': 'toggleFiltersClick',
      'click  @ui.btn_toggle_details': 'toggleDetailsClick',

      'click  @ui.btn_add_movie':      'addMovieClick',
      'click  @ui.btn_prefs':          'prefsClick',

      'submit @ui.search_form':        'search',
      'click  @ui.btn_clear_search':   'clearSearch',
      'input  @ui.search_input':       'updateSearchButtons'
    },

    modelEvents: {
      'change:search':                 'searchChanged',
      'change:results_count':          'resultsCountChanged',
      'change:filters_count':          'filtersCountChanged',
      'change:details_enabled':        'detailsEnabledChanged',
      'change:filters_enabled':        'filtersEnabledChanged'
    },

    behaviors: {
      ToolTips: {
        placement: 'bottom'
      }
    },

    initialize: function() {
      this.listenTo(
        App.movie_collection, 'change:_selected', this.onSelected, this);

      this.listenTo(App.movie_collection, {
        'dataloading':       this.updateSpinner,
        'dataloaded':        this.updateSpinner
      }, this);
    },

    onRender: function() {
      this.resultsCountChanged(this.model, this.model.get('results_count'));
      this.filtersCountChanged(this.model, this.model.get('filters_count'));
      this.detailsEnabledChanged(
        this.model, this.model.get('details_enabled'));
      this.filtersEnabledChanged(
        this.model, this.model.get('filters_enabled'));
      this.updateSearchButtons();
    },

    // model/collection events

    updateSpinner: function(args) {
      if (args.request_count < 1)
        this.ui.spinner.fadeOut('fast');
      else
        this.ui.spinner.fadeIn('fast');
    },

    searchChanged: function(state, search) {
      var $i = this.ui.search_input;
      if (typeof(search) === 'string') {
        if ($i.val() !== search) {
          $i.val(search);
          this.updateSearchButtons();
        }
      }
      else
        $i.val('');
    },

    filtersEnabledChanged: function(state, enabled) {
      if (enabled)
        this.ui.btn_toggle_filters.addClass('active')
      else
        this.ui.btn_toggle_filters.removeClass('active')
    },

    detailsEnabledChanged: function(state, enabled) {
      if (enabled)
        this.ui.btn_toggle_details.addClass('active')
      else
        this.ui.btn_toggle_details.removeClass('active')
    },

    resultsCountChanged: function(state, count) {
      var word = 'movie%s'.format(count == 1 ? '' : 's');
      this.ui.status_text.html(
        '<strong>%d</strong> %s found'.format(count, word));
    },

    filtersCountChanged: function(state, count) {
      if (count > 0) {
        this.ui.btn_toggle_filters
          .addClass('btn-primary')
          .removeClass('btn-default');
      }
      else {
        this.ui.btn_toggle_filters
          .addClass('btn-default')
          .removeClass('btn-primary');
      }
    },

    // UI handlers

    toggleFiltersClick: function(ev) {
      App.vent.trigger('display:toggle-filters');
    },

    toggleDetailsClick: function(ev) {
      App.vent.trigger('display:toggle-details');
    },

    displayModeClick: function(ev) {
      var mode = $(ev.currentTarget).val();
      App.vent.trigger('display:%s-mode'.format(mode));
    },

    addMovieClick: function(ev) {
      App.vent.trigger('display:add-movie');
    },

    prefsClick: function(ev) {
      App.vent.trigger('display:preferences');
    },

    search: function(evt) {
      evt.preventDefault();
      var q = this.ui.search_input.val();
      App.vent.trigger('action:search', q);
    },

    clearSearch: function() {
      this.ui.search_input.val('');
      this.updateSearchButtons();
      App.vent.trigger('action:search', '');
    },

    updateSearchButtons: function() {
      var q = this.ui.search_input.val();
      if (q.length > 0)
        this.ui.btn_submit_search.removeClass('disabled');
      else
        this.ui.btn_submit_search
          .addClass('disabled')
          .tooltip('hide');
    }

  });

  return ToolbarView;

});
