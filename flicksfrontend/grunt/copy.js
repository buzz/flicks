module.exports = {
  dist: {
    files: [
      {
        expand: true,
        cwd:  'app/images',
        src:  './*',
        dest: 'dist/static/images/',
        filter: 'isFile'
      },
      {
        expand: true,
        cwd:  '.tmp/images',
        src:  './*.png',
        dest: 'dist/static/images/'
      },
      {
        expand: true,
        cwd: 'bower_components/font-awesome/fonts/',
        src: 'fontawesome-webfont.{eot,woff,ttf}',
        dest: 'dist/static/fonts/'
      }
    ]
  }
};
