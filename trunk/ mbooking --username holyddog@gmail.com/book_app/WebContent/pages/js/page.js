Page.Page = {
	url: 'pages/html/page.html',
	init: function(params, container) {
		var index = 0;
		var size = 0;
	
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});		
		container.find('[data-id=btn_p]').tap(function() {
			if (index < size) {
				content.find('.fill_dock').eq(index).css('display', 'none');			
				index++;
				content.find('.fill_dock').eq(index).css('display', '-webkit-box');			
			}
		});
		container.find('[data-id=btn_n]').tap(function() {
			if (index > 0) {
				content.find('.fill_dock').eq(index).css('display', 'none');			
				index--;
				content.find('.fill_dock').eq(index).css('display', '-webkit-box');
			}
		});
		
		// set content data
		var content = container.find('.content');
		
		var data = [{
			pic: 'temp/1.jpg',
			text: 'Tenetur magna pretium. Quisquam ducimus aute! Tempor excepturi ridiculus, cras curabitur fugiat, nesciunt vehicula? Do reiciendis.'
		}, {
			pic: 'temp/2.jpg',
			text: 'Ducimus pariatur laborum erat pellentesque deserunt urna minus, nostra et exercitationem, molestie, erat sed pulvinar ipsam tristique odio cras do doloribus praesent. Quos officiis tellus quod sunt delectus diamlorem'
		}, {
			pic: 'temp/3.jpg',
			text: 'Ultrices nisl ea rhoncus adipisicing ridiculus quasi fermentum quidem deleniti magnam fuga'
		}, {
			pic: 'temp/4.jpg',
			text: 'Augue sagittis, etiam primis laudantium, officiis urna, montes risus cupidatat ullamco cillum id platea'
		}, {
			pic: 'temp/5.jpg',
			text: 'Sollicitudin taciti eum elementum ea enim accusantium repellat minima voluptate, debitis, nascetur. Maiores scelerisque occaecati, platea, porttitor quae non temporibus urna'
		}];
		
		for (var i = data.length - 1; i > -1; i--) {
			var page = $('<div class="fill_dock box vertical" style="background-color: white;"></div>');
			var pic = $('<div class="pic_box flex1 relative" style="background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: 0px; height: 0px;" src="' + data[i].pic + '"></div>');
			content.append(page.append(pic).append('<div style="padding: 10px;">' + data[i].text + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i + 1) + ' of ' + data.length + '</div>'));
		}		
		
		var finish = function(count) {				
			if (count == data.length - 1) {		
				content.find('.fill_dock').css('display', 'none');
				
				index = data.length - 1;
				size = index;
				content.find('.fill_dock').eq(index).css('display', '-webkit-box');
			}
		};
		
		var count = 0;
		content.find('.pic_box img').load(function() {
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
};