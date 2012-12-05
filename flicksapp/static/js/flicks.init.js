$(function() {

  $.flicks = {};
  var F = $.flicks;

  // constants
  F.constants = {
    COVER_BASE: '/static/images/covers/',
    SIDEBAR_WIDTH: 500,
    SIDEBAR_COLLAPSED_WIDTH: 10,
  };

  // HTML elements
  F.el = {
    grid: $('#grid'),
    tb: $("#toolbar"),
    info: $("#info"),
    sidebar: $("#sidebar"),
  };

  // set django csrf token
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  var csrftoken = getCookie('csrftoken');
  $.ajaxSetup({
    headers: {
      'X-CSRFToken': csrftoken
    }
  });

});
