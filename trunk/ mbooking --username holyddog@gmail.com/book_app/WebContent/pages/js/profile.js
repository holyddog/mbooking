Page.Profile = {	
	url: 'pages/html/profile.html',
	init: function(params, container, append) {		
		var self = this;
		
		var isGuest = false;
		var uid = (params)? params.uid: undefined;
		if (uid && uid != Account.userId) {
			isGuest = true;
		}
		else {
			uid = Account.userId;
		}
		
		// set toolbar buttons
		var btnMenu = container.find('[data-id=btn_m]');
		btnMenu.tap(function() {
			Page.slideMenu();
		});
		var btnBack = container.find('[data-id=btn_b]');
		btnBack.tap(function() {
			Page.back();
		});	
		var btnNotf = container.find('[data-id=btn_n]');
		btnNotf.tap(function() {
			btnNotf.find('.notf_count').removeClass('show');
			Page.open('Notifications', true);
		});
		
		if (params && params.back) {
			btnBack.show();
			btnMenu.hide();
		}
		
		var btnFollow = container.find('[data-id=btn_f]');
		btnFollow.tap(function() {
			if (btnFollow.hasClass('follow')) {
				Service.Book.UnFollowAuthor(uid, Account.userId, function() {
					btnFollow.html('+ FOLLOW').removeClass('follow');
				});					
			}
			else {
				Service.Book.FollowAuthor(uid, Account.userId, function() {
					btnFollow.html('FOLLOWING').addClass('follow');
				});					
			}
		});
		
		var linkAdd = container.find('[data-id=link_a]');
		
		if (!isGuest) {
			btnFollow.hide();
			btnNotf.show();
			linkAdd.show();
		}
		else {
			btnFollow.show();
			btnNotf.hide();
			linkAdd.hide();
		}
		
		container.find('.ptab').click(function() {
			var ptab = $(this);
			container.find('.ptab').removeClass('active');
			ptab.addClass('active');
			
			container.find('.tpage').hide();
			container.find('.tpage').eq($(this).index() - 1).show();
		});
		
		self.loadProfile(uid, isGuest, container);
	},
	
	openBook: function(b, uid) {
		var bid = b.data('bid');
		if (bid) {
			Page.open('Book', true, { bid: bid, uid: uid });
		}
		else {
			Page.open('CreateBook', true, { pub: b.data('pub') });
		}
	},
	
	loadPublicBooks: function(pubBooks, uid, container, append) {		
		var self = this;
		var ptab1 = container.find('#ptab1');	

		if (!append) {
			ptab1.find('.b').remove();
		}
		
		for (var i = 0; i < pubBooks.length; i++) {
			var b = pubBooks[i];
			ptab1.append(self.getBook(b.bid, b.title, b.pic, b.pcount));
		}
		ptab1.find('.book_size').click(function() {
			self.openBook($(this), uid);
		});
		self.resizeBook(ptab1);
	},
	
	loadPrivateBooks: function(priBooks, uid, container, append) {
		var self = this;
		var ptab2 = container.find('#ptab2');

		if (!append) {
			ptab2.find('.b').remove();
		}
		
		for (var i = 0; i < priBooks.length; i++) {
			var b = priBooks[i];
			ptab2.append(self.getBook(b.bid, b.title, b.pic, b.pcount));
		}
		ptab2.find('.book_size').click(function() {
			self.openBook($(this), uid);
		});
		self.resizeBook(ptab2);
	},
	
	loadDraftBooks: function(drBooks, uid, container, append) {
		var self = this;
		var ptab3 = container.find('#ptab3');

		if (!append) {
			ptab3.find('.b').remove();
		}
		
		for (var i = 0; i < drBooks.length; i++) {
			var b = drBooks[i];
			ptab3.append(self.getBook(b.bid, b.title, b.pic, b.pcount));
		}
		ptab3.find('.book_size').click(function() {
			var b = $(this);
			Page.open('EditBook', true, { bid: b.data('bid') });
		});	
		self.resizeBook(ptab3);	
	},
	
	loadProfile: function(uid, isGuest, container) {
		var self = this;
		
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		Service.User.GetProfile(uid, Account.userId, function(data) {
			Page.bodyHideLoading(content);
			
			profile_view.style.display = 'block';
			
			var user = data.user;
			
			content.find('.header_title span').text(user.dname);
			if (user.pic) {
				content.find('.pimage img').attr('src', Util.getImage(user.pic, 3));
			}
			if (user.cover) {
				profile_header.style.backgroundImage = 'url(' + Util.getImage(user.cover, 1) + ')';
			}
			
			var statPanel = content.find('.stat_panel');
			if (user.pbcount) {
				statPanel.find('[data-count=book]').text(user.pbcount);
			}
			if (user.fcount) {
				statPanel.find('[data-count=follower]').text(user.fcount);				
			}
			if (user.fgcount) {
				statPanel.find('[data-count=following]').text(user.fgcount);				
			}
								
			self.loadPublicBooks(data.pubBooks, uid, container);

			container.find('#xbar .flex1').hide();
			var textBar = container.find('#xbar .text');
			if (!isGuest) {
				if (user.drcount) {
					container.find('#xbar .notf').show().text(user.drcount);
				}
				container.find('#xbar .flex1').show();
				textBar.hide();
				
				self.loadPrivateBooks(data.priBooks, uid, container);
				self.loadDraftBooks(data.drBooks, uid, container);
			}
			else {
				if (data.isFollow) {
					container.find('[data-id=btn_f]').html('FOLLOWING').addClass('follow');
				}
				textBar.text('Books by ' + user.dname).show();
			}

			profile_header.style.height = profile_header.offsetWidth + 'px';
		});
	},
	
	getBook: function(bid, title, cover, count, author) {
		var div = document.createElement('div');
		div.className = 'b book_size';
		div.dataset.bid = bid;
		if (author) {
			div.dataset.uid = author.uid;
		}
		div.style.backgroundImage = 'url(' + Util.getImage(cover, 2) + ')';
		
		var h2 = document.createElement('h2');
		h2.innerText = title;
		div.appendChild(h2);
		
		if (count) {
			var countDiv = document.createElement('div');
			countDiv.className = 'pcount';
			countDiv.innerText = count;
			div.appendChild(countDiv);
		}
		
		return div;
	},
	
	resizeBook: function(container) {		
		var w = (profile_header.offsetWidth / 2) - 15;
		var h = (w * 4) / 3;
		container.find('.book_size').css({
			width: w + 'px',
			height: h + 'px'
		});
	},
	
	updateCover: function() {
		if (Account.cover) {
			profile_header.style.backgroundImage = 'url(' + Util.getImage(Account.cover, 1) + ')';

			var cover = Util.getImage(Account.cover, 2);
			profile_cover.style.backgroundImage = 'url(' + cover + ')';
		}
	}
};