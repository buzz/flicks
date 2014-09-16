module.exports = {
  app_css: [
    'app/style/app.css'
  ],
  tmp: {
    src: [ '.tmp/*' ],
    options: {
      force: true // del files outside of CWD
    }
  },
  dist: [
    'dist'
  ]
};
