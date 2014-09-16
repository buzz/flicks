module.exports = {
  options: {
    logConcurrentOutput: true
  },
  devwatch: {
    tasks: [
      'watch:sass',
      'watch:livereload'
    ]
  }
};
