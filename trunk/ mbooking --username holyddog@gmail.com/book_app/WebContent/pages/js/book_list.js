Page.BookList = {
	url: 'pages/html/book_list.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		container.find('[data-id=btn_c]').tap(function() {		
			Page.open('CreateBook', true);
		});
		container.find('[data-id=btn_a]').tap(function() {			
			Page.open('AddPage', true);
		});
		
		// set content links
		container.find('.item').tap(function() {
			var item = $(this);
			var src = item.find('.bimage img').attr('src');
			var title = item.find('.btitle span').text();
			
			Page.back(function(c) {
				var selBook = c.find('.sel_book');
				selBook.find('.bimage img').attr('src', src);
				selBook.find('.btitle span').text(title);
			});
		}, true);
	}
};