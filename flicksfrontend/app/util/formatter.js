define([
  'util/str2iso'
], function(
  str2iso
) {

  var formatter = {

    concatenate: function(value, max) {
      var r = '', _max;
      if (max === undefined)
        _max = value.length;
      else
        _max = Math.min(max, value.length);
      for (var i = 0; i < _max; ++i) {
        r += value[i];
        if (i >= 0 && i < _max - 1)
          r += ', ';
      }
      if (max !== undefined && value.length > max)
        r += ', …';
      return r;
    },

    // comma-separated, wrapped in anchor tags
    concatenateA: function(value, cls, max) {
      var r = '', _max;
      if (max === undefined)
        _max = value.length;
      else
        _max = Math.min(max, value.length);
      if (cls === undefined)
        cls = '';
      for (var i = 0; i < _max; ++i) {
        r += '<a href="#" class="' + cls + '">' + value[i] + '</a>';
        if (i >= 0 && i < _max - 1)
          r += ', ';
      }
      if (max !== undefined && value.length > max)
        r += ', …';
      return r;
    },

    number_seen_fav: function(dataContext, inner) {
      var title, cls;
      if (dataContext.seen) {
        title = 'Seen';
        cls = 'fa-eye seen';
      } else {
        title = 'Not seen';
        cls = 'fa-eye not-seen';
      }
      if (dataContext.favourite) {
        title = 'Favourite';
        cls = 'fa-star fav';
      }
      return '<i class="fa %s enable-tooltip"title="%s"></i> <span class="number%s">%s</span>'.format(cls, title, dataContext.trumpable ? ' trumpable' : '', inner || '');
    },

    flagList: function(countries) {
      var html = '';
      if (countries !== undefined) {
        $.each(countries, function(i) {
          html += '<div title="%s" class="flag flag-%s enable-tooltip"></div>'.format(
            this, str2iso(this));
        });
      }
      return html;
    },

    plot: function(raw_plot) {
      var html = '';
      var plot = raw_plot.split('::');
      if (plot.length > 1) {
        html += plot[0];
        html += '<p class="author">' + plot[1] + '</p>';
      }
      return html;
    },

    aka: function(raw_aka) {
      var html = '';
      var aka = raw_aka.split('::');
      if (aka.length > 1) {
        html += '<span class="aka-title">%s</span>'.format(aka[0]);
        html += '<br /><span class="aka-country">' + aka[1] + '</span>';
        return html;
      }
      return raw_aka;
    }

  };

  return formatter;

});
