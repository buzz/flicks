module.exports = {
  dist: {
    src: [
      'bower_components/almond/almond.js',
      '.tmp/templates_compiled.js',
      '.tmp/flicks.js'
    ],
    dest: '.tmp/concat.js',
    separator: ';'
  }
};
