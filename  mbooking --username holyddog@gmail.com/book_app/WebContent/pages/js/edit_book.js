Page.EditBook = {	
	url: 'pages/html/edit_book.html',
	bid: null,
	init: function(params, container, append) {	
		var self = this;
		var bid = (params)? params.bid: undefined;
		this.bid = bid;		
//		container.css('z-index','1001');
		
		// set toolbar buttons
		var btnBack = container.find('[data-id=btn_b]');
		btnBack.tap(function() {
			Page.back(function(c, page) {
				if (page.reverseIndex) {
					page.reverseIndex(c);
				}
			});
		});
		
		var updateAccount = function(u, bid) {
			if (u) {
//				Account.cover = u.cover;
				Account.bookCount = u.pbcount;
				Account.draftCount = u.drcount;
				
				if (bid) {
					var books = Account.draftBooks;
					for (var i = 0; i < books.length; i++) {
						if (books[i].bid == bid) {
							Account.draftBooks.splice(i, 1);
							break;
						}
					}
					Page.updateShortcutBar();
				}
				
				localStorage.setItem('u', JSON.stringify(Account));
				
//				if ($('#page_Profile').length) {
//					Page.Profile.updateCover();					
//				}
			}
		};
		
		var btnDel = container.find('[data-id=btn_d]');
		btnDel.tap(function() {
			MessageBox.confirm({ 
				title: 'Confirm', 
				message: 'Are you sure you want to delete this book?', 
				callback: function() {
					Service.Book.DeleteBook(self.bid, Account.userId, function() {
						var books = Account.draftBooks;
						for (var i = 0; i < books.length; i++) {
							if (books[i].bid == bid) {
								Account.draftBooks.splice(i, 1);
								Account.draftCount = Account.draftBooks.length; 
								localStorage.setItem('u', JSON.stringify(Account));
								break;
							}
						}
						Page.updateShortcutBar();
						
//						var cover = container.find('#book_header .book_size').css('background-image');
//						if (cover) {
//							cover = cover.replace('url(', '').replace(')', '').replace('_s', '');
//							
//							if (cover.indexOf(Account.cover) > -1) {
//								delete Account.cover;
//								localStorage.setItem('u', JSON.stringify(Account));
//								
//								Page.loadMenu();
//								Page.Profile.updateCover();
//							}
//						}
						
//						Account.cover = 
						
						Page.back(function(c, page) {							
							if (c.data('page') == 'Book') {
								Page.back(function() {
									var profile = $('.page[data-page=Profile]');
									if (profile.length > 0) {
										Page.Profile.loadProfile(Account.userId, false, profile);
									}									
								});
							}
						});
					});								
				} 
			});
		});
		
		var publishBook = function(showLoad) {
			if (showLoad) {
				Page.showLoading('Publishing...');
			}
			
//			var img = container.find('.book_size').css('background-image');
//			img = img.replace('url(' + Config.FILE_URL, '').replace(')', '').replace('_s', '');
			Service.Book.PublishBook(bid, Account.userId, '', function(data) {	   					
				Page.hideLoading();
				updateAccount(data.user, bid);
				
				Page.back(function(c, page) {
					if (page.reverseIndex) {
						page.reverseIndex(c);
					}
					
					if (c.data('page') == 'Book') {
						Page.back(function() {
							var profile = $('.page[data-page=Profile]');
							if (profile.length > 0) {
								Page.Profile.loadProfile(Account.userId, false, profile);
							}									
						});
					}
					else if (c.data('page') == 'Profile') {
						page.loadProfile(Account.userId, false, c);
					}			
				});
			});
		};
		
		var btnPub = container.find('[data-id=btn_pub]');
		btnPub.tap(function() {
			Page.popDialog(function(text, share) { 
				history.back();
				
				if (text == 'ok') {
					if (share && Device.PhoneGap.isReady) {						
						var title = container.find('.book_title').text();
						var desc = container.find('.book_det .desc').text();
						var pic = container.find('.book_size').css('background-image');
						pic = pic.substring(pic.indexOf('(') + 1, pic.length - 1);
						
						setTimeout(function() {
							Page.showLoading('Publishing...');							
							self.fbPost(bid, title, desc, pic, function() {
								publishBook();
							});
						}, 100);
					}
					else {
						publishBook(true);
					}
				}
			}, 4);
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
			if (self.move) {
				return;
			}
			Page.open('AddPage', true, { bid: bid });
		});
		
		container.find('.tab_page a').click(function() {
			container.find('.tab_page a').removeClass('active');
			
			var link = $(this);
			link.addClass('active');
			
			container.find('.page_ref').hide();
			container.find('#' + link.data('ref')).show();
		});
		
		container.find('[data-link=edit_book]').click(function() {
			Page.open('CreateBook', true, { bid: bid, uid: Account.userId });
		});
		container.find('[data-link=add_tag]').click(function() {
			Page.open('AddTag', true, { bid: bid });
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
				self.updateBook(container, data.title, data.desc, data.pub);
				container.find('.pcount span').text(data.pcount);
				container.find('.book_size').css('background-image', 'url(' + Util.getImage(data.pic, 2) + ')');
				book = data;
				btnPub.show();
				if (data.pbdate) {
					btnPub.hide();
					btnPub.addClass('used');
					btnPub.text('UNPUBLISH');
				}
				
				for (var i = 0; i < data.pages.length; i++) {
					self.addPage(container, data.pages[i], data.pic == data.pages[i].pic);
				}
				self.reScale(container);
				
				var tags = data.tags;
				if (tags && tags.length > 0) {
					var tagPanel = container.find('.tags');
					for (var i = 0; i < tags.length; i++) {
						self.addTag(tagPanel, tags[i]);
					}				
				}
			});
		}
	},
	
	bookPages: [],
	ratio: 2,
	move: false,
	
	fbPost: function(bid, title, desc, pic, callback) {
		var post = function() {
			var link = Config.WEB_BOOK_URL + '?bid=' + bid;
			
			var privacy = {
				"value" : "EVERYONE"
			};
			var opt = {
				access_token: Account.fbObject.token,
				
				link : link,
				name : title,
				description : desc,
				picture : pic,

				caption : "The Story Application",
				privacy: privacy
	        };
	    	var cb = function(response) {	    		
	            if (!response || response.error) { 
	            	console.error(JSON.stringify(response.error));
					callback(false);
	            } else {
	            	callback(true);
	            }
	        };
	    	FB.api("/me/feed", 'post', opt, cb); 
		};
		post();
	},
	
	addTag: function(tagPanel, tagName) {
		var self = this;
		
		var link = document.createElement('a');
		link.className = 'name';
		link.innerText = tagName;
		
		$(link).click(function() {
			var item = $(this);
			MessageBox.confirm({ 
				title: 'Confirm', 
				message: 'Are you sure you want to delete this tag?', 
				callback: function() {	
					var tagName = item.text();
					item.remove();
					
					Service.Book.UpdateTag(self.bid, tagName, false, function() {
						
					});								
				} 
			});
		});
		
		tagPanel.append(link);
	},
	
	updateBook: function(container, title, desc, pub) {
		container.find('.book_title').text(title);
		container.find('.book_det .desc').text(desc);
		if (!pub) {
			container.find('.book_det .privacy').addClass('priv');			
		}
		else {
			container.find('.book_det .privacy').removeClass('priv');
		}
	},
	
	reScale: function(container) {
		var self = this;
		var w = Math.floor((book_header.offsetWidth / self.ratio) - 15);
		container.find('.page_size').css({
			width: w + 'px',
			height: w + 'px'			
		});
	},
	
	addPage: function(container, data, isCover) {
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
			if (self.move) {
				return;
			}
			
			var item = this;
			Page.popDialog(function(text) { 
				if (text == 'edit') {
					history.back();
					
					setTimeout(function() {
						Page.open('AddPage', true, { bid: self.bid, pid: item.dataset.pid });						
					}, 100);
				}
				else if (text == 'delete') {
					history.back();
					
					setTimeout(function() {
						MessageBox.confirm({ 
							title: 'Confirm', 
							message: 'Are you sure you want to delete this page?', 
							callback: function() {										
								Page.showLoading('Deleting...');
								Service.Page.DeletePage(item.dataset.pid, self.bid, function() {
									Page.hideLoading();
									
									container.find('[data-pid=' + item.dataset.pid + ']').remove();
									var counter = container.find('.pcount span');
									counter.text(parseInt(counter.text()) - 1);
									
									var pages = container.find('.pp');
									for (var i = 0; i < pages.length; i++) {
										pages.eq(i).find('.page_num').text(i + 1);
									}
								});								
							} 
						});
					}, 100);					
				}
				else if (text == 'cover') {
					history.back();
					
					var it = $(item);
					var pic = it.data('pic');
					container.find('.pp .cover').remove();
					
					var cover = document.createElement('div');
					cover.className = 'cover mask_icon';					
					it.append(cover);
					
					container.find('.book_size').css('background-image', 'url(' + Util.getImage(pic, 2) + ')');
					
					Service.Book.ChangeCover(self.bid, pic, function(data) {
//						container.find('.book_size').css('background-image', 'url(' + Util.getImage(newCover, 2) + ')');
						
//						Page.btnHideLoading(btnAccept[0]);
						
//						Page.back(function(c) {
//							c.find('.book_size').css('background-image', 'url(' + Util.getImage(newCover, 2) + ')');
//						});
					});
				}
				else if (text == 'move') {
					history.back();
					
					var all = container.find('.pp').addClass('active');
					var it = $(item).addClass('selected');
					self.move = true;
					
					setTimeout(function() {
						$(document).one('click', function(e) {
							it.removeClass('selected');
							all.removeClass('active');
							
							self.move = false;
							
							var reload = function(fseq, tseq) {
								var pages = container.find('.pp');
								for (var i = 0; i < pages.length; i++) {
									pages.eq(i).data('seq', i + 1).find('.page_num').text(i + 1);
								}
								Service.Page.ChangeSeq(self.bid, fseq, tseq , function(data) {});
							};
							var target = $(e.target).closest('.pp');
							if (target.length > 0) {
								e.preventDefault();
								
								var fseq = parseInt(it.data('seq'));
								var tseq = parseInt(target.data('seq'));
								if (fseq > tseq) {	
									it.insertBefore(target);
									reload(fseq, tseq);								
								}
								else if (fseq < tseq) {
									it.insertAfter(target);
									reload(fseq, tseq);									
								}
								
							}
						});						
					}, 100);
				}
			}, 2);
		}, false);
		
		var num = document.createElement('div');
		num.className = 'page_num';
		num.innerText = data.seq;
		
		if (isCover) {
			var cover = document.createElement('div');
			cover.className = 'cover mask_icon';
			div.appendChild(cover);
		}
		
		div.appendChild(num);
		
		container.find('#book_panel').append(div);
	}
};