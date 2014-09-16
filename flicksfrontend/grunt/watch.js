module.exports = {
  options: { spawn: false },
  sass: {
    files: ['app/style/sass/*.sass'],
    tasks: ['compass:dev']
  },
  livereload: {
    files: ['app/style/app.css'],
    options: { livereload: true }
  }
};
