Page.Comments = {
	url: 'pages/html/comments.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});	
	}
};