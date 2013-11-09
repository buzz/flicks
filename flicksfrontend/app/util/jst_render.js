define([], function() {
  /*
   * The following will make Marionette's template retrieval work with
   * in both development (templates found in html files) and production
   * environment (templates all compiled AS JST templates into the require.js
   * file. This will also use JST instead of the Marionette.TemplateCache.
   */
  function jstRender(templateId, data) {
    if (typeof templateId == 'function')
      return templateId(data);

    var path = 'app/templates/' + templateId + '.html';

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};

    // Make a blocking ajax call (does not reduce performance in production,
    // because templates will be contained by the require.js file).
    if (!JST[path]) {
      $.ajax({
        url: App.root + path,
        async: false
      }).then(function(templateHtml) {
        JST[path] = _.template(templateHtml);
        JST[path].__compiled__ = true;
      });
    }

    if (!JST[path]) {
      var msg = 'Could not find "' + templateId + '"';
      var error = new Error(msg);
      error.name = 'NoTemplateError';
      throw error;
    }

    return JST[path](data);
  }

  return jstRender;
});
