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
		Service.Book.GetBooksByUid(Account.userId, 0, Config.LIMIT_ITEM, function(data) {		
			var c = container.find('.container');
			c.empty();
			
			for (var i = 0; i < data.length; i++) {
				var b = data[i];
				
				var itemDiv = $(document.createElement('div'));
				itemDiv.data('bid', b.bid);
				itemDiv.data('pcount', (b.pcount)? b.pcount: 0);
				itemDiv.addClass('sel_book item box horizontal');
				
				var bImage = $(document.createElement('div'));
				bImage.addClass('bimage');
				var img = $(document.createElement('img'));
				if (b.pic) {
					img.attr('src', Config.FILE_URL + Util.getImage(b.pic, Config.FILE_SIZE.COVER));
				}
				else {
					img.attr('src', 'images/photo.jpg');
				}
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
			container.find('.item').click(function() {
				var item = $(this);
				var bid = item.data('bid');
				var src = item.find('.bimage img').attr('src');
				var title = item.find('.btitle span').text();
				var pcount = item.data('pcount');
				
				Page.back(function(c) {
					var selBook = c.find('.sel_book');
					selBook.data('bid', bid);
					if (src) {
						selBook.find('.bimage img').attr('src', src);
					}
					else {
						selBook.find('.bimage img').attr('src', 'images/photo.jpg');
					}
					selBook.find('.btitle span').text(title);
					if (pcount) {
						document.getElementById('bottom_panel').style.display = 'block';
					}
					else {
						document.getElementById('bottom_panel').style.display = 'none';
					}
				});
			});
		});
	}
};