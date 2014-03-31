Page.Explore = {
	url: 'pages/html/explore.html',
	init: function(params, container) {
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
	}
};