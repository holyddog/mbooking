Page.EditBook = {	
	url: 'pages/html/edit_book.html',
	init: function(params, container, append) {	
		var self = this;
		var bid = (params)? params.bid: undefined;
		
		// set toolbar buttons
		var btnBack = container.find('[data-id=btn_b]');
		btnBack.tap(function() {
			history.back();
		});
		
		var btnPub = container.find('[data-id=btn_pub]');
		btnPub.tap(function() {
			if (!btnPub.hasClass('unpub')) {
				Page.showLoading('Publishing...');
				
				var img = container.find('.book_size').css('background-image');
				img = img.replace('url(' + Config.FILE_URL, '').replace(')', '').replace('_s', '');
				Service.Book.PublishBook(bid, Account.userId, img, function(data) {
					Page.hideLoading();
				});
			}
			else {
				Page.showLoading('Updating...');
				
				Service.Book.UnpublishBook(bid, Account.userId, function(data) {
					Page.hideLoading();
				});				
			}
		});
		
		var w = Math.floor((book_header.offsetWidth / 2) - 15);
		var h = Math.floor((w * 4) / 3);
		container.find('.book_size').css({
			width: w + 'px',
			height: h + 'px'
		});
		self.reScale(container);
		
		container.find('[data-id=link_a]').click(function() {
			Page.open('AddPage', true, { bid: bid });
		});
		
		container.find('.tab_page a').click(function() {
			container.find('.tab_page a').removeClass('active');
			
			var link = $(this);
			link.addClass('active');
			
			container.find('.page_ref').hide();
			container.find('#' + link.data('ref')).show();
		});
		
		var btnCheck = container.find('[data-id=btn_c]'); 
		btnCheck.tap(function() {
			btnCheck.toggleClass('check');
		});
		
		container.find('[data-link=edit_book]').click(function() {
			Page.open('CreateBook', true, { bid: bid });
		});
		container.find('[data-link=preview]').click(function() {
			Page.open('Book', true, { bid: bid, uid: Account.userId, preview: true });
		});
		container.find('[data-link=chg_cover]').click(function() {
			Page.open('ChangeCover', true);
		});
		
		if (bid) {
			Service.Book.GetBook(bid, Account.userId, function(data) { 
				self.updateBook(container, data.title, data.desc);
				container.find('.pcount span').text(data.pcount);
				container.find('.book_size').css('background-image', 'url(' + Util.getImage(data.pic, 2) + ')');
				
				btnPub.show();
				if (data.pbdate) {
					btnPub.addClass('unpub');
					btnPub.text('UNPUBLISH');
				}
				
				self.bookPages = data.pages;
				for (var i = 0; i < self.bookPages.length; i++) {
					self.addPage(container, self.bookPages[i]);
				}
				self.reScale(container);
			});
		}
		
//		if (params.bg && params.title) {
//			container.find('.book_size').css('background-image', params.bg);
//			container.find('.book_size h2').text(params.title);
//		}
	},
	
	bookPages: [],
	
	updateBook: function(container, title, desc) {
		container.find('.book_title').text(title);
		container.find('.book_det .desc').text(desc);
	},
	
	reScale: function(container) {
		var w = Math.floor((book_header.offsetWidth / 2) - 15);
		container.find('.page_size').css({
			width: w + 'px',
			height: w + 'px'			
		});
	},
	
	addPage: function(container, data) {
		var w = Math.floor((book_header.offsetWidth / 2) - 15);
		
		var div = document.createElement('div');
		div.className = 'page_size';
		div.dataset.pid = data.pid;
		div.style.backgroundImage = 'url(' + Util.getImage(data.pic, 2) + ')';
		div.style.width = w + 'px';
		div.style.height = w + 'px';
		container.find('#book_panel').append(div);
	}
};