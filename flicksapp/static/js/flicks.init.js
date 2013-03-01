(function ($) {

  $.flicks = {};
  var F = $.flicks;

  $(function() {

    // constants
    F.constants = {
      SIDEBAR_WIDTH: 500,
      SIDEBAR_COLLAPSED_WIDTH: 10,
      COOKIE_NAME: 'flicks_state',
      IMDB_BASE_URL: 'http://www.imdb.com/title/tt',
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
