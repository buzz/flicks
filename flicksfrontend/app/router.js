define([
  'marionette',
  'controller'
], function(
	Marionette,
	Controller
) {
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      '' : 'index'
    }
  });

  return new Router({
    controller: Controller
  });

});
