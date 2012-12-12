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

  // give elements max height
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
        var total_h = F.el.sidebar.find(".movie-info").height();
        var h = total_h - $tabs.position().top + 20;
        $tabs.height(h);
        $tabs.find(".ui-tabs-panel").height(
          $tabs.innerHeight() - $tabs.find(".ui-tabs-nav").height() - 30);
      }
      F.grid.resizeCanvas();
      F.grid.autosizeColumns();
    }
  };
  $(window).resize(F.ui.relayout);

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

  // top search
  $("#top-search form").submit(function() {
    var $input = $(this).find("input[name=query]");
    F.search($input.val());
    return false;
  });
  $("#top-search input").focus(function() {
    var $t = $(this);
    if ($t.val() === "Search") {
      $t.attr("value", "");
    }
  })
  .blur(function() {
    var $t = $(this);
    if ($t.val() === "") {
      $t.attr("value", "Search");
    }
  });
  $("#top-search .clear-search").button({
    icons: {
      primary: "ui-icon-cancel"
    },
    text: false
  }).click(function() {
    $("#top-search input").val("Search");
    F.search('');
    return false;
  });
  F.el.tb.find("#show-advanced a").button({
    icons: {
      primary: "ui-icon-search"
    },
    text: false
  }).click(function() {
    F.el['adv-search'].slideDown('fast');
    return false;
  });

  // advanced search
  F.el["adv-search"].find(".close").button({
    icons: {
      primary: "ui-icon-closethick"
    },
    text: false
  }).click(function() {
    F.el['adv-search'].slideUp('fast');
    return false;
  });
  F.el["adv-search"].find("input[type=submit]").button();
  F.el["adv-search"].find("#as_radio_seen").buttonset();
  F.el["adv-search"].find("#as_radio_favourite").buttonset();
  F.el["adv-search"].find("form").submit(function() {
    var $f = $(this);
    var fields = {};
    // collect text fields
    $.each(
      ["title", "country", "genre", "keyword", "cast", "director", "writer"],
      function(i, f) {
        var v = $f.find("#as_" + f).val();
        if (v !== "")
          fields[f] = v;
      }
    );
    // collect boolean field seen
    $.each(
      ["seen", "favourite"],
      function(i, f) {
        var v = $f.find("#as_radio_" + f + " label[aria-pressed=true]")
          .prev().val()
        if (v !== "")
          fields[f] = (v == 'true') ? true : false;
      }
    );
    F.search(fields);
    return false;
  });
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
      el: $("#adv-search #as_country"),
    },
    genre: {
      el: $("#adv-search #as_genre"),
    },
    keyword: {
      el: $("#adv-search #as_keyword"),
    },
    cast: {
      el: $("#adv-search #as_cast"),
    },
    director: {
      el: $("#adv-search #as_director"),
    },
    writer: {
      el: $("#adv-search #as_writer"),
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
        $.post(
          "/autocomplete/",
          {
            q: q,
            what: what,
          },
          function(data, status, xhr) {
            F.autocomplete[what][q] = data;
            response(data);
          }
        );
      }
    });
  });

  // SIDEBAR

  // sidebar action icon togglers
  function favEnable(on) {
    if (on) {
      F.el.sidebar.find(".actions .fav")
        .removeClass("fav-remove").addClass("fav-add")
        .attr("title", "Add to favourites");
    } else {
      F.el.sidebar.find(".actions .fav")
        .removeClass("fav-add").addClass("fav-remove")
        .attr("title", "Remove from favourites");
    }
  }
  function seenEnable(on) {
    if (on) {
      F.el.sidebar.find(".actions .seen")
        .removeClass("unmark-seen").addClass("mark-seen")
        .attr("title", "Mark seen");
    } else {
      F.el.sidebar.find(".actions .seen")
        .removeClass("mark-seen").addClass("unmark-seen")
        .attr("title", "Unmark seen");
    }
  }

  // handle click event
  $("#sidebar .handle").click(function() {
    F.state.set('sidebar_collapsed', !F.state.get('sidebar_collapsed'));
    F.ui.relayout();
  });

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

  // lookup anchors
  $(document).on("click", "a.lookup", function() {
    var $this = $(this);
    var classes = $this.attr('class').split(" ");
    classes.splice(classes.indexOf("lookup"), 1);
    var q = {};
    q[classes[0]] = $this.text();
    F.search(q);
    return false;
  });

  // load movie into sidebar
  F.ui.loadMovieDetails = function(movie) {
    if (typeof movie == "undefined") {
      console.warn("loadMovieDetails got movie 'undefined'!");
      return;
    }
    // update actions
    if (movie.favourite)
      favEnable(false);
    else
      favEnable(true);
    if (movie.seen)
      seenEnable(false);
    else
      seenEnable(true);
    // update link icons
    if (movie.imdb_id) {
      F.el.sidebar.find(".imdb-link").attr(
        "href", F.constants.IMDB_BASE_URL + movie.imdb_id)
        .show();
      F.el.sidebar.find(".os-link").attr(
        "href", F.constants.OS_IMDB_SEARCH + movie.imdb_id);
    } else {
      F.el.sidebar.find(".imdb-link").hide();
      F.el.sidebar.find(".os-link").attr(
        "href", F.constants.OS_TITLE_SEARCH + encodeURI(movie.title));
    }
    F.el.sidebar.find(".kg-link").attr(
      "href", F.constants.KG_TITLE_SEARCH + encodeURI(movie.title));
    // text fields
    F.el.sidebar.find("div.id").text(movie.id);
    F.el.sidebar.find("input[name=title]").val(movie.title);
    F.el.sidebar.find("div.year").text(movie.year == null ? '' : movie.year);
    if (movie.rating !== null) {
      F.el.sidebar.find("div.rating")
        .text(movie.rating == null ? '' : movie.rating)
        .attr("title", movie.votes + " votes");
    }
    $.each(['directors', 'producers', 'writers'], function() {
      F.el.sidebar.find("div." + this).html(
        F.formatter.concatenateA(movie[this], 'lookup ' + this, 4)
      );
    });
    $.each(['genres', 'countries'], function() {
      F.el.sidebar.find("div." + this).html(
        F.formatter.concatenateA(movie[this], 'lookup ' + this)
      );
    });
    if (movie["mpaa"].length > 0) {
      F.el.sidebar.find("label.mpaa").show();
      F.el.sidebar.find("div.mpaa").text(movie['mpaa']).show();
    } else {
      F.el.sidebar.find("label.mpaa").hide();
      F.el.sidebar.find("div.mpaa").hide();
    }
    // tabs
    F.el.sidebar.find("#tabs-plot").html(F.formatter.plot(movie['plot']));
    F.el.sidebar.find("#tabs-keywords").html(
      F.formatter.concatenateA(movie['keywords'], 'lookup keywords')
    );
    F.el.sidebar.find("#tabs-notes").text(movie['notes']);
    // load cover
    var src =
      $.flicks.constants.COVER_BASE + 'movies_' + movie.id + '.jpg';
    F.el.sidebar.find(".image img").attr("src", src);
    // if cast tab open -> load cast
    if (!F.el.sidebar.find("#tabs-cast").hasClass("ui-tabs-hide")) {
      F.ui.loadCast();
    }
    F.ui.relayout();
  };
  // sidebar tabs
  F.ui.loadCast = function() {
    var movie_id = F.store.getItem(F.grid.getSelectedRows()[0]).id;
    $.post("/cast/", { movie_id: movie_id}, function(r) {
      $("#detail-tabs #tabs-cast").html(
        F.formatter.concatenateA(r.cast, 'lookup cast')
      );
    });
  };
  $("#detail-tabs").tabs();
  $("#detail-tabs .cast-tab").click(function() {
    $("#detail-tabs #tabs-cast").html("");
    F.ui.loadCast();
  });

  // image gets loaded -> this can change height of sidebar !!
  F.el.sidebar.find(".image img").load(F.ui.relayout);

  // store events
  F.store.onDataLoading.subscribe(F.ui.enable_spinner);
  F.store.onDataLoaded.subscribe(function(e, args) {
    if (F.store.getReqCount() < 1)
      F.ui.disable_spinner();
    F.el.grid.show();
    F.el.sidebar.show();
    // info text
    var info = "Found  <strong>" + F.store.getLength() + "</strong> movie" +
      (F.store.getLength() > 1 ? "s" : "") + "."
    var q = F.state.get("q");
    if (q) {
      if (typeof q === "string")
        info += " (Searching for '" + q + "')";
      else if (typeof q === "object") {
        info += " (Searching for ";
        $.each(q, function(k, v) {
          info += k + ": " + v;
        });
        info += ")";
      }
    }
    F.el.info.html(info);
  });

});
