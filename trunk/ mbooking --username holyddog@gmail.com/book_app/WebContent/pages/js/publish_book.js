Page.PublishBook = {
	url: 'pages/html/publish_book.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
		});
		
		// set content links
	}
};