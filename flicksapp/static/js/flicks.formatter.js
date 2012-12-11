$(function() {

  var F = $.flicks;

  F.formatter = {

    concatenate: function(value, max) {
      var r = '', _max;
      if (max === undefined)
        _max = value.length;
      else
        _max = Math.min(max, value.length);
      for (var i = 0; i < _max; ++i) {
        r += value[i].fields.name;
        if (i >= 0 && i < _max - 1)
          r += ', ';
      }
      if (max !== undefined && value.length > max)
        r += ', …';
      return r;
    },

    concatenateA: function(value, cls, max) {
      var r = '', _max;
      if (max === undefined)
        _max = value.length;
      else
        _max = Math.min(max, value.length);
      if (cls === undefined)
        cls = '';
      for (var i = 0; i < _max; ++i) {
        r += '<a href="#" class="' + cls + '">' + value[i].fields.name + '</a>';
        if (i >= 0 && i < _max - 1)
          r += ', ';
      }
      if (max !== undefined && value.length > max)
        r += ', …';
      return r;
    },

    number_seen_fav: function(dataContext, inner) {
      var title, cls;
      if (dataContext.favourite) {
        title = "Favourite";
        cls = "fav";
      } else if (dataContext.seen) {
        title = "Seen";
        cls = "seen-yes";
      } else {
        title = "Not seen";
        cls = "seen-no";
      }
      return (inner || '') + '<div title="' + title + '" class="icon ' +
        cls + '"></div>';
    },

    imdb: function(value, dataContext, defaultValue) {
      if (value !== undefined) {
        if (defaultValue === undefined) {
          defaultValue = "N/A";
        }
        var text = dataContext.rating || defaultValue;
        return '<a href="http://akas.imdb.com/title/tt' + value
          + '" title="Open IMDb page"' + ' target="_blank" class="imdb">'
          + text + '</a>';
      }
      return '';
    },

    flagList: function(countries) {
      var html = "";
      if (countries !== undefined) {
        $.each(countries, function(i) {
          html += '<div title="' + this.fields.name + '" class="flag '
            + $.flicks.str2iso(this.fields.name) + '"></div>';
        });
      }
      return html;
    },

    plot: function(raw_plot) {
      var html = "";
      var plot = raw_plot.split("::");
      if (plot.length > 1) {
        html += plot[0];
        html += '<p class="author">' + plot[1] + '</p>';
      }
      return html;
    },

  };

});
