module.exports = {
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
