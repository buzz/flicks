module.exports = {
  sass: {
    files: ['app/sass/*.sass'],
    tasks: ['compass:dev']
  },
  livereload: {
    files: ['.tmp/app.css'],
    options: { livereload: true }
  }
};
