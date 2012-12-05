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
      if (F.ui.sidebar_collapsed) {
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
      if (!F.ui.sidebar_collapsed) {
        var $tabs = F.el.sidebar.find("#detail-tabs");
        var total_h = F.el.sidebar.find(".movie-info").height();
        var h = total_h - $tabs.position().top + 20;
        $tabs.height(h);
        // $tabs.find(".ui-tabs-panel").height(h - 52);
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
    var $input = $(this).find("input#id_query");
    var q = $input.val();
    F.store.setSearch(q);
    F.gridChange();
    return false;
  });
  $("#top-search input").focus(function() {
    if ($(this).val() === "Search") {
      $(this).attr("value", "");
    }
  })
  .blur(function() {
    if ($(this).val() === "") {
      $(this).attr("value", "Search");
    }
  });

  // create sidebar
  F.ui.sidebar_collapsed = false;
  $("#sidebar .handle").click(function() {
    F.ui.sidebar_collapsed = !F.ui.sidebar_collapsed;
    F.ui.relayout();
  });
  // load movie into sidebar
  F.ui.loadMovieDetails = function(movie) {
    F.el.sidebar.find("div.id").text(movie.id);
    F.el.sidebar.find("input[name=title]").val(movie.title);
    F.el.sidebar.find("div.year").text(movie.year == null ? '' : movie.year);
    if (movie.rating !== null) {
      F.el.sidebar.find("div.rating")
        .text(movie.rating == null ? '' : movie.rating)
        .attr("title", movie.votes + " votes");
    }
    $.each(['directors', 'producers', 'writers'], function() {
      var p = $.map(movie[this], function(v) { return v.fields.name });
      if (p.length > 4) {
        p = p.slice(0, 4);
        p.push('…');
      }
      F.el.sidebar.find("div." + this).text(p.join(', '));
    });
    $.each(['genres', 'countries'], function() {
      var p = $.map(movie[this], function(v) { return v.fields.name });
      F.el.sidebar.find("div." + this).text(p.join(', '));
    });
    // tabs
    F.el.sidebar.find("#tabs-plot").html(F.formatter.plot(movie['plot']));
    F.el.sidebar.find("#tabs-keywords").html(
      $.map(movie['keywords'], function(k) {
        return '<a class="lookup" href="/keyword/' + k.fields.name + '">' +
          k.fields.name + "</a>";
      }).join(', ')
    );
    // load cover
    if (movie.files !== undefined) {
      $.each(movie.files, function () {
        if (this.fields.filetype == 'P') {
          var src = $.flicks.constants.COVER_BASE + this.fields.filename;
          F.el.sidebar.find(".image img").attr("src", src);
        }
      });
    }
    // if cast tab open -> load cast
    if (!F.el.sidebar.find("#tabs-cast").hasClass("ui-tabs-hide")) {
      F.ui.loadCast();
    }
    F.ui.relayout();
  };
  // sidebar tabs
  F.ui.loadCast = function() {
    var movie_id = F.store.getItem(F.grid.getSelectedRows()[0]).id;
    $.post("/cast", { movie_id: movie_id}, function(r) {
      $("#detail-tabs #tabs-cast").html(
        $.map(r.cast, function(a) {
          return '<a class="lookup" href="/person/' + a.fields.imdb_id + '">' +
            a.fields.name + "</a>";
        }).join(', ')
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

});
