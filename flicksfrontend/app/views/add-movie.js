define([
  'movie',
  'views/modal',
  'views/imdb-results'
], function(
  Movie,
  ModalView,
  ImdbResultsView
) {

  var spinnerMarkup = '<i class="fa fa-spinner fa-spin"></i>';

  var AddMovieView = ModalView.extend({

    template:  'modal-add-movie',

    ui: {
      modal:   '.modal',
      btn_add: '.btn-add-movie',
      results: '.imdb-results',
      form:    '.form-add-movie-search',
      submit:  '.form-add-movie-search button[type=submit]',
      input:   '.form-add-movie-search input[type=text]'
    },

    events: {
      'submit @ui.form':    'searchFormSubmit',
      'input  @ui.input':   'searchFormInput',
      'click  @ui.btn_add': 'clickAdd'
    },

    initialize: function() {
      App.imdb_results.reset();

      this.on('render', function() {

        var that = this;
        this.ui.modal.modal().on('shown.bs.modal', function() {
          that.ui.input.focus();
        });

        this.results_view = new ImdbResultsView({
          el: this.ui.results,
          collection: App.imdb_results
        });

        this.listenTo(App.imdb_results, {
          'reset':            this.onCollReset,
          'change:_selected': this.changeSelected
        }, this);

        this.searchFormInput();

      }, this);

    },

    onCollReset: function(coll) {
      this.results_view.render();
      this.ui.submit.removeClass('disabled');
      this.ui.submit
        .removeClass('disabled')
        .html('Search!');
      this.changeSelected();
    },

    searchFormSubmit: function(evt) {
      evt.preventDefault();
      var q = this.ui.input.val();
      if (q.length > 1) {
        App.vent.trigger('action:imdb-search', q);
        this.ui.submit
          .addClass('disabled')
          .html('%s Searching…'.format(spinnerMarkup));
      }
    },

    searchFormInput: function() {
      var q = this.ui.input.val();
      if (q.length > 0)
        this.ui.submit.removeClass('disabled');
      else
        this.ui.submit.addClass('disabled');
    },

    changeSelected: function() {
      var count = _.size(App.imdb_results.where({ _selected: true }));
      if (count === 1)
        this.ui.btn_add.removeClass('disabled');
      else
        this.ui.btn_add.addClass('disabled');
    },

    clickAdd: function() {
      var movie = new Movie();
      var r = App.imdb_results.findWhere({ _selected: true });
      movie.set('imdb_id', r.get('imdb_id'));

      this.listenToOnce(App.movie_collection, 'dataloaded', function() {
        this.ui.modal.modal('hide');
      }, this);

      this.ui.btn_add
        .addClass('disabled')
        .html('%s Fetching…'.format(spinnerMarkup));

      App.vent.trigger('action:add', movie);
    }

  });

  return AddMovieView;

});
