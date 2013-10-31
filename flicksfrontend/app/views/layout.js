define([
	'marionette'
], function(
	Marionette
) {

	var AppLayout = Marionette.Layout.extend({
		id: 'main-layout',
		template: 'layout',

		regions: {
			toolbar: '#toolbar',
			movies:  '#movies',
			sidebar: '#sidebar'
		},

		initialize: function() {
			this.listenTo(
				App.state, 'change:selected_movie_id', this.movieSelect, this);
			this.listenTo(
				App.movie_collection, 'dataloading', this.updateSpinner, this);
			this.listenTo(
				App.movie_collection, 'dataloaded', this.updateSpinner, this);
		},

		updateSpinner: function(args) {
			var $el = this.$('#spinner');
			if (args.request_count < 1)
				$el.fadeOut();
			else
				$el.fadeIn();
		},

		movieSelect: function(model, value) {
			var $s = this.$('#sidebar');
			var func = value ? 'removeClass' : 'addClass';
			$s[func]('collapsed');
		}

	});

	return AppLayout;

});
