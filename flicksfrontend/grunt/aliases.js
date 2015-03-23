module.exports = {

  default: [ 'dev' ],

  dev: [

    'ensureTmp',
    'fontAwesomeVars:dev',
    'configureProxies',
    'connect:dev',
    'copy:dev',
    'concurrent:devwatch'

  ],

  dist: [

    // prepare
    'ensureTmp',
    'clean:tmp',
    'clean:dist',
    'fontAwesomeVars:dist',

    // styles
    'compass:dist',
    'cssjoin:dist',
    'cssmin:dist',

    // copy assets
    'copy:dist',

    // js
    'requirejs:dist',
    'jst',
    'concat:dist',
    'uglify',

    // index.html
    'targethtml:dist'

  ]
};
