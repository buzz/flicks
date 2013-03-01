(function ($) {

  var F = $.flicks;

  /***
   * A data store implementation to work with Django. It provides an
   * suitable interface to be used as an data store for SlickGrid.
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
        count: PAGESIZE
      };

      // search arguments
      if (typeof search === "string" && search.length > 0) {
        // top/simple search
        args.title = search;
        args.director = search;
      } else if (search !== null && typeof search === "object") {
        // advanced search
        $.extend(args, search);
      }

      // sorting
      if (sortcol !== null) {
        // args.o = sortcol;
        // TODO asc/desc not working!
        args.o = (sortasc ? '' : '-') + sortcol;
      }

      // fetch page blocks (most of the time there should be just one
      // page block to fetch. but sometimes the range can overlap two
      // pageblocks.
      for (var i = fromPage; i <= toPage; ++i) {
        // add 1 because the page parameter starts from 1 not 0
        args.page = i + 1;

        // ignore if an identical request is already active
        if (_.indexOf(req_info, args.page) !== -1)
          continue;

        onDataLoading.notify({
          from: (fromPage - 1) * PAGESIZE,
          to: (fromPage) * PAGESIZE,
          req_info: req_info
        });

        // create request
        var req = $.ajax({
          url: "/movies/",
          dataType: "json",
          type: "GET",
          data: args,
          // exploit context to store retrieved page
          context: { page: args.page }
        }).always(function() {
          // remove request info
          req_info = _.without(req_info, this.page);
        }).done(function (r) {
          onSuccess(r, this.page)
        }).fail(function (r) {
          // reset status indicator
          for (var i = fromPage * PAGESIZE; i < (fromPage + 1) * PAGESIZE; ++i)
            data[i] = undefined;
          // a cancelled request is not considered erroneous
          if (r.statusText != 'abort' && r.statusText != 'not found')
              onError.notify({ r: r, from: from, to: to });
        });

        // save request info
        req_info.push(args.page);
      }

    }

    function onSuccess(resp, fromPage) {
      var from = (fromPage - 1) * PAGESIZE, to = from + resp.results.length;
      data.length = resp.count;
      // copy received data to cache
      for (var i = from; i < to; ++i)
        data[i] = resp.results[i - from];
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
