module.exports = {
  options: {
    sassDir: 'app/style/sass',
    cssDir: 'app/style',
    imagesDir: 'app/style/images',
    fontsDir: 'bower_components/font-awesome/scss/font-awesome/fonts',
    importPath: 'app/style/sass',
    cacheDir: '.tmp/sass-cache'
  },
  dev: {
    options: {
      environment: 'development'
    }
  },
  dist: {
    options: {
      environment: 'production'
    }
  }
};
