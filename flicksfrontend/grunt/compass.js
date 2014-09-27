module.exports = {
  // dev is done by compass watch, see shell.js because it's faster
  dist: {
    options: {
      sassDir: 'app/sass',
      cssDir: '.tmp/',
      importPath: 'app/sass',

      environment: 'production',
      cacheDir: '.tmp/sass-cache',
      debugInfo: false,
      sourcemap: false,
      outputStyle: 'expanded', // minified later
      relativeAssets: true,

      imagesDir: 'app/images',
      generatedImagesDir: '.tmp/images',

      httpImagesPath: 'images',
      httpGeneratedImagesPath: 'images'
    }
  }
};
