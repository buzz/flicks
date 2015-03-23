module.exports = function(grunt) {

  // sprintf
  var sprintf = require('sprintf-js');
  String.prototype.format = function() {
    var args = Array.prototype.slice.call(arguments);
    return sprintf.sprintf.apply(null, [this].concat(args));
  };

  // put tmp dir in tmpfs
  grunt.task.registerTask('ensureTmp', '', function() {
    if (!grunt.file.exists('/tmp/flicks-build')) {
      grunt.file.mkdir('/tmp/flicks-build');
      grunt.log.ok('Temp directory %s created'.format('/tmp/flicks-build'));
    }

    if (!grunt.file.isLink('.tmp')) {
      require('fs').symlinkSync('/tmp/flicks-build', '.tmp');
      grunt.log.ok('Symlink created: .tmp -> /tmp/flicks-build');
    }
  });

  // auto-load tasks in ./grunt
  require('load-grunt-config')(grunt);

};
