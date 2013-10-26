define([
	'marionette'
], function(
	Marionette
) {

	var ToolbarView = Marionette.ItemView.extend({
		template: 'toolbar',
		className: 'navbar navbar-fixed-top',
		onRender: function() {
			this.$('.view-toggle > button, button.clear-search').tooltip({
				container: 'body',
				placement: 'bottom',
				delay: {
					show: 500,
					hide: 100
				}
			})
		}
	});

	return ToolbarView;

});
