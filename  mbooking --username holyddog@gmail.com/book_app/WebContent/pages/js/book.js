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
			alert('share');
		});	
		var btnSetting = container.find('[data-id=btn_st]');
		btnSetting.tap(function() {
			Page.open('PublishBook', true, { bid: params.bid });
		});
		
		if (params.preview) {
			btnComment.hide();
			btnSetting.hide();
			btnShare.hide();
			btnBack.find('span')[0].className = 'back';
		}
		
		if (isGuest) {
			btnSetting.hide();
			btnComment.css('right', '0px');
		}
		
//		if (!isGuest) {
//			btnShare.hide();
//			btnComment.hide();
//		}
		
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		// set content data		
		Service.Book.GetBook(params.bid, params.uid, function(data) {
			Page.bodyHideLoading(content);
			self.load(container, data);
		});
	},
	
	load: function(container, bookData) {		
		var content = container.find('.content');
		content.find('.btitle').text(bookData.title);
		content.find('.bdesc').text(bookData.desc);
		content.find('.author_info .name').text(bookData.author.dname);
		if (bookData.author.pic) {
			content.find('.author_info img').attr('src', Util.getImage(bookData.author.pic, 3));
		}
		content.find('.text_bar .fright').text(bookData.pcount + ' Page' + ((bookData.pcount > 1)? 's': ''));
		
		var index = 0;
		var size = 0;
		
		// generate book pages
		var data = bookData.pages;
		if (data.length) {		
			for (var i = data.length - 1; i > -1; i--) {
				var page = $('<div class="page_nav fill_dock box vertical" style="background-color: white; visibility: hidden;"></div>');
				var pic = $('<div class="pic_box relative" style="background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: 100%; height: 100%;" src="' + Util.getImage(data[i].pic, 1) + '"></div>');
				content.append(page.append(pic).append('<div class="flex1 box" style="padding: 10px; -webkit-box-align: center;">' + data[i].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i + 1) + ' of ' + data.length + '</div>'));
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
			content.tap(function() {
				container.find('.page_nav').eq(index).css('display', '-webkit-box');
				container.find('#tap_nav').css('display', '-webkit-box');
			});
			
			container.append('<div id="tap_nav" class="fill_dock box horizontal" style="top: 0; z-index: 1000; display: none;"><div class="flex1" style="width: 50%;"></div><div class="flex1" style="width: 50%;"></div></div>');			
			container.find('#tap_nav .flex1').tap(function() {
				var pos = $(this).index();
				if (pos == 1) {		
					if (index > 0) {
						container.find('.page_nav').eq(index).css('display', 'none');			
						index--;
						container.find('.page_nav').eq(index).css('display', '-webkit-box');
					}
				}
				else {	
					if (index == size) {
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
//				var img = $(this);
//				var pic = img.parent();
//				
//				var pw = pic.width();
//				var ph = pic.height();
//				
//				if (ph >= pw) {
//					img.css({
//						height: ph + 'px',
//						width: 'auto'
//					});
//					img.css({
//						left: -1 * (img.width() / 2 - pw / 2) + 'px'
//					});
//				}
//				else {
//					img.css({
//						width: pw + 'px',
//						height: 'auto'
//					});
//					img.css({
//						top: -1 * (img.height() / 2 - ph / 2) + 'px'
//					});				
//				}
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