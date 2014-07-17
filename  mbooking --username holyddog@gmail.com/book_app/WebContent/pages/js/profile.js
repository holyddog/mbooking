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
		var btnAcceptNot = container.find('[data-id=btn_no]');
		
		btnFollow.tap(function() {
			if (btnFollow.hasClass('follow')) {
				btnAcceptNot.hide();
				btnAcceptNot.removeClass('accept');
				btnFollow.html('+ FOLLOW').removeClass('follow');
				
				Service.Book.UnFollowAuthor(uid, Account.userId, function(data) {
					Account.following = data.following;
					localStorage.setItem("u", JSON.stringify(Account));
				});					
			}
			else {
				btnAcceptNot.show();
				btnFollow.html('FOLLOWING').addClass('follow');
			
				Service.Book.FollowAuthor(uid, Account.userId, function(data) {
					Account.following = data.following;
					localStorage.setItem("u", JSON.stringify(Account));
				});					
			}
		});
		
	
		btnAcceptNot.tap(function() {
//				btnAcceptNot.css('pointer-events','none');
			if(btnFollow.hasClass('follow')){
				if(!btnAcceptNot.hasClass('accept')){
					Service.Book.AcceptNotification(Account.userId, uid, true,
						function(){
							btnAcceptNot.addClass('accept');		
//							btnAcceptNot.css('pointer-events','');
						}
					);
				}
				else{
					Service.Book.AcceptNotification(Account.userId, uid, false,
							function(){
								btnAcceptNot.removeClass('accept');		
//								btnAcceptNot.css('pointer-events','');
							}
					);
				}
			}
		});
		
		
		
		var profileView = container.find('#profile_view');	
		
		if (!isGuest) {
			btnFollow.hide();
			btnNotf.show();
			
			container.find('.pimage').click(function() {
				Page.popDialog(function(img) {
//					self.addPhoto(container, img);
					
//					var newImage = container.find('.pimage img').css({
//						width: 'auto',
//						height: 'auto',
//						left: '0px',
//						top: '0px'
//					}).attr('src', 'data:image/jpg;base64,' + img);
//					newImage.load(function() {
//						var iw = newImage.width();
//						var ih = newImage.height();
//						if (iw > ih) {
//							newImage.css({
//								'height': '68px'
//							});
//							newImage.css({
//								'left': -1 * ((newImage.width() / 2) - 34) + 'px'
//							});
//						}
//						else {
//							newImage.css({
//								'width': '68px'
//							});	
//							newImage.css({
//								'top': -1 * ((newImage.height() / 2) - 34) + 'px'
//							});						
//						}
//					});
					setTimeout(function() {
						Page.showLoading('Uploading...');						
					}, 300);
					
					Service.User.ChangeProfilePic(Account.userId, img, function(data) {
						Page.hideLoading();
						MessageBox.drop('Picture changed');
						
						container.find('.pimage img').attr('src', Util.getImage(data.picture, 3));
						container.find('.pimage img').attr("onerror", "this.src = 'images/user.jpg';");
						
						Account.picture = data.picture;
						localStorage.setItem('u', JSON.stringify(Account));
					});
				});
			});
			
			var editCover = container.find('.edit_cover').show();
			editCover.click(function() {
				Page.popDialog(function(img) {
					setTimeout(function() {
						Page.showLoading('Uploading...');						
					}, 300);
					
					Service.User.ChangeProfileCover(Account.userId, img, function(data) {
						Page.hideLoading();
						MessageBox.drop('Cover changed');
						
						Account.cover = data.picture;
						localStorage.setItem('u', JSON.stringify(Account));
						
						var header = container.find('#profile_page');
						header.css({
							'background-image': 'url(' + Util.getImage(data.picture, 1) + ')'
						});
						Page.loadMenu();
					});
				});
			});
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
			else if (ptab.index() == 3) {
				var ptab3 = container.find('#ptab3');
				if (ptab3.find('.b').length == 0) {
					var minHeight = container.find('.content').height() - container.find('#profile_header').height() - container.find('#xbar').height();
					ptab3.css('min-height', (minHeight - 20) + 'px');
					
					Page.bodyShowLoading(ptab3);
					Service.User.GetFavBooks(uid, 0, 100, function(data) { 
						Page.bodyHideLoading(ptab3);
						
						for (var i = 0; i < data.length; i++) {
							var b = data[i];
							ptab3.append(self.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount, b.key));
						}
						ptab3.find('.book_size').click(function() {
							var b = $(this);
							self.openBook(b, b.data('uid'));
						});
						self.resizeBook(ptab3);					
					});
				}
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
			Page.open('Book', true, { bid: bid, uid: uid, key: b.data('key') });
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
			ptab1.append(self.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount, b.key));
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
			ptab2.append(self.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount, b.key));
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
			ptab3.append(self.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount, b.key));
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
				container.find('.pimage img').attr("onerror", "this.src = 'images/user.jpg';");
			}
			if (user.cover) {
				document.getElementById('profile_page').style.backgroundImage = 'url(' + Util.getImage(user.cover, 1) + ')';
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
			
			statPanel.find('[data-link=followers]').click(function() {
				Page.open('Follows', true, { uid: uid, follower: true });
			});
			statPanel.find('[data-link=following]').click(function() {
				Page.open('Follows', true, { uid: uid, follower: false });
			});			

			profile_header.style.height = profile_header.offsetWidth + 'px';
			var minHeight = container.find('.content').height() - container.find('#profile_header').height() - container.find('#xbar').height();
			container.find('.tpage').css('min-height', (minHeight - 10) + 'px');
								
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
					var accept_notbtn = container.find('[data-id=btn_no]');
					accept_notbtn.show();
					if(data.isRecvNot){
						accept_notbtn.addClass('accept');	
					}
				}
				textBar.text('Books by ' + user.dname).show();
			}
		
		}, function() {
			Page.bodyHideLoading(content);			
		});
	},
	
	colors: ['#6DCAEC', '#CF9FE7', '#B6DB49', '#FFD060', '#FF7979'],
	
	getBook: function(bid, title, cover, count, author, lcount, ccount, key) {
		var div = document.createElement('div');
		div.className = 'b book_size';
		div.dataset.bid = bid;
		div.dataset.key = key;
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
		var profileHeader = document.getElementById('profile_page');
		var profileCover = document.getElementById('profile_cover');
		if (profileHeader && profileCover) {
			if (Account.cover) {
				profileHeader.style.backgroundImage = 'url(' + Util.getImage(Account.cover, 1) + ')';

				var cover = Util.getImage(Account.cover, 2);
				profileCover.style.backgroundImage = 'url(' + cover + ')';
			}
			else {
				profileHeader.style.backgroundImage = 'none';
				profileCover.style.backgroundImage = 'none';		
			}			
		}
	}
};