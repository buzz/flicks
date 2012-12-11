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
    };

    // restore app state from cookie
    F.state.restore();

    // HTML elements
    F.el = {
      grid: $('#grid'),
      tb: $("#toolbar"),
      info: $("#info"),
      sidebar: $("#sidebar"),
      'adv-search': $("#adv-search"),
    };

    // autocomplete cache
    F.autocomplete = {};

    // set django csrf token
    var csrftoken = $.cookie('csrftoken');
    $.ajaxSetup({ headers: { 'X-CSRFToken': csrftoken } });

  });

})(jQuery);
