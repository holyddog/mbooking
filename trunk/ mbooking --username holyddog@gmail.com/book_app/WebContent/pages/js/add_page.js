Page.AddPage = {
	url: 'pages/html/add_page.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_c]').tap(function() {
			Page.back();
		});	
		container.find('[data-id=btn_s]').tap(function() {
			alert('save');
		});
		container.find('[data-id=btn_p]').tap(function() {
			alert('publish');
		});
	}
};