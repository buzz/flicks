define([
  'marionette'
], function(
  Marionette
) {

  var ToolbarView = Marionette.ItemView.extend({

    template:  'toolbar',
    className: 'navbar navbar-default navbar-static-top',

    ui: {
      status_text:                     '#status-text',
      btn_toggle_sidebar:              '#btn-toggle-sidebar',
      display_mode:                    '#radio-display-mode',
      display_mode_input:              '#radio-display-mode input',
      search_form:                     'form[role=search]',
      search_input:                    'form[role=search] input',
      btn_adv_search:                  'form[role=search] #btn-adv-search',
      btn_clear_search:                'form[role=search] #btn-clear-search',
      btn_submit_search:               'form[role=search] button[type=submit]',
      spinner:                         '#spinner'
    },

    events: {
      'click  @ui.btn_toggle_sidebar': 'toggleSidebarClick',
      'change @ui.display_mode_input': 'displayModeClick',

      'submit @ui.search_form':        'search',
      'click  @ui.btn_adv_search':     'advSearch',
      'click  @ui.btn_clear_search':   'clearSearch',
      'input  @ui.search_input':       'updateSearchButtons'
    },

    modelEvents: {
      'change:search':                 'searchChanged',
      'change:results_count':          'resultsCountChanged',
      'change:sidebar_enabled':        'sidebarEnabledChanged'
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
      this.sidebarEnabledChanged(
        this.model, this.model.get('sidebar_enabled'));
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
      if ($i.val() !== search) {
        $i.val(search);
        this.updateSearchButtons();
      }
    },

    sidebarEnabledChanged: function(state, enabled) {
      var $i = this.ui.btn_toggle_sidebar.find('i');
      if (enabled)
        $i.removeClass('fa-caret-square-o-right')
          .addClass('fa-caret-square-o-left');
      else
        $i.addClass('fa-caret-square-o-right')
          .removeClass('fa-caret-square-o-left');
    },

    resultsCountChanged: function(state, count) {
      var word = 'movie%s'.format(count == 1 ? '' : 's');
      this.ui.status_text.html(
        '<strong>%d</strong> %s found'.format(count, word));
    },

    // UI handlers

    toggleSidebarClick: function(ev) {
      v = !this.model.get('sidebar_enabled');
      this.model.set('sidebar_enabled', v);
    },

    displayModeClick: function(ev) {
      var $el = $(ev.currentTarget);
      App.state.set('view_mode', $el.val());
    },

    updateSearchButtons: function() {
      var q = this.ui.search_input.val();
      if (q.length > 0) {
        this.ui.btn_clear_search.removeClass('disabled');
        this.ui.btn_submit_search.removeClass('disabled');
      }
      else {
        this.ui.btn_clear_search
          .addClass('disabled')
          .tooltip('hide');
        this.ui.btn_submit_search
          .addClass('disabled')
          .tooltip('hide');
      }
    },

    search: function() {
      var q = this.ui.search_input.val();
      App.router.navigate('search/%s'.format(q), { trigger: true });
      return false;
    },

    clearSearch: function() {
      this.ui.search_input.val('');
      App.router.navigate('search/', { trigger: true, replace: true });
    },

    advSearch: function() {
      // TODO
      console.log('adv search');
    }

  });

  return ToolbarView;

});
