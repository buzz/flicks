define([
  'marionette'
], function(
  Marionette
) {

  var ToolbarView = Marionette.ItemView.extend({

    template:  'toolbar',
    className: 'navbar navbar-default navbar-static-top',

    events: {
      'change #radio-grid-tiles input':            'radioViewClick',

      'submit form[role=search]':                  'search',
      'click form[role=search] #btn-adv-search':   'advSearch',
      'click form[role=search] #btn-clear-search': 'clearSearch',
      'input form[role=search] input':             'toggleSearchButton'
    },

    modelEvents: {
      'change:search':        'searchChanged',
      'change:results-count': 'resultsCountChanged'
    },

    ui: {
      status_text:       '#status-text',
      search_form:       'form[role=search]',
      search_input:      'form[role=search] input',
      btn_clear_search:  'form[role=search] #btn-clear-search',
      btn_submit_search: 'form[role=search] button[type=submit]',
      spinner:           '#spinner'
    },

    initialize: function() {
      this.listenTo(
        App.movie_collection, 'change:_selected', this.onSelected, this);

      this.listenTo(App.movie_collection, {
        'dataloading':       this.updateSpinner,
        'dataloaded':        this.updateSpinner
      }, this);
    },

    updateSpinner: function(args) {
      if (args.request_count < 1)
        this.ui.spinner.fadeOut('fast');
      else
        this.ui.spinner.fadeIn('fast');
    },

    onRender: function() {
      this.resultsCountChanged(this.model, this.model.get('results-count'));
    },

    onSelected: function(movie, selected) {
      // disable/enable movie actions
      if (selected) {
        var view = this;
        this.$('.movie-action').removeClass('disabled');
        _.each(['favourite', 'seen'], function(attr) {
          var value = movie.get(attr);
          var func = value ? 'addClass' : 'removeClass';
          view.$('.btn.%s'.format(attr))[func]('active');
        });
      }
      else {
        this.$('.movie-action').addClass('disabled');
        var view = this;
        _.each(['favourite', 'seen'], function(attr) {
          view.$('.btn.%s'.format(attr)).removeClass('active');
        });
      }
    },

    searchChanged: function(state, search) {
      if (this.ui.search_input.val() !== search) {
        this.ui.search_input.val(search);
        this.toggleSearchButton();
      }
    },

    resultsCountChanged: function(state, count) {
      var word = 'movie%s'.format(count == 1 ? '' : 's');
      this.ui.status_text.html(
        '<strong>%d</strong> %s found'.format(count, word));
    },

    toggleSearchButton: function() {
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

    radioViewClick: function(ev) {
      var $el = $(ev.currentTarget);
      var $label = $el.parent();
      if ($label.hasClass('active'))
          return;
      var $btn_group = $label.parent();
      $btn_group.children('label').removeClass('active');
      $label.addClass('active');
      App.state.set('view-mode', $el.val());
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
