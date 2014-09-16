var
  _ = require('lodash')
  proxy_snippet = require('grunt-connect-proxy/lib/utils').proxyRequest,
  proxies = [
    'director',
    'cast',
    'genre',
    'keyword',
    'country',
    'language',
    'movies',
    'movie',
    'index-by-id',
    'imdb-search',
    'imdb-import',
    'imdb-cover-import'
  ];

module.exports = {
  options: {
    port: 7000,
    hostname: '127.0.0.1'
  },
  dev: {
    options: {
      middleware: function(connect, options) {
        return [
          connect.static(options.base[0]),
          connect.directory(options.base[0]),
          proxy_snippet
        ];
      },
      livereload: true
    }
  },
  proxies: _.map(proxies, function(dir) {
    return {
      context: '/' + dir,
      host: 'localhost',
      port: 8000,
      https: false,
      changeOrigin: true
    };
  })
};
