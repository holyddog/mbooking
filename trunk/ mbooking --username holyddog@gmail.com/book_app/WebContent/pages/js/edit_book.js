Page.EditBook = {	
	url: 'pages/html/edit_book.html',
	bid: null,
	init: function(params, container, append) {	
		var self = this;
		var bid = (params)? params.bid: undefined;
		this.bid = bid;		
		container.css('z-index','1001');
		
		// set toolbar buttons
		var btnBack = container.find('[data-id=btn_b]');
		btnBack.tap(function() {
			Page.back(function(c, page) {
				if(page.reverseIndex){
					page.reverseIndex(c);
				}
			});
		});
		
		var updateAccount = function(u) {
			if (u) {
				Account.cover = u.cover;
				Account.bookCount = u.pbcount;
				Account.draftCount = u.drcount;
				
				localStorage.setItem('u', JSON.stringify(Account));
				
				Page.Profile.updateCover();
			}
		};
		
//		var book = null;
		var btnPub = container.find('[data-id=btn_pub]');
		btnPub.tap(function() {
			if (!btnPub.hasClass('used')) {
				Page.showLoading('Publishing...');
				
				var img = container.find('.book_size').css('background-image');
				img = img.replace('url(' + Config.FILE_URL, '').replace(')', '').replace('_s', '');
				Service.Book.PublishBook(bid, Account.userId, img, function(data) {	   					
					Page.hideLoading();
					updateAccount(data.user);
					Page.back(function(c, page) {
						
						if(page.reverseIndex){
							page.reverseIndex(c);
						}
						var profile = $('#page_Profile');
						if (profile.length > 0) {
							Page.Profile.loadProfile(Account.userId, false, profile);
						}
						
					});
				});
			}
			else {
				Page.showLoading('Updating...');
				
				Service.Book.UnpublishBook(bid, Account.userId, function(data) {
					Page.hideLoading();
					updateAccount(data.user);					
					Page.back(function(c, page) {
						if(page.reverseIndex){
							page.reverseIndex(c);
						}
						
						var profile = $('#page_Profile');
						if (profile.length > 0) {
							Page.Profile.loadProfile(Account.userId, false, profile);
						}
						
					});
				});				
			}
		});
		
		if (book_header.offsetWidth >= 600) {
			self.ratio = 3;
		}
		var w = Math.floor((book_header.offsetWidth / self.ratio) - 15);
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
		
		self.bookPages = [];
		container.find('[data-link=chg_cover]').click(function() {
			var img = container.find('.book_size').css('background-image');
			img = img.replace('url(' + Config.FILE_URL, '').replace(')', '').replace('_s', '');
			container.find('.pp').each(function() {
				var p = $(this);
				self.bookPages.push({
					pid: p.data('pid'),
					pic: p.data('pic'),
					seq: p.data('seq')
				});			
			});
			Page.open('ChangeCover', true, { bid: bid, cover: img });
		});
		
		if (bid) {
			Service.Book.GetBook(bid, Account.userId, function(data) { 
				self.updateBook(container, data.title, data.desc);
				container.find('.pcount span').text(data.pcount);
				container.find('.book_size').css('background-image', 'url(' + Util.getImage(data.pic, 2) + ')');
				book = data;
				btnPub.show();
				if (data.pbdate) {
					btnPub.addClass('used');
					btnPub.text('UNPUBLISH');
				}
				
				for (var i = 0; i < data.pages.length; i++) {
					self.addPage(container, data.pages[i]);
				}
				self.reScale(container);
                     
			});
		}
	},
	
	bookPages: [],
	ratio: 2,
	
	updateBook: function(container, title, desc) {
		container.find('.book_title').text(title);
		container.find('.book_det .desc').text(desc);
	},
	
	reScale: function(container) {
		var self = this;
		var w = Math.floor((book_header.offsetWidth / self.ratio) - 15);
		container.find('.page_size').css({
			width: w + 'px',
			height: w + 'px'			
		});
	},
	
	addPage: function(container, data) {
		var self = this;
		var w = Math.floor((book_header.offsetWidth / self.ratio) - 15);
		
		var div = document.createElement('div');
		div.className = 'pp page_size';
		div.dataset.pid = data.pid;
		div.dataset.pic = data.pic;
		div.dataset.seq = data.seq;
		div.style.backgroundImage = 'url(' + Util.getImage(data.pic, 2) + ')';
		div.style.width = w + 'px';
		div.style.height = w + 'px';
		
		div.addEventListener('click', function() {
			var item = this;
			Page.popDialog(function(text) { 
				if (text == 'edit') {
					history.back();
					
					setTimeout(function() {
						Page.open('AddPage', true, { bid: self.bid, pid: item.dataset.pid });						
					}, 100);
				}
				else {
					alert(text);
				}
			}, 2);
		}, false);
		
		var num = document.createElement('div');
		num.className = 'page_num';
		num.innerText = data.seq;
		
		div.appendChild(num);
		
		container.find('#book_panel').append(div);
	}
};