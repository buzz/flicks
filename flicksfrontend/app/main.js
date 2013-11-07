require.config({
  paths: {
    'jquery':                  '../lib/jquery/jquery-2.0.3',
    'jquery.ui.sortable':      '../lib/jquery/jquery-ui-1.10.3.sortable',
    'jquery.event.drag':       '../lib/jquery/jquery.event.drag-2.2',
    'jquery.event.drop':       '../lib/jquery/jquery.event.drop-2.2',
    'lodash':                  '../lib/underscore/lodash-2.2.1',
    'underscore.string':       '../lib/underscore/underscore.string-2.3.2',
    'bootstrap':               '../lib/bootstrap-3.0.1/js/bootstrap',
    'backbone':                '../lib/backbone/backbone-1.1.0',
    'marionette':              '../lib/backbone/backbone.marionette-1.2.0',
    'backbone.wreqr':          '../lib/backbone/backbone.wreqr',
    'backbone.babysitter':     '../lib/backbone/backbone.babysitter',
    'slick.core':              '../lib/slickgrid/slick.core',
    'slick.rowselectionmodel': '../lib/slickgrid/slick.rowselectionmodel',
    'slick.grid':              '../lib/slickgrid/slick.grid'
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
        'jquery.ui.sortable',
        'jquery.event.drag',
        'jquery.event.drop',
        'slick.rowselectionmodel',
        'slick.core'
      ],
      init: function() { return this.Slick; }
    }
  }
});

require([
  'app',
  'bootstrap',
  'underscore.string'
], function(
  App,
  Bootstrap,
  underscore_string
){

  // provide sprintf for String
  String.prototype.format = function() {
    var args = Array.prototype.slice.call(arguments);
    return underscore_string.sprintf.apply(null, [this].concat(args));
  };

  App.start();

});
