module.exports = {

   options: {
    sassDir: 'app/sass',
    cssDir: '.tmp/',
    importPath: 'app/sass',
    imagesDir: 'app/images',
    generatedImagesDir: '.tmp/images',
    cacheDir: '.tmp/sass-cache'
   },

   dev: {
     options: {
       environment: 'development',
       debugInfo: true,
       sourcemap: true,
       httpImagesPath: '/app/images',
       httpGeneratedImagesPath: '/.tmp/images'
     }
   },

   dist: {
     options: {
       environment: 'production',
       debugInfo: false,
       sourcemap: false,
       httpImagesPath: 'images',
       httpGeneratedImagesPath: 'images',
       outputStyle: 'expanded' // minified later
     }
   }

};
