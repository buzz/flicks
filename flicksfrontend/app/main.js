require.config({
  paths: {
    'jquery':                  '../bower_components/jquery/dist/jquery',
    'lodash':                  '../bower_components/lodash/dist/lodash',
    'sprintf':                 '../bower_components/sprintf/src/sprintf',
    'bootstrap':               '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap',
    'bootstrap-switch':        '../bower_components/bootstrap-switch/dist/js/bootstrap-switch',
    'bootstrap-slider':        '../bower_components/seiyria-bootstrap-slider/js/bootstrap-slider',
    'backbone':                '../bower_components/backbone/backbone',
    'marionette':              '../bower_components/marionette/lib/backbone.marionette',

    // slickgrid
    'slick.core':              '../bower_components/slickgrid/slick.core',
    'slick.rowselectionmodel': '../bower_components/slickgrid/plugins/slick.rowselectionmodel',
    'slick.grid':              '../bower_components/slickgrid/slick.grid',
    'jquery.event.drag':       '../bower_components/slickgrid/lib/jquery.event.drag-2.2',
    'jquery.event.drop':       '../bower_components/slickgrid/lib/jquery.event.drop-2.2'
  },

  map: {
    '*': {
      'underscore': 'lodash'
    }
  },

  shim: {
    'bootstrap': {
      deps: [ 'jquery' ]
    },
    'jquery.ui.sortable': {
      deps: [ 'jquery' ]
    },
    'jquery.event.drag': {
      deps: [ 'jquery' ]
    },
    'jquery.event.drop': {
      deps: [ 'jquery' ]
    },
    'slick.core': {
      deps: [ 'jquery' ]
    },
    'slick.rowselectionmodel': {
      deps: [ 'jquery', 'slick.core' ]
    },
    'slick.grid': {
      deps: [
        'jquery',
        'jquery.event.drag',
        'jquery.event.drop',
        'slick.rowselectionmodel',
        'slick.core'
      ],
      init: function() { return this.Slick; }
    },
    'bootstrap-switch': {
      deps: [ 'jquery' ]
    },
    'bootstrap-slider': {
      deps: [ 'jquery' ]
    }
  }
});

require([
  'app',
  'sprintf',
  'bootstrap',
  'views/behaviors',
], function(
  App,
  sprintf,
  Bootstrap,
  _behaviors
){

  // provide sprintf for String
  String.prototype.format = function() {
    var args = Array.prototype.slice.call(arguments);
    return sprintf.sprintf.apply(null, [this].concat(args));
  };

  Marionette.Behaviors.behaviorsLookup = function() {
    return window.Behaviors;
  };

  App.start();

});
