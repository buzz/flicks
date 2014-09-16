module.exports = {
  options: {
    sassDir: 'app/style/sass',
    cssDir: 'app/style',
    imagesDir: 'app/style/images',
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
