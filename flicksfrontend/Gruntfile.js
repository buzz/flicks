var proxy_snippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-cssjoin');
  grunt.loadNpmTasks('grunt-targethtml');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bg-shell');

  grunt.registerTask('default', ['dist']);

  grunt.registerTask('dev', [
    'clean:tmp',
    'configureProxies',
    'connect:dev',
    'bgShell:compasswatch',
    'watch:livereloadstyles'
  ]);

  grunt.registerTask('dist', [
    // prepare
    'clean:dist-tmp',
    'clean:dist',

    // copy assets
    'copy:dist',

    // styles
    'compass:dist',
    'cssjoin:dist',
    'cssmin',

    // js
    'requirejs:dist',
    'jst',
    'concat:dist',
    'uglify',

    // index.html
    'targethtml:dist',

    // clean
    'clean:dist-tmp'
  ]);

  grunt.initConfig({

    // The clean task ensures all files are removed from the dist/ directory so
    // that no files linger from previous builds.
    clean: {
      tmp: [
        'app/style/app.css',
        'app/style/.sass-cache',
        '.sass-cache',
      ],
      'dist-tmp': ['tmp'],
      dist: ['dist']
    },

    // The jst task compiles all application templates into JavaScript
    // functions with the underscore.js template function
    jst: {
      'tmp/templates_compiled.js': [
        'app/templates/*.html'
      ]
    },

    // The concatenate task is used here to merge the almond
    // require/define shim and the templates into the application
    // code. We want to only load one script file in index.html.
    concat: {
      dist: {
        src: [
          'lib/almond.js',
          'tmp/templates_compiled.js',
          'tmp/flicks.js'
        ],
        dest: 'tmp/concat.js',
        separator: ';'
      }
    },

    // watch sass files
    watch: {
      options: {
        livereload: true
      },
      livereloadstyles: {
        files: ['app/style/app.css']
      },
      scripts: {
        files: ['app/**/*.js'],
        tasks: ['jshint']
      }
    },

    // jshint
    jshint: {
      all: ['app/**/*.js']
    },

    // compile sass
    compass: {
      dist: {
        options: {
          sassDir: 'app/style/sass',
          cssDir: 'tmp/',
          httpImagesPath: 'images',
          imagesDir: 'app/style/images',
          importPath: 'app/style/sass'
        }
      }
    },

    // index.html to dist
    targethtml: {
      dist: {
        files: {
          'dist/index.html': 'index.html'
        }
      }
    },

    // joins @include
    cssjoin: {
      dist: {
        files: {
          'tmp/flicks.css': 'app/style/index.css'
        }
      }
    },

    // Builds optimized require.js including all dependencies
    // https://github.com/gruntjs/grunt-contrib-requirejs
    requirejs: {
      dist: {
        options: {
          mainConfigFile: 'app/main.js',
          out: 'tmp/flicks.js',
          name: 'main',
          optimize: 'none'
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/flicks.js': ['tmp/concat.js']
        }
      }
    },

    cssmin: {
      dist: {
        src: 'tmp/flicks.css',
        dest: 'dist/flicks.css'
      }
    },

    // copy some files
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'app/style/images',
            src: './**',
            dest: 'dist/images/'
          },
          {
            expand: true,
            cwd: 'lib/font-awesome-4.0.3/fonts/',
            src: 'fontawesome-webfont.{eot,woff,ttf}',
            dest: 'dist/fonts/'
          },
        ]
      }
    },

    // dev server
    connect: {
      options: {
        port: 7000,
        hostname: '0.0.0.0'
      },
      dev: {
        options: {
          middleware: function(connect, options) {
            return [
              connect.static(options.base),
              connect.directory(options.base),
              proxy_snippet
            ];
          }
        }
      },
      proxies: [
        {
          context: '/movies',
          host: 'localhost',
          port: 8000,
          https: false,
          changeOrigin: true
        },
        {
          context: '/movie',
          host: 'localhost',
          port: 8000,
          https: false,
          changeOrigin: true
        }
      ]
    },

    bgShell: {
      compasswatch: {
        cmd: 'sh compass-all.sh',
        stdout: true,
        bg: true
      },
      compasscompile: {
        cmd: 'sh compass-all.sh compile',
        stdout: true,
        bg: false
      }
    }

  });

};
