module.exports = {

  default: [
    'dev'
  ],

  dev: [

    'clean:app_css',
    'fontAwesomeVars:dev',
    'configureProxies',
    'compass:dev',
    'connect:dev',
    'concurrent:devwatch'

  ],

  dist: [

    // prepare
    'clean:app_css',
    'clean:tmp',
    'clean:dist',
    'fontAwesomeVars:dist',

    // copy assets
    'copy:dist',

    // styles
    'compass:dist',
    'cssjoin:dist',
    'cssmin:dist',

    // js
    'requirejs:dist',
    'jst',
    'concat:dist',
    'uglify',

    // index.html
    'targethtml:dist'

  ]
};
