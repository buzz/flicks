(function ($) {

  var F = $.flicks;

  // perform search
  F.search = function(q) {
    F.store.clear();
    F.grid.updateRowCount()
    F.store.setSearch(q);
    F.gridChange();
    // save search to app state
    var q_state = F.state.get('q');
    if (typeof q === 'object')
      // over write new state over old while preserving keys in old q
      if (typeof q_state == 'object') {
        F.state.set(
          'q', $.extend({}, F.search.empty_search, q_state, q));
      } else {
        F.state.set(
          'q', $.extend({}, F.search.empty_search, q));
      }
    else
      F.state.set('q', q);
  }

  // empty search (show all)
  F.search.empty_search = {
    title: '',
    countries: '',
    genres: '',
    keywords: '',
    cast: '',
    directors: '',
    writers: '',
    mpaa: '',
    seen: '',
    favourite: ''
  };

})(jQuery);
