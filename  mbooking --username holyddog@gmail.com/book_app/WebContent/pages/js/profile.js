Page.Profile = {	
	url: 'pages/html/profile.html',
	init: function(params, container, append) {
		clearInterval(Page.inv1);
		clearInterval(Page.inv2);
		
		var self = this;
		
		var isGuest = false;
		var uid = (params)? params.uid: undefined;
		if (uid && uid != Account.userId) {
			isGuest = true;
		}
		else {
			uid = Account.userId;
		}
		container.find('[data-id=btn_f]').hide();
		
		// set toolbar buttons
		var btnMenu = container.find('[data-id=btn_m]');
		btnMenu.tap(function() {
			Page.slideMenu();
		});
		var btnBack = container.find('[data-id=btn_b]');
		btnBack.tap(function() {
			Page.back();
		});	
		var btnSearch = container.find('[data-id=btn_s]');
		btnSearch.tap(function() {
			Page.open('Search', true);
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

		var profileView = container.find('#profile_view');	
		
		if (!isGuest) {
			btnFollow.hide();
			btnNotf.show();
		}
		else {
			btnFollow.show();
			btnNotf.hide();
			btnSearch.hide();
			profileView.css('padding-bottom', '0px');
		}	
		
		container.find('.ptab').click(function() {
			var ptab = $(this);
			container.find('.ptab').removeClass('active');
			ptab.addClass('active');
			
			container.find('.tpage').hide();
			container.find('.tpage').eq($(this).index() - 1).show();
			
			if (ptab.index() == 2) {
				var content = container.find('.content');
				var ptab2 = container.find('#ptab2').css('padding-bottom', '75px');
				var start2 = ptab2.find('.b').length;
				var more2 = ptab2.find('.btn_more');
				Page.inv2 = setInterval(function() {
					if (!ptab2.hasClass('loading') && content[0].scrollHeight - content[0].scrollTop <= content[0].offsetHeight) {
						ptab2.addClass('loading');
						Page.bodyShowLoading(more2);
						
						Service.User.GetPrivateBooks(uid, start2, Config.LIMIT_ITEM, function(data) { 
							self.loadPrivateBooks(data, uid, container, true);
							start2 += data.length;
							ptab2.removeClass('loading');
							Page.bodyHideLoading(more2);
							
							if (data.length < Config.LIMIT_ITEM) {
								clearInterval(Page.inv2);
								ptab2.css('padding-bottom', '5px');
							}
						});
					}
				}, 1);
			}
		});

		Page.createShortcutBar(container);
		
		var scBar = container.find('.sc_bar');
		if (isGuest) {
			scBar.hide();
		}
		
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
			ptab1.append(self.getBook(b.bid, b.title, b.pic, b.pcount, b.lcount, b.ccount));
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
			ptab2.append(self.getBook(b.bid, b.title, b.pic, b.pcount, b.lcount, b.ccount));
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
			ptab3.append(self.getBook(b.bid, b.title, b.pic, b.pcount, b.lcount, b.ccount));
		}
		ptab3.find('.book_size').click(function() {
			var b = $(this);
			Page.open('EditBook', true, { bid: b.data('bid') });
		});	
		self.resizeBook(ptab3);	
	},
	
	loadProfile: function(uid, isGuest, container) {
		var self = this;
		var profile_view = container.find('#profile_view')[0];
		profile_view.style.display = 'none';
		var profile_header = container.find('#profile_header')[0];
		
		clearInterval(Page.inv1);
		clearInterval(Page.inv2);
		
		var content = container.find('.content');
		
		Page.bodyShowLoading(content);
		Service.User.GetProfile(uid, Account.userId, function(data) {
			Page.bodyHideLoading(content);
			
			profile_view.style.display = 'block';
			
			var user = data.user;
			
			content.find('.header_title span.dname').text(user.dname);
			content.find('.header_title span.uname').text('@' + user.uname);
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
			
			if (data.pubBooks.length + 1 == Config.LIMIT_ITEM) {
				var ptab1 = container.find('#ptab1').css('padding-bottom', '75px');
				var start1 = ptab1.find('.b').length;
				var more1 = ptab1.find('.btn_more');
				Page.inv1 = setInterval(function() {
					if (!ptab1.hasClass('loading') && content[0].scrollHeight - content[0].scrollTop <= content[0].offsetHeight) {
						ptab1.addClass('loading');
						Page.bodyShowLoading(more1);
						
						Service.User.GetPublicBooks(uid, start1, Config.LIMIT_ITEM, function(data) { 
							self.loadPublicBooks(data, uid, container, true);
							start1 += data.length;
							ptab1.removeClass('loading');
							Page.bodyHideLoading(more1);
							
							if (data.length < Config.LIMIT_ITEM) {
								clearInterval(Page.inv1);
								ptab1.css('padding-bottom', '5px');
							}
						});
					}
				}, 1);
			}

			container.find('#xbar .flex1').hide();
			var textBar = container.find('#xbar .text');
			if (!isGuest) {
				if (user.drcount) {
					container.find('#xbar .notf').show().text(user.drcount);
				}
				else {
					container.find('#xbar .notf').hide();
				}
				container.find('#xbar .flex1').show();
				textBar.hide();
				
				self.loadPrivateBooks(data.priBooks, uid, container);
				
//				self.loadDraftBooks(data.drBooks, uid, container);
			}
			else {
				if (data.isFollow) {
					container.find('[data-id=btn_f]').html('FOLLOWING').addClass('follow');
				}
				textBar.text('Books by ' + user.dname).show();
			}

			profile_header.style.height = profile_header.offsetWidth + 'px';
			
			if (Device.PhoneGap.isReady && Page.Profile.callPushNote) {
            	Page.Profile.callPushNote();
            	Page.Profile.callPushNote = {};
            }
		});
	},
	
	colors: ['#6DCAEC', '#CF9FE7', '#B6DB49', '#FFD060', '#FF7979'],
	
	getBook: function(bid, title, cover, count, author, lcount, ccount) {
		var div = document.createElement('div');
		div.className = 'b book_size';
		div.dataset.bid = bid;
		div.style.backgroundColor = this.colors[Util.getRandomInt(0, this.colors.length - 1)];
		if (author) {
			div.dataset.uid = author.uid;
		}
		div.style.backgroundImage = 'url(' + Util.getImage(cover, 2) + ')';
		
		var h2 = document.createElement('h2');
		h2.innerText = title;
		div.appendChild(h2);
		
		var social = document.createElement('div');
		social.className = 'social flow_hidden';
		
		var getLabel = function(icon, c) {
			var item = document.createElement('div');
			item.className = 'clabel';
			
			var ic = document.createElement('div');
			ic.className = 'icon mask_icon';
			ic.style.webkitMaskImage = 'url(icons/' + icon + '.png)';
			
			var txt = document.createElement('div');
			txt.className = 'text';
			txt.innerText = c;
			
			item.appendChild(ic);
			item.appendChild(txt);
			
			return item;
		};
		social.appendChild(getLabel('like', (lcount)? lcount: '0'));
		social.appendChild(getLabel('comment', (ccount)? ccount: '0'));
		
		div.appendChild(social);
		
		if (count) {
			var countDiv = document.createElement('div');
			countDiv.className = 'pcount';
			countDiv.innerText = count;
			div.appendChild(countDiv);
		}
		
		return div;
	},
	
	resizeBook: function(container) {	
		var header = $('.page:last-child #profile_header')[0];
		
		var ratio = 2;
		if (header.offsetWidth >= 600) {
			ratio = 3;
		}
		
		var w = (header.offsetWidth / ratio) - 15;
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