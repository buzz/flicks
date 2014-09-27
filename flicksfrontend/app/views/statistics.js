define([
  'views/modal',
  'chartjs'
], function(
  ModalView,
  Chart
) {

  var WIDTH = 536;
  var WIDTH_SMALL = 331;
  var HEIGHT = 330;

  var StatisticsView = ModalView.extend({

    template:  'modal-statistics',

    // chart definition
    charts: {
      genres: {
        name: 'Genres',
        type: 'doughnut'
      },
      countries: {
        name: 'Countries',
        type: 'doughnut'
      },
      languages: {
        name: 'Languages',
        type: 'doughnut'
      },
      keywords: {
        name: 'Keywords',
        type: 'bar'
      },
      directors: {
        name: 'Directors',
        type: 'bar'
      },
      cast: {
        name: 'Cast',
        type: 'bar'
      },
      producers: {
        name: 'Producers',
        type: 'bar'
      },
      writers: {
        name: 'Writers',
        type: 'bar'
      },
      rating: {
        name: 'Rating',
        type: 'line'
      },
      year: {
        name: 'Year',
        type: 'line'
      },
      added_on: {
        name: 'Added',
        type: 'line'
      },
      imdb_sync_on: {
        name: 'IMDb sync',
        type: 'line'
      },
      runtime: {
        name: 'Runtime',
        type: 'line'
      },
      mpaa: {
        name: 'MPAA',
        type: 'doughnut'
      }
    },

    ui: {
      modal:      '.modal',
      pills_list: '.nav-pills',
      legend:     '.legend'
    },

    _defaultChartOpts: {
      animation: true,
      animationEasing: 'easeOutQuint',
      animationSteps: 50,
      legendTemplate : '<% for (var i=0; i<segments.length; i++){%><span class="badge" style="background-color:<%=segments[i].fillColor%>"><%if(segments[i].label){%><%=segments[i].label%><%}%></span><%}%>',
      // doughnut
      percentageInnerCutout: 25,
      // bar
      barValueSpacing: 1,
      barStrokeWidth: 1,
      // line
      pointDot: true,
      pointDotRadius : 2,
      bezierCurve : true,
      pointHitDetectionRadius: 2
    },

    _defaultBarOpts: {
      strokeColor:      'rgba(66, 139, 202, 1.0)',
      fillColor:        'rgba(66, 139, 202, 0.5)',
      highlightStroke:  'rgba(66, 139, 202, 0.9)',
      highlightFill:    'rgba(66, 139, 202, 0.4)'
    },

    _defaultLineOpts: {
      strokeColor:      'rgba(66, 139, 202, 1.0)',
      fillColor:        'rgba(66, 139, 202, 0.5)'
    },

    _defaultDoughnutOpts: {
      color:            'rgba(66, 139, 202, 1.0)',
      highlight:        'rgba(66, 139, 202, 0.9)'
    },

    // for pie charts: [NORMAL, HIGHLIGHT]
    _barColors: [
      ['#ef4557', '#f37481'],
      ['#ef6645', '#f38d74'],
      ['#ef9945', '#f3b374'],
      ['#efcc45', '#f3d974'],
      ['#dfef45', '#e7f374'],
      ['#acef45', '#c1f374'],
      ['#79ef45', '#9bf374'],
      ['#46ef45', '#75f374'],
      ['#45ef77', '#74f399'],
      ['#45efaa', '#74f3bf'],
      ['#45efdd', '#74f3e6'],
      ['#45ceef', '#74daf3'],
      ['#459bef', '#74b4f3'],
      ['#4568ef', '#748ef3'],
      ['#5545ef', '#8074f3'],
      ['#8845ef', '#a674f3'],
      ['#bb45ef', '#cc74f3'],
      ['#ee45ef', '#f274f3'],
      ['#ef45bd', '#f374ce'],
      ['#ef458a', '#f374a8']
    ],

    initialize: function() {
      ModalView.prototype.initialize.apply(this, arguments);
      if (_.isUndefined(App._statsCache))
        App._statsCache = {};
    },

    onRender: function() {
      var that = this, i = 0, first;
      // create chart buttons and callbacks
      _.each(this.charts, function(v, key) {
        if (i === 0)
          first = key;
        that.ui.pills_list.append(
          '<li class="%s"><a class="btn-%s" href="#">%s</a></li>'.format(
            i++ === 0 ? 'active' : '', key, v.name));
        var $a = that.ui.pills_list.find('a[class=btn-%s]'.format(key));
        $a.on('click', function(evt) {
          evt.preventDefault();
          var $parent = $(evt.target).parent();
          if ($parent.hasClass('active'))
            return;
          that.ui.pills_list.find('li').removeClass('active');
          $parent.addClass('active');
          that._renderChart(key, v.type);
        });
      });
      // render first chart
      if (!_.isUndefined(first))
        this._renderChart(first, this.charts[first].type);
    },

    onBeforeDestroy: function() {
      this.ui.pills_list.find('a').off('click');
    },

    _destroyChart: function() {
      if (this._graph) {
        this._graph.destroy();
        this.$('canvas').remove();
      }
    },

    _renderChart: function(key, chartType) {
      var that = this;
      function createChart(data) {
        that._destroyChart();
        var func, w = chartType === 'doughnut' ? WIDTH_SMALL : WIDTH;
        that.$('.panel-body').append(
          '<canvas width="%d" height="%d" class="chart"></canvas>'.format(
            w, HEIGHT));
        that._chart = new Chart(that.$('canvas').get(0).getContext('2d'));
        if (chartType === 'doughnut')
          that._doughnutChart(data);
        else if (chartType === 'line')
          that._lineChart(data);
        else if (chartType === 'bar')
          that._barChart(data);
        else
          throw('Undefined chart type: %s'.format(chartType));
      }
      // Cache hit or remote fetch
      if (key in App._statsCache)
        createChart(App._statsCache[key]);
      else
        $.ajax({
          url: '/stats/%s/'.format(key),
          success: function(data) {
            App._statsCache[key] = data;
            createChart(data);
          }
        });
    },

    _doughnutChart: function(data) {
      var that = this, i = 0;
      // prepare options and colors
      _.each(data, function(dataset) {
        _.extend(dataset, that._defaultDoughnutOpts);
        var c = that._barColors[i++ % that._barColors.length];
        dataset.color = c[0];
        dataset.highlight = c[1];
      });
      this._graph = this._chart.Doughnut(data, this._defaultChartOpts);
      this.ui.legend.html(this._graph.generateLegend());
    },

    _lineChart: function(data) {
      var that = this;
      // prepare options
      _.each(data.datasets, function(dataset) {
        _.extend(dataset, that._defaultLineOpts);
      });
      this._graph = this._chart.Line(data, this._defaultChartOpts);
      this.ui.legend.html('');
    },

    _barChart: function(data) {
      var that = this;
      // prepare options
      _.each(data.datasets, function(dataset) {
        _.extend(dataset, that._defaultBarOpts);
      });
      this._graph = this._chart.Bar(data, this._defaultChartOpts);
      this.ui.legend.html('');
    }

  });

  return StatisticsView;

});
