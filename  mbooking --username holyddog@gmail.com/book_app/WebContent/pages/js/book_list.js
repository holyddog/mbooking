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
		
		// load data
		this.load(container);
	},
	
	load: function(container) {
		Service.Book.GetBooksByUid(Account.userId, function(data) {		
			var c = container.find('.container');
			c.empty();
			
			for (var i = 0; i < data.length; i++) {
				var b = data[i];
				
				var itemDiv = $(document.createElement('div'));
				itemDiv.data('bid', b.bid);
				itemDiv.addClass('sel_book item box horizontal');
				
				var bImage = $(document.createElement('div'));
				bImage.addClass('bimage');
				var img = $(document.createElement('img'));
				img.attr('src', '');
				bImage.append(img);
				itemDiv.append(bImage);
				
				var bTitle = $(document.createElement('div'));
				bTitle.addClass('btitle flex1 box');
				var span = $(document.createElement('span'));
				span.text(b.title);
				bTitle.append(span);
				itemDiv.append(bTitle);
				
				c.append(itemDiv);
			}
			
			// set content links
			container.find('.item').tap(function() {
				var item = $(this);
				var bid = item.data('bid');
				var src = item.find('.bimage img').attr('src');
				var title = item.find('.btitle span').text();
				
				Page.back(function(c) {
					var selBook = c.find('.sel_book');
					selBook.data('bid', bid);
					selBook.find('.bimage img').attr('src', src);
					selBook.find('.btitle span').text(title);
				});
			}, true);
		});
	}
};