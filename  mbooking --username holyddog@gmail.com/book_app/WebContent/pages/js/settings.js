Page.Settings = {
	url: 'pages/html/settings.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
	}
};