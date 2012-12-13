(function ($) {

  $.flicks = {};
  var F = $.flicks;

  // helper functions
  F.helper = {

    // returns keys of an object
    keys: function(obj) {
      var keys = [];
      $.each(obj, function(k) {
        keys.push(k);
      });
      return keys;
    },

  };

  // perform search
  F.search = function(q) {
    F.store.clear();
    F.store.setSearch(q);
    F.gridChange();
    F.state.set('q', q);
  }

  $(function() {

    // constants
    F.constants = {
      COVER_BASE: '/static/images/covers/',
      SIDEBAR_WIDTH: 500,
      SIDEBAR_COLLAPSED_WIDTH: 10,
      COOKIE_NAME: 'FLICKS_STATE',
      IMDB_BASE_URL: 'http://www.imdb.com/title/tt',
      OS_IMDB_SEARCH: 'http://www.opensubtitles.org/en/search/imdbid-',
      OS_TITLE_SEARCH:
        'http://www.opensubtitles.org/en/search2/sublanguageid-en/moviename-',
      KG_TITLE_SEARCH:
        'https://karagarga.net/browse.php?search_type=title&search=',
    };

    // restore app state from cookie
    F.state.restore();

    // make hidden info available
    F.hidden_info = JSON.parse($("#hidden_info").html());

    // HTML elements
    F.el = {
      grid: $('#grid'),
      tb: $("#toolbar"),
      info: $("#info"),
      sidebar: $("#sidebar"),
      'adv-search': $("#adv-search"),
      modal: $("#modal"),
    };

    // autocomplete cache
    F.autocomplete = {};

    // set django csrf token
    var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
    $.ajaxSetup({ headers: { 'X-CSRFToken': csrftoken } });

  });

})(jQuery);
