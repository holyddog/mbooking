Page.Book = {
	url: 'pages/html/book.html',
	init: function(params, container) {	
		var self = this;
		
		var uid = (params && params.uid)? params.uid: Account.userId;
		var isGuest = false;
		if (uid != Account.userId) {
			isGuest = true;
		}
		
		// set toolbar buttons
		var btnBack = container.find('[data-id=btn_b]'); 
		btnBack.tap(function() {
			Page.back();
		});
		var btnComment = container.find('[data-id=btn_c]');
		btnComment.tap(function() {
			Page.open('Comments', true, { bid: params.bid });
		});
		var btnShare = container.find('[data-id=btn_s]');
		btnShare.tap(function() {
//			Page.open('Share', true, { bid: params.bid });
			
			alert('share');
			try {
				FB.ui({
					method : 'share',
					href : 'https://developers.facebook.com/docs/',
				}, function(response) {
					alert(JSON.stringify(response));
					
					if (response && !response.error_code) {
						alert('Posting completed.');
					} else {
						alert('Error while posting.');
					}
				});
			}
			catch (e) {
				alert('error: ' + e.message);
			}
		});	
		var btnLike = container.find('[data-id=btn_l]');
		btnLike.tap(function() {
			if (!btnLike.hasClass('liked')) {
				btnLike.addClass('liked');			
				Service.Book.LikeBook(params.bid, Account.userId, true, function(data) {});				
			}
			else {
				btnLike.removeClass('liked');			
				Service.Book.LikeBook(params.bid, Account.userId, false, function(data) {});				
			}
		});
		
		if (isGuest || params.preview) {
			container.find('.edit_book').css('visibility', 'hidden');
		}
		
//		var btnSetting = container.find('[data-id=btn_e]');
//		btnSetting.tap(function() {
//			Page.open('EditBook', true, { bid: params.bid });
//		});
		
		if (params.preview) {
			btnComment.hide();
			btnShare.hide();
			btnLike.hide();
//			btnBack.find('span')[0].className = 'back';
		}
		
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		// set content data		
		Service.Book.GetBookData(params.bid, params.uid, Account.userId, function(data) {
			Page.bodyHideLoading(content);
			
			if (!data.error) {
				if (data.liked) {
					btnLike.addClass('liked');				
				}
				
				self.load(container, data);				
			}	
			else {
				btnShare.hide();
				btnComment.hide();
				btnLike.hide();
				Page.createResMessage('No books found', content);
			}
		});
	},
	
	load: function(container, bookData) {
		var content = container.find('.content');
		content.find('.res_message').remove();
		
		content.find('.btitle').text(bookData.title);
		content.find('.bdesc').text(bookData.desc);
		content.find('.author_info .name').text(bookData.author.dname);
		if (bookData.author.pic) {
			content.find('.author_info img').attr('src', Util.getImage(bookData.author.pic, 3));
		}
//		content.find('.text_bar .fright').text(bookData.pcount + ' Page' + ((bookData.pcount > 1)? 's': ''));
		content.find('.text_bar .fright').text(bookData.pcount);
		if (bookData.lcount) content.find('.text_bar .lcount').text(bookData.lcount);
		if (bookData.ccount) content.find('.text_bar .ccount').text(bookData.ccount);
		
		var index = 0;
		var size = 0;
		
		// generate book pages
		var data = bookData.pages;
		if (data.length) {		
			for (var i = data.length - 1; i > -1; i--) {
				var page = $('<div class="page_nav fill_dock box vertical" style="background-color: white; visibility: hidden;"></div>');
				var pic = $('<div class="pic_box relative" style="background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: 100%; height: 100%;" src="' + Util.getImage(data[i].pic, 1) + '"></div>');
				// -webkit-box-align: center;
				content.append(page.append(pic).append('<div class="flex1 box center_middle" style="padding: 15px;">' + data[i].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i + 1) + ' of ' + data.length + '</div>'));
				pic.css('height', pic.width());
			}		
			
			var finish = function(count) {				
				if (count == data.length - 1) {	
					content.find('.page_nav').css('display', 'none').css('visibility', 'visible');
					
					index = data.length - 1;
					size = index;
					
					content.css('display', '-webkit-box');
				}
			};
			
			content.css('display', 'none');
			content.click(function(e) {
				var target = $(e.target);
				if (target.hasClass('edit_book')) {
					Page.open('EditBook', true, { bid: bookData.bid });
				}
				else if (target.closest('.author_info').length) {
					Page.open('Profile', true, { uid: bookData.uid, back: true });
				}
				else {		
					container.find('.first_cover').hide();
					container.find('.page_nav').eq(index).css('display', '-webkit-box');
					container.find('#tap_nav').css('display', '-webkit-box');			
				}
			});
			
			container.append('<div id="tap_nav" class="fill_dock box horizontal" style="top: 0; z-index: 1000; display: none;"><div class="flex1" style="width: 50%;"></div><div class="flex1" style="width: 50%;"></div></div>');			
			container.find('#tap_nav .flex1').click(function() {
				var pos = $(this).index();
				if (pos == 1) {		
					if (index > 0) {
						container.find('.page_nav').eq(index).css('display', 'none');			
						index--;
						container.find('.page_nav').eq(index).css('display', '-webkit-box');
					}
					else if (index == 0) {
						container.find('.page_nav').eq(index).css('display', 'none');	
						container.find('.last_cover').css('display', '-webkit-box');
						index--;
					}
				}
				else {	
					if (index == size) {
						container.find('.first_cover').show();	
						container.find('.last_cover').hide();
						container.find('.page_nav').eq(index).css('display', 'none');	
						index = data.length - 1;
						container.find('#tap_nav').css('display', 'none');
					}
					else if (index < size) {
						container.find('.page_nav').eq(index).css('display', 'none');			
						index++;
						container.find('.page_nav').eq(index).css('display', '-webkit-box');			
					}			
				}
			});
			
			var count = 0;
			container.find('.page_nav .pic_box img').load(function() {
				finish(count++);
			});
		}
		
		// set background image
		var bgImage = Util.getImage(bookData.pic, 1);
		var img = $('<img class="book_bg absolute fade_out show" src="' + bgImage + '" />');
		img.load(function() {
			img.prependTo(container);
			
			var h = $(window).innerHeight();
			var w = $(window).innerWidth();
			
			img.height(h);
			img.css('left', -1 * (img.width() / 2 - w / 2) + 'px');	
		});	
		
		// show panel
		content.removeClass('gray').addClass('no_color');
		container.find('.hid_loading').removeClass('hid_loading');
	}
};