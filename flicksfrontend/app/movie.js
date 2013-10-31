define([
	'backbone'
], function(
	Backbone
) {

	var Movie = Backbone.Model.extend({
		urlRoot: '/movie/',
		url: function() {
			return '%s%s/'.format(this.urlRoot, this.id)
		}
	});

	return Movie;

});
