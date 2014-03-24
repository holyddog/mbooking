Page.MyBooks = {
	url: 'pages/html/my_books.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		container.find('[data-id=btn_e]').tap(function() {
			alert('edit');
		});
		container.find('[data-id=btn_a]').tap(function() {			
			Page.open('AddPage', true);
		});
		
		// set content link
		container.find('[data-id=link_book]').tap(function() {
			Page.open('Book', true);
		});
	}
};