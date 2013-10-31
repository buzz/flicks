define([
	'marionette'
], function(
	Marionette
) {

	var DetailsView = Marionette.ItemView.extend({
		template: 'details',
		id: 'details',

		events: {
			'click .dismiss button': 'dismiss',
			'click .cover-image': 'enlargeCover'
		},

		onRender: function() {
			this.$('.enable-tooltip').tooltip(App.tooltipDefaults);
			this.$('.enable-tooltip-top').tooltip(
				_.extend(_.clone(App.tooltipDefaults), { placement: 'top' })
			);
		},

		dismiss: function() {
			this.$('.enable-tooltip, .enable-tooltip-top').tooltip('destroy');
			App.router.navigate('', { trigger: true });
			this.close();
		},

		enlargeCover: function() {
			// TODO fullsize!
			return false;
		}

	});

	return DetailsView;

});
