Page.Following = {
	url: 'pages/html/following.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
	}
};