Page.AddPage = {
	url: 'pages/html/add_page.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});	
		container.find('[data-id=btn_s]').tap(function() {
			alert('save');
		});
	}
};