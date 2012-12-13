(function ($) {

  var F = $.flicks;

  /***
   * A data store implementation to work with Django.
   */
  function RemoteDjangoModel() {
    // private
    var PAGESIZE = 50;
    var data = [];
    var search = null;
    var sortcol = null;
    var sortasc = true;
    var h_request = null;
    var req_count = 0;
    var req = null; // ajax request

    // events
    var onDataLoading = new Slick.Event();
    var onDataLoaded = new Slick.Event();
    var onError = new Slick.Event();

    function init() {
    }

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

    function ensureData(from, to) {
      // is it neccessary to abort request?
      //  . leads to broken pipes in django http stack
      // if (req) {
      //   console.debug("REQ ABORTED!");
      //   req.abort();
      // }

      if (from < 0) {
        from = 0;
      }

      var fromPage = Math.floor(from / PAGESIZE);
      var toPage = Math.floor(to / PAGESIZE);

      while (data[fromPage * PAGESIZE] !== undefined && fromPage < toPage)
        fromPage++;

      while (data[toPage * PAGESIZE] !== undefined && fromPage < toPage)
        toPage--;

      if (fromPage > toPage || ((fromPage == toPage) && data[fromPage * PAGESIZE] !== undefined)) {
        // TODO:  look-ahead ?
        return;
      }

      if (h_request != null) {
        clearTimeout(h_request);
      }

      h_request = setTimeout(function () {
        for (var i = fromPage; i <= toPage; i++)
          data[i * PAGESIZE] = null; // null indicates a 'requested but not available yet'
        onDataLoading.notify({from: from, to: to});
        ++req_count;
        var post_data = {
            offset: fromPage * PAGESIZE,
            count: ((toPage - fromPage) * PAGESIZE) + PAGESIZE
        };

        // search
        if (typeof search === "string" && search.length > 0)
          // top search
          post_data.q = search;
        else if (search !== null && typeof search === "object") {
          // advanced search
          var keys = F.helper.keys(search);
          if (keys.length > 0) {
            post_data["adv_search"] = search;
          }
        }

        // sorting
        if (sortcol !== null) {
          post_data.sortcol = sortcol;
          post_data.sortasc = sortasc;
        }

        req = $.ajax({
          url: "/grid/",
          dataType: "json",
          type: "POST",
          data: JSON.stringify(post_data),
          success: function (r) {
            onSuccess(r, fromPage, toPage)
          },
          error: function (r) {
            req = null;
            --req_count;
            for (var i = fromPage * PAGESIZE;
                 i < toPage * PAGESIZE + PAGESIZE; ++i)
              data[i] = undefined;
            onError.notify({ r: r, from: from, to: to });
          }
        });
      }, 50);
    }

    function onSuccess(resp, fromPage, toPage) {
      var from = fromPage * PAGESIZE, to = from + resp.movies.length;
      data.length = resp.total;
      for (var i = 0; i < resp.movies.length; ++i) {
        m = resp.movies[i];
        data[from + i] = m.fields;
        data[from + i].index = from + i;
        data[from + i].id = m.pk;
      }
      req = null;
      --req_count;
      onDataLoaded.notify({from: from, to: to});
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

    function getReqCount() {
      return req_count;
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

    init();

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
      "getReqCount": getReqCount,
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
