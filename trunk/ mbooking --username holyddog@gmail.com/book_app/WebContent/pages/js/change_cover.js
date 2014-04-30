Page.ChangeCover = {
	url: 'pages/html/change_cover.html',
	init: function(params, container) {		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});	
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			alert('accept');
		});
		
		var bookPanel = container.find('.book_panel');
		var pages = Page.EditBook.bookPages;
		for (var i = 0; i < pages.length; i++) {
//			<div class="book_size" style="background-color: #FF4444; background-image: url(temp/cv1.jpg);"></div>
			var p = pages[i];
			var pageDiv = document.createElement('div');
			pageDiv.dataset.pid = p.pid;
			pageDiv.className = 'book_size cover';
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