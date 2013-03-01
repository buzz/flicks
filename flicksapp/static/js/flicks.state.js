(function ($) {

  var F = $.flicks;

  $.cookie.defaults = { expires: 99999 };

  // state manager
  F.state = {

    get: function(key) {
      if (key in F.state._state)
        return F.state._state[key];
      else
        return null;
    },

    set: function(key, value) {
      F.state._state[key] = value;
      F.state._persist();
    },

    restore: function() {
      var cookie_state = $.cookie(F.constants.COOKIE_NAME);
      if (cookie_state === null)
        // create cookie
        F.state._persist();
      else
        // read cookie
        $.extend(F.state._state, JSON.parse(cookie_state));
    },

    _persist: function() {
      $.cookie(F.constants.COOKIE_NAME, JSON.stringify(F.state._state));
    },

    // defaults
    _state: {
      sidebar_collapsed: false,
      q: F.search.empty_search
      // sorting
      // search
      // selected movie
      // grid col widths
    },

  };

})(jQuery);
