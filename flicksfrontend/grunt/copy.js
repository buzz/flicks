module.exports = {
  dist: {
    files: [
      {
        expand: true,
        cwd: 'app/style/images',
        src: './**',
        dest: 'dist/static/images/'
      },
      {
        expand: true,
        cwd: 'bower_components/font-awesome/fonts/',
        src: 'fontawesome-webfont.{eot,woff,ttf}',
        dest: 'dist/static/fonts/'
      },
    ]
  }
};
