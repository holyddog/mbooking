Page.Book = {
	url: 'pages/html/book.html',
	init: function(params, container) {	
		var self = this;
		
//		var uid = (params && params.uid)? params.uid: Account.userId;
//		var isGuest = false;
//		if (uid != Account.userId) {
//			isGuest = true;
//		}
		
		// set toolbar buttons
		var btnBack = container.find('[data-id=btn_b]'); 
		btnBack.tap(function() {
			Page.back();
		});
		var btnComment = container.find('[data-id=btn_c]');
		btnComment.tap(function() {
			Page.open('Comments', true);
		});
		var btnShare = container.find('[data-id=btn_s]');
		btnShare.tap(function() {
			alert('share');
		});	
		
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
		content.find('.text_bar .fright').text(bookData.pcount + ' Page' + ((bookData.pcount > 1)? 's': ''));
		
		var index = 0;
		var size = 0;
		
//		var data = [{
//			pic: 'temp/1.jpg',
//			text: 'Tenetur magna pretium. Quisquam ducimus aute! Tempor excepturi ridiculus, cras curabitur fugiat, nesciunt vehicula? Do reiciendis.'
//		}, {
//			pic: 'temp/2.jpg',
//			text: 'Ducimus pariatur laborum erat pellentesque deserunt urna minus, nostra et exercitationem, molestie, erat sed pulvinar ipsam tristique odio cras do doloribus praesent. Quos officiis tellus quod sunt delectus diamlorem'
//		}, {
//			pic: 'temp/3.jpg',
//			text: 'Ultrices nisl ea rhoncus adipisicing ridiculus quasi fermentum quidem deleniti magnam fuga'
//		}, {
//			pic: 'temp/4.jpg',
//			text: 'Augue sagittis, etiam primis laudantium, officiis urna, montes risus cupidatat ullamco cillum id platea'
//		}, {
//			pic: 'temp/5.jpg',
//			text: 'Sollicitudin taciti eum elementum ea enim accusantium repellat minima voluptate, debitis, nascetur. Maiores scelerisque occaecati, platea, porttitor quae non temporibus urna'
//		}];
		
		// generate book pages
		var data = bookData.pages;
		if (data.length) {		
			for (var i = data.length - 1; i > -1; i--) {
				var page = $('<div class="page_nav fill_dock box vertical" style="background-color: white; visibility: hidden;"></div>');
				var pic = $('<div class="pic_box flex1 relative" style="background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: 0px; height: 0px;" src="' + (Config.FILE_URL + data[i].pic) + '"></div>');
				container.append(page.append(pic).append('<div style="padding: 10px;">' + data[i].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i + 1) + ' of ' + data.length + '</div>'));
				pic.find('img').data('height', pic.height());
			}		
			
			var finish = function(count) {				
				if (count == data.length - 1) {	
					container.find('.page_nav').css('display', 'none').css('visibility', 'visible');
					
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
				var img = $(this);
				var pic = img.parent();
				
				var pw = pic.width();
				var ph = pic.height();
				
				if (ph >= pw) {
					img.css({
						height: ph + 'px',
						width: 'auto'
					});
					img.css({
						left: -1 * (img.width() / 2 - pw / 2) + 'px'
					});
				}
				else {
					img.css({
						width: pw + 'px',
						height: 'auto'
					});
					img.css({
						top: -1 * (img.height() / 2 - ph / 2) + 'px'
					});				
				}
				finish(count++);
			});
		}
		
		// set background image
		var bgImage = Config.FILE_URL + Util.getImage(bookData.pic, Config.FILE_SIZE.LARGE);
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