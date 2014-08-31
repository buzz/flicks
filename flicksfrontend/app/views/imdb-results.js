define([
  'marionette'
], function(
  Marionette
) {

  var ImdbResultView = Marionette.ItemView.extend({

    tagName:   'tr',
    template:  'imdb-result',
    className: 'imdb-result',

    ui: {
      btn_imdb: '.btn-open-imdb'
    },

    events: {
      'click @ui.btn_imdb': 'onImdbClick',
      'click':              'onClick'
    },

    modelEvents: {
      'change:_selected': 'changeSelected'
    },

    behaviors: { ToolTips: {} },

    onImdbClick: function(evt) {
      evt.stopPropagation();
      var url = this.model.getImdbUrl();
      App.vent.trigger('action:open-external-url', url);
    },

    onClick: function() {
      this.model.set('_selected', true);
    },

    changeSelected: function(model, selected) {
      if (selected)
        this.$el.addClass('selected');
      else
        this.$el.removeClass('selected');
    }

  });

  var ImdbResultsView = Marionette.CompositeView.extend({

    template:           'imdb-results',
    childViewContainer: 'tbody',
    childView:          ImdbResultView

  });

  return ImdbResultsView;

});
