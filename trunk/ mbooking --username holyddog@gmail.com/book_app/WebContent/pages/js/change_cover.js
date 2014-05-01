Page.ChangeCover = {
	url: 'pages/html/change_cover.html',
	init: function(params, container) {
		var bid = (params)? params.bid: undefined;
		var cover = (params)? params.cover: undefined;
		cover = cover.replace(Config.FILE_URL, '');
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});	
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			Page.btnShowLoading(btnAccept[0]);
			
			var newCover = container.find('.book_size.selected').css('background-image');
			newCover = newCover.replace('url(' + Config.FILE_URL, '').replace(')', '').replace('_s', '');
			
			Service.Book.ChangeCover(bid, newCover, function(data) {
				Page.btnHideLoading(btnAccept[0]);
				
				Page.back(function(c) {
					c.find('.book_size').css('background-image', 'url(' + Util.getImage(newCover, 2) + ')');
				});
			});
		});
		
		var bookPanel = container.find('.book_panel');
		var pages = Page.EditBook.bookPages;
		for (var i = 0; i < pages.length; i++) {
			var p = pages[i];
			var pageDiv = document.createElement('div');
			pageDiv.dataset.pid = p.pid;
			var className = 'book_size cover';
			if (cover == p.pic) {
				className += ' selected';
			}
			pageDiv.className = className;
			pageDiv.style.backgroundImage = 'url(' + Util.getImage(p.pic, 2) +')';
			
			var icon = document.createElement('div');
			icon.className = 'sel_icon';			
			pageDiv.appendChild(icon);
			
			bookPanel.append(pageDiv);
		}
		
		var w = (bookPanel[0].offsetWidth / 2) - 15;
		var h = (w * 4) / 3;
		var books = container.find('.book_size');
		books.css({
			width: w + 'px',
			height: h + 'px'
		});
		
		books.click(function() {
			books.removeClass('selected');
			$(this).addClass('selected');
		});
	}
};