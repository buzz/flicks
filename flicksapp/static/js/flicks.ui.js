$(function() {

  var F = $.flicks;

  F.ui = {};

  // spinner
  F.ui.enable_spinner = function() {
    $("#spinner").fadeIn();
  };
  F.ui.disable_spinner = function() {
    $("#spinner").fadeOut();
  };

  // resize grid, sidebar and sidebar tabs dynamically to fill window
  // height
  F.ui.relayout = function() {
    if(F.grid !== 'undefined') {
      // grid / sidebar max. height
      var h = $(window).height() - F.el.tb.outerHeight();
      F.el.grid.css('height', h + 'px');
      F.el.sidebar.css('height', h + 'px');
      // grid / sidebar horiz.
      if (F.state.get('sidebar_collapsed')) {
        F.el.sidebar.addClass('collapsed').removeClass('expanded');
        var w = $(window).width() - $.flicks.constants.SIDEBAR_COLLAPSED_WIDTH;
        F.el.grid.css('width', w + 'px');
        F.el.sidebar.css('width', $.flicks.constants.SIDEBAR_COLLAPSED_WIDTH + 'px');
      } else {
        F.el.sidebar.addClass('expanded').removeClass('collapsed');
        var w = $(window).width() - $.flicks.constants.SIDEBAR_WIDTH;
        F.el.grid.css('width', w + 'px');
        F.el.sidebar.css('width', $.flicks.constants.SIDEBAR_WIDTH + 'px');
      }
      // max tabs height in sidebar
      if (F.el.sidebar.is(":visible") && !F.state.get('sidebar_collapsed')) {
        var $tabs = F.el.sidebar.find("#detail-tabs");
        if ($tabs.length > 0) {
          var total_h = F.el.sidebar.find(".movie-info").height();
          var h = total_h - $tabs.position().top + 20;
          $tabs.height(h);
          $tabs.find(".ui-tabs-panel").height(
            $tabs.innerHeight() - $tabs.find(".ui-tabs-nav").height() - 30);
        }
      }
      F.grid.resizeCanvas();
      F.grid.autosizeColumns();
    }
  };
  $(window).resize(F.ui.relayout);

  // render and show adv search form
  F.ui.show_adv_search = function() {
    var q = $.flicks.state.get("q"), template_data;
    if (typeof q === 'object')
      template_data = q;
    else
      template_data = F.search.empty_search;
    var template = _.template($("#searchform-template").html(), template_data);
    F.el['adv-search'].html(template);
    F.ui.setupSearchForm();
    F.el['adv-search'].slideDown('fast');
  };

  //////////////////////////////////////////////////////////////////////////////
  // Initialize UI

  F.ui.setupUI = function() {
    // toolbar buttons
    $("a.button.list").button({
      icons: {
        primary: "ui-icon-video"
      }
    });
    $("a.button.add").button({
      icons: {
        primary: "ui-icon-plusthick"
      }
    });
    // clear search button
    $("#top-search .clear-search").button({
      icons: {
        primary: "ui-icon-cancel"
      },
      text: false
    });
    // show search form button
    F.el.tb.find("#show-advanced a").button({
      icons: {
        primary: "ui-icon-search"
      },
      text: false
    });
  }

  // advanced search form: setup UI and restore form state
  F.ui.setupSearchForm = function() {
    F.el["adv-search"].find(".close").button({
      icons: {
        primary: "ui-icon-closethick"
      },
      text: false
    }).click(function() {
      F.el['adv-search'].slideUp('fast');
      return false;
    });
    // sliders
    $.each(["year", "runtime", "rating"], function(i, v) {
      // min/max boundaries
      var min = F.hidden_info[v + "_min"], max = F.hidden_info[v + "_max"];
      var updateDisplay = function(e, ui) {
        F.el["adv-search"].find(".as_" + v + " .display").html(
          "<strong>" + ui.values[0] + "</strong> - <strong>"
            + ui.values[1]) + "</strong>";
      };
      // set values
      var q = F.state.get('q'), values;
      if (typeof q === 'object' && v in q)
        values = [q[v][0], q[v][1]];
      else
        values = [min, max];
      F.el["adv-search"].find("#as_slider_" + v).slider({
        range: true,
        min: min,
        max: max,
        values: values,
        slide: updateDisplay,
        step: (v == 'rating') ? 0.1 : 1,
      });
      updateDisplay(undefined, { values: [min, max] });
    });
    // buttons
    F.el["adv-search"].find("#as_radio_seen").buttonset();
    F.el["adv-search"].find("#as_radio_favourite").buttonset();
    F.el["adv-search"].find("input[type=submit]").button();
    // adv. search submit
    F.el["adv-search"].find("form").submit(F.ui.submitAdvancedSearch);
    // auto-complete
    var ac = {
      'top-search': {
        el: $("#top-search input[name=query]"),
        what: 'title',
      },
      title: {
        el: $("#adv-search #as_title"),
      },
      country: {
        el: $("#adv-search #as_countries"),
      },
      genre: {
        el: $("#adv-search #as_genres"),
      },
      keyword: {
        el: $("#adv-search #as_keywords"),
      },
      cast: {
        el: $("#adv-search #as_cast"),
      },
      director: {
        el: $("#adv-search #as_directors"),
      },
      writer: {
        el: $("#adv-search #as_writers"),
      },
    };
    $.each(ac, function(k, v) {
      v.el.autocomplete({
        source: function(request, response) {
          var q = request.term;
          var what = ('what' in v) ? v.what : k;
          if (!(what in F.autocomplete))
            F.autocomplete[what] = {};
          if (q in F.autocomplete[what]) {
            response(F.autocomplete[what][q]);
            return;
          }
          $.ajax({
            url: "/autocomplete/",
            dataType: "json",
            type: "POST",
            data: {
              q: q,
              what: what,
            },
            success: function(data, status, xhr) {
              F.autocomplete[what][q] = data;
              response(data);
            },
            error: function(r) {
              F.modals.error(
                "<strong>Auto-complete failed!</strong><br><br>Error text: "
                  + r.statusText);
            },
          });
        }
      });
    });
  }

  // submit advanced search
  F.ui.submitAdvancedSearch = function() {
    var $f = $(this);
    var fields = {};
    // collect text fields
    $.each(
      ["title", "countries", "genres", "keywords", "cast", "directors",
       "writers", "mpaa"],
      function(i, f) {
        var v = $f.find("#as_" + f).val();
        if (v !== "")
          fields[f] = v;
      }
    );
    // collect boolean fields
    $.each(
      ["seen", "favourite"],
      function(i, f) {
        // get value of checkboxes. if it was already clicked by the
        // user the 'aria-pressed' attribute is present. if not we go
        // for the 'checked' attribute
        var $el = $f.find("#as_radio_" + f + " label[aria-pressed=true]"), v;
        if ($el.length != 0)
          $el = $el.prev();
        else
          $el = $f.find("#as_radio_" + f + " input[checked]");
        v = $el.val();
        if (v !== "")
          fields[f] = v;
      }
    );
    // collect slider range fields
    $.each(
      ["year", "runtime", "rating"],
      function(i, f) {
        var v = $f.find("#as_slider_" + f).slider("option", "values");
        if (v[0] > F.hidden_info[f + "_min"] ||
            v[1] < F.hidden_info[f + "_max"])
          fields[f] = v;
      }
    );
    F.search(fields);
    return false;
  }

  // SIDEBAR

  // movie info action handlers
  F.el.sidebar.on("click", "a.fav-add", function() {
    var id = F.el.sidebar.find(".id").text();
    F.actions.favMovie(id, function() {
      F.store.getItemById(id).favourite = true;
      favEnable(false);
      F.el.grid.find(".slick-row.active > div:first > div").addClass("fav");
    });
    return false;
  })
  .on("click", "a.fav-remove", function() {
    var id = F.el.sidebar.find(".id").text();
    F.actions.favMovie(id, function() {
      F.store.getItemById(id).favourite = false;
      favEnable(true);
      F.el.grid.find(".slick-row.active > div:first > div").removeClass("fav");
    }, true);
    return false;
  })
  .on("click", "a.mark-seen", function() {
    var id = F.el.sidebar.find(".id").text();
    F.actions.markSeenMovie(id, function() {
      F.store.getItemById(id).seen = true;
      seenEnable(false);
      F.el.grid.find(".slick-row.active > div:first > div").addClass("seen-yes")
        .removeClass("seen-no");
    });
    return false;
  })
  .on("click", "a.unmark-seen", function() {
    var id = F.el.sidebar.find(".id").text();
    F.actions.markSeenMovie(id, function() {
      F.store.getItemById(id).seen = false;
      seenEnable(true);
      F.el.grid.find(".slick-row.active > div:first > div").addClass("seen-no")
        .removeClass("seen-yes");
    }, true);
    return false;
  });

  // load movie into sidebar
  F.ui.loadMovieDetails = function(movie) {
    if (!movie)
      return;
    $.ajax({
      url: "/movie/" + movie.id,
      dataType: "json",
      type: "GET",
      success: function (movie) {
        // render sidebar template
        var template = _.template($("#sidebar-template").html(), movie);
        F.el.sidebar.children('.movie-info').html(template);
        $("#detail-tabs").tabs();
        F.ui.relayout();
        // image gets loaded -> this can change height of sidebar !!
        F.el.sidebar.find(".image img").load(F.ui.relayout);
      },
      error: function (r) {
        F.modals.error(
          "<strong>Loading movie details failed " + movie.id +
            "!</strong><br><br>Error text: " + r.statusText);
      }
    });
  }

  F.ui.updateInfoText = function() {
    var info = "Found  <strong>" + F.store.getLength() + "</strong> movie" +
      (F.store.getLength() > 1 ? "s" : "") + "."
    var q = F.state.get("q");
    if (q) {
      if (typeof q === "string")
        info += " (Searching for '" + q + "')";
      else if (typeof q === "object") {
        var fields = [];
        $.each(q, function(k, v) {
          if (typeof v != "undefined" && v !== '')
            fields.push(k + ": <strong>" + v + "</strong>");
        });
        if (fields.length > 0)
          info += " (Searching for " + fields.join(", ") + ")";
      }
    }
    F.el.info.html(info);
  };

  // listen for store events
  F.store.onDataLoading.subscribe(F.ui.enable_spinner);
  F.store.onDataLoaded.subscribe(function(e, args) {
    if (args.req_info.length == 0)
      F.ui.disable_spinner();
    F.el.grid.show();
    F.el.sidebar.show();
    F.ui.updateInfoText();
  });

});
