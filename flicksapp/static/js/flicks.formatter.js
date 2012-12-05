$(function() {

  var F = $.flicks;

  F.formatter = {

    concatenate: function(row, cell, value, columnDef, dataContext) {
      if (value === undefined)
        return '';
      return $.map(value, function(v) { return v.fields.name }).join(', ');
    },

    seen: function(seen, inner) {
      var title = seen && 'Seen' || 'Not seen';
      var cls = seen && 'yes' || 'no';
      return (inner || '') + '<div title="' + title + '" class="icon seen-' +
        cls + '"></div>';
    },

    imdb: function(value, dataContext, defaultValue) {
      if (value !== undefined) {
        if (defaultValue === undefined) {
          defaultValue = "N/A";
        }
        var text = dataContext.rating || defaultValue;
        return '<a href="http://akas.imdb.com/title/tt' + value
          + '" title="Open IMDb page"' + ' target="_blank">' + text + '</a>';
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
