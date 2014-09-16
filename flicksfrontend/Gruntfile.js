module.exports = function(grunt) {

  // proxy configuration
  grunt.option('proxies', [
    'director',
    'cast',
    'genre',
    'keyword',
    'country',
    'language',
    'movies',
    'movie',
    'index-by-id',
    'imdb-search',
    'imdb-import',
    'imdb-cover-import'
  ]);

  // sprintf
  var sprintf = require('sprintf-js');
  String.prototype.format = function() {
    var args = Array.prototype.slice.call(arguments);
    return sprintf.sprintf.apply(null, [this].concat(args));
  };

  // put tmp dir in tmpfs
  if (!grunt.file.exists('/tmp/flicks-build')) {
    grunt.file.mkdir('/tmp/flicks-build');
    grunt.log.ok('Temp directory %s created'.format('/tmp/flicks-build'));
  }
  if (!grunt.file.exists('.tmp')) {
    var fs = require('fs');
    fs.symlinkSync('/tmp/flicks-build', '.tmp');
    grunt.log.ok('Local directory %s linked to /tmp/flicks'.format(
      '.tmp', '/tmp/flicks-build'));
  }

  // auto-load tasks in ./grunt
  require('load-grunt-config')(grunt);

};
