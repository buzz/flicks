module.exports = {
  options: {
    logConcurrentOutput: true
  },
  devwatch: {
    tasks: [
      'watch:livereload',
      'shell:compassWatch'
    ]
  }
};
