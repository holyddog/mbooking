Page.AddTag = {
	url: 'pages/html/search.html',
	init: function(params, container) {		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
	}
};