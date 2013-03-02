(function ($) {

  var F = $.flicks;

  /***
   * A REST data store implementation to be used with SlickGrid.
   *
   * The store fetches and caches data from an REST API (eg. Django
   * REST framework) in blocks (PAGESIZE elements per request).
   *
   */
  function RemoteDjangoModel() {
    // private
    var PAGESIZE = 100;
    var search = null;
    var sortcol = null;
    var sortasc = true;
    // keep track of current requests (array with elements being the
    // requested page number)
    var req_info = [];
    // data cache (using array because it's faster then object)
    // entries with indexes that are multiples of PAGESIZE indicate
    // cache status (undefined means not cached)
    var data = [];

    // events
    var onDataLoading = new Slick.Event();
    var onDataLoaded = new Slick.Event();
    var onError = new Slick.Event();

    function isDataLoaded(from, to) {
      for (var i = from; i <= to; i++) {
        if (data[i] == undefined || data[i] == null) {
          return false;
        }
      }
      return true;
    }

    function clear() {
      data = [];
    }

    // ensures that data within a given range are either cached. if
    // not the items are loaded in blocks of size PAGESIZE from the
    // server. 'from' and 'to' are indexes that refer to the 'data'
    // cache array.
    function ensureData(from, to) {
      // preload one extra screen of items before and after actual
      // range
      to += to - from;
      from -= to - from;
      from = Math.max(0, from);

      var fromPage = Math.floor(from / PAGESIZE);
      var toPage = Math.floor(to / PAGESIZE);

      // check data cache if pages are already loaded by narrowing
      // down the slice that has to be loaded
      while (data[fromPage * PAGESIZE] !== undefined && fromPage < toPage)
        fromPage++;
      while (data[toPage * PAGESIZE] !== undefined && fromPage < toPage)
        toPage--;

      // no need to load data, already cached?
      if (fromPage > toPage || ((fromPage == toPage) && data[fromPage * PAGESIZE] !== undefined))
        return;

      // request arguments
      var args = {
        limit: PAGESIZE
      };

      // search arguments
      if (typeof search === "string" && search.length > 0)
        // top/simple search
        args.q = search;
      else if (typeof search === "object") {
        // advanced search
        var searchargs = {};
        _.each(search, function(v, k) {
          if (typeof v === 'string' && v !== '') {
            // string model field
            if (_.indexOf(['title', 'mpaa'], k) !== -1)
              searchargs[k + '__search'] = v;
            // string model field
            else if (_.indexOf(['seen', 'favourite'], k) !== -1)
              searchargs[k] = v;
            // related field
            else if (_.indexOf(['countries', 'genres', 'keywords', 'cast',
                                'directors', 'producers', 'writers'], k) !== -1)
              searchargs[k + '__name__search'] = v;
          }
          // range field
          else if (typeof v === 'object' && v[0] !== '' && v[1] !== '') {
            if (_.indexOf(['year', 'runtime', 'rating'], k) !== -1)
              searchargs[k + '__range'] = v[0] + ',' + v[1];
          }
        });
        $.extend(args, searchargs);
      }

      // sorting
      if (sortcol !== null)
        args.order_by = (sortasc ? '' : '-') + sortcol;

      // fetch page blocks (most of the time there should be just one
      // page block to fetch. but sometimes the range can overlap two
      // pageblocks.
      for (var i = fromPage; i <= toPage; ++i) {
        // results offset
        args.offset = i * PAGESIZE;

        // ignore if an identical request is already active
        if (_.indexOf(req_info, args.offset) !== -1)
          continue;

        onDataLoading.notify({
          from: args.offset,
          to: args.offset + PAGESIZE,
          req_info: req_info
        });

        // create request
        var req = $.ajax({
          url: "/movies/",
          dataType: "json",
          type: "GET",
          data: args,
          // exploit context to store retrieved page
          context: { offset: args.offset }
        }).always(function() {
          // remove request info
          req_info = _.without(req_info, this.offset);
        }).done(function (r) {
          onSuccess(r, this.offset)
        }).fail(function (r) {
          // reset status indicator
          for (var i = fromPage * PAGESIZE; i < (fromPage + 1) * PAGESIZE; ++i)
            data[i] = undefined;
          // a cancelled request is not considered erroneous
          if (r.statusText != 'abort' && r.statusText != 'not found')
              onError.notify({ r: r, from: from, to: to });
        });

        // save request info
        req_info.push(args.offset);
      }

    }

    function onSuccess(resp, from) {
      var to = from + resp.objects.length;
      data.length = resp.meta.total_count;
      // copy received data to cache
      for (var i = from; i < to; ++i)
        data[i] = resp.objects[i - from];
      onDataLoaded.notify({
        from: from,
        to: to,
        req_info: req_info
      });
    }

    function reloadData(from, to) {
      for (var i = from; i <= to; i++)
        delete data[i];
      ensureData(from, to);
    }

    function setSort(column, dir) {
      sortcol = column;
      sortasc = dir;
      clear();
    }

    function getSort() {
      return {
        sortcol: sortcol,
        sortasc: sortasc
      };
    }

    function setSearch(s) {
      search = s;
      clear();
    }

    function getLength() {
      return data.length;
    }

    function getItem(i) {
      return data[i];
    }

    function getItemById(id) {
      for (var i = 0; i < data.length; ++i) {
        if (typeof data[i] !== 'undefined')
          if (data[i].id == id) return data[i]
      }
    }

    return {
      // properties
      "data": data,

      // methods
      "clear": clear,
      "isDataLoaded": isDataLoaded,
      "ensureData": ensureData,
      "reloadData": reloadData,
      "setSort": setSort,
      "setSearch": setSearch,

      // model interface methods
      "getLength": getLength,
      "getItem": getItem,
      "getItemById": getItemById,
      "getSort": getSort,

      // events
      "onDataLoading": onDataLoading,
      "onDataLoaded": onDataLoaded,
      "onError": onError,
    };
  }

  // Slick.Data.RemoteModel
  $.extend(true, window, { Slick: {
    Data: { RemoteDjangoModel: RemoteDjangoModel }}});
})(jQuery);
