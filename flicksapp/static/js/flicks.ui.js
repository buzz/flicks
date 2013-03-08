(function() {

  //////////////////////////////////////////////////////////////////////////////
  // flicks.ui.js
  //
  // Code that deals with UI updates (like filling data into DOM
  // elements, rendering client templates, ...)
  //

  var F = $.flicks;

  F.ui = {};

  // spinner
  F.ui.enableSpinner = function() {
    $("#spinner").fadeIn();
  };
  F.ui.disableSpinner = function() {
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

  // render and show adv search form
  F.ui.showAdvSearch = function() {
    F.ui.renderAdvSearch();
    F.el['adv-search'].slideDown('fast');
  };

  F.ui.renderAdvSearch = function() {
    var q = $.flicks.state.get("q"), template_data;
    if (typeof q === 'object')
      template_data = q;
    else
      template_data = F.search.empty_search;
    var template = _.template($("#searchform-template").html(), template_data);
    F.el['adv-search'].html(template);
    F.ui.setupSearchForm();
  };

  // update toolbar status text
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

  //////////////////////////////////////////////////////////////////////////////
  // Initialize UI

  F.ui.setupUI = function() {
    // UI has to react on store events
    F.store.onDataLoading.subscribe(F.ui.enableSpinner);
    F.store.onDataLoaded.subscribe(function(e, args) {
      if (_.keys(args.req_info).length == 0) {
        F.ui.disableSpinner();
        F.el.grid.show();
        F.el.sidebar.show();
        F.ui.updateInfoText();
      }
    });
    // toolbar buttons
    $("a.button.tile-view").button({
      icons: {
        primary: "ui-icon-video"
      }
    });
    $("a.button.add").button({
      icons: {
        primary: "ui-icon-plusthick"
      }
    });
    // clear search button (in toolbar)
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
    // auto-complete for top search
    F.autocomplete.setupTopSearch();
    // sidebar title tooltip (for akas)
    $(document).tooltip({
      items: '#sidebar input[name=title]',
      content: function() {
        return _.template(
          $("#akas-tooltip-template").html(), $.flicks.movie.current);
      }
    });
    // add movie dialog
    $('#dialog-add-movie a#add_movie_title_search').button({
      icons: {
        primary: 'ui-icon-search'
      },
      text: false
    });
    // init movie delete confirmation dialog
    F.el['dialog-delete-confirm'].dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        'Delete!': function() {
          $(this).dialog('close');
          F.movie.delete(F.movie.current, function(movie) {
            F.store.clear();
            var i = 0;
            while (i < F.grid.getDataLength())
              F.grid.invalidateRow(i++);
            F.gridChange();
          });
        },
        Cancel: function() {
          $(this).dialog('close');
        }
      }
    });
  }

  // advanced search form: setup UI and restore form state
  F.ui.setupSearchForm = function() {
    // buttons
    F.el["adv-search"].find(".clear-search").button({
      icons: { primary: "ui-icon-cancel" }, text: false
    });
    F.el["adv-search"].find(".close").button({
      icons: { primary: "ui-icon-closethick" }, text: false
    });
    F.el["adv-search"].find("input[type=submit]").button();
    F.el["adv-search"].find("#as_radio_seen").buttonset();
    F.el["adv-search"].find("#as_radio_favourite").buttonset();
    // sliders
    $.each(["year", "runtime", "rating"], function(i, v) {
      // min/max boundaries
      var min = F.hidden_info[v + "_min"], max = F.hidden_info[v + "_max"];
      var updateDisplay = function(e, ui) {
        F.el["adv-search"].find(".as_" + v + " .display").html(
          "<strong>" + ui.values[0] + "</strong> - <strong>"
            + ui.values[1]) + "</strong>";
      };
      // restore values
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
    // auto-complete
    F.autocomplete.setupAdvancedSearch();
  }

  // submit advanced search
  F.ui.submitAdvancedSearch = function() {
    var $f = $(this);
    var fields = {};
    // collect text fields
    $.each(
      ["title", "countries", "languages", "genres", "keywords", "cast",
       "directors", "writers", "mpaa"],
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
    F.search.do(fields);
    return false;
  }

  // SIDEBAR

  // toggle
  F.ui.toggleSidebar = function() {
    F.state.set('sidebar_collapsed', !F.state.get('sidebar_collapsed'));
    F.ui.relayout();
  };
  // render the sidebar
  F.ui.renderSidebar = function(movie) {
    // render sidebar template
    var template = _.template($("#sidebar-template").html(), movie);
    F.el.sidebar.children('.movie-info').html(template);
    $("#detail-tabs").tabs();
    F.ui.relayout();
    F.el.sidebar.find(".cover img")
      .load(function() {
        $(this).show();
        F.ui.relayout();
      })
      .error(function() {
        $(this).hide();
        F.ui.relayout();
      });
  };

  // Cover

  F.ui.showBigCover = function() {
    $el = $('#big-cover');
    $el.html(
      _.template($('#big-cover-template').html(), F.movie.current))
      .css('margin-left', - Math.floor($el.width() / 2))
      .css('margin-top', - Math.floor($el.height() / 2));
    $('#big-cover, #overlay-bg').fadeIn();
  };

  // CURRENT MOVIE

  // if the user updates the current movie we have to rerender sidebar
  // and the grid row
  F.ui.currentMovieChanged = function() {
    F.grid.invalidateRow(F.grid.getSelectedRows()[0]);
    F.grid.render();
    F.ui.renderSidebar(F.movie.current);
  };

})();
