Page.Search = {
	url: 'pages/html/search.html',
	init: function(params, container) {		
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		
		container.find('[data-link]').tap(function() {
			var link = $(this);
			
			container.find('[data-link]').removeClass('active');
			link.addClass('active');
			
			container.find('.res_panel').removeClass('active');
			container.find('#' + link.data('link')).addClass('active');
		});
		
		var inputText = container.find('.input_search');
		inputText.trigger('click');
		
		var clr = container.find('[data-id=clr]');
		clr.tap(function() {
			inputText.val(null);
			clr.hide();
		});
		
		if (!Device.isMobile()) {
			inputText.attr('type', 'text');
		}
		
		var focus = function(el) {
			el.focus();
			el.setSelectionRange && el.setSelectionRange(0, 0);
		};
		inputText[0].addEventListener('input', function(e) {			
			if (inputText.val().length > 0) {
				clr.show();
			}
			else {
				clr.hide();
			}
		}, false);
		inputText[0].addEventListener('keypress', function(e) {
			if (e.keyCode == 13) {
				self.search(container, inputText.val());
			}
		}, false);
		focus(inputText[0]);
		
//		Page.Explore.load(container.find('#book_tab'), container.find('.res_panel')[0].offsetWidth);
	},
	
	getUser: function(user) {
//		<div class="user_item box horizontal">
//			<div class="pimage">
//				<img src="temp/u1.jpg">
//			</div>
//			<div class="info flex1">
//				<h1>Chanon Trising</h1>
//				<div class="stat">@holydog<span>78 Books</span></div>
//			</div>
//		</div>
		var div = document.createElement('div');
		div.className = 'user_item box horizontal';
		div.dataset.uid = user.uid;
		
		var pimage = document.createElement('div');
		pimage.className = 'pimage';
		var img = document.createElement('img');
		img.src = 'images/user.jpg';
		if (user.pic) {
			img.src = Util.getImage(user.pic, 3);
		}
		pimage.appendChild(img);
		
		var info = document.createElement('div');
		info.className = 'info flex1';
		var h1 = document.createElement('h1');
		h1.innerText = user.dname;
		var stat = document.createElement('div');
		stat.className = 'stat';
		stat.innerHTML = '@' + user.uname + '<span>' + ((user.pbcount)? user.pbcount: 0) + ' Books</span>';
		
		info.appendChild(h1);
		info.appendChild(stat);
		
		div.appendChild(pimage);
		div.appendChild(info);
		return div;
	},
	
	getTag: function(tag, count) {
//		<div class="tag_item">
//			<div class="label">#HongKong</div>
//			<div class="count">20 Books</div>
//		</div>
		var div = document.createElement('div');
		div.className = 'tag_item';
		div.dataset.tag = tag.toLowerCase();
		
		var label = document.createElement('div');
		label.className = 'label';
		label.innerText = '#' + tag;
		var c = document.createElement('div');
		c.className = 'count';
		c.innerText = count + ' Books';
		
		div.appendChild(label);
		div.appendChild(c);
		
		return div;
	},
	
	search: function(container, keyword) {
		var self = this;

		var panel = container.find('.res_panel.active');
		panel.empty();
		
		if (keyword.trim().length > 0) {
			var type = panel.data('type');			

			if (type == 'user') {
				Page.bodyShowLoading(panel, true);
				
				Service.Search.Users(keyword, function(data) {
					Page.bodyHideLoading(panel);
					
					for (var i = 0; i < data.length; i++) {
						panel.append(self.getUser(data[i]));
					}
					
					panel.find('.user_item').click(function() {
						var uid = $(this).data('uid');
						Page.open('Profile', true, { back: true, uid: uid });
					});
				});
			} else if (type == 'book') {
				Page.bodyShowLoading(panel, true);
				
				Service.Search.Books(keyword, function(data) {
					Page.bodyHideLoading(panel);
					
					var bcon = document.createElement('div');
					bcon.className = 'book_con';
					
					for (var i = 0; i < data.length; i++) {
						var b = data[i];
						
						var div = document.createElement('div');
						div.className = 'book';
						
						div.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount));
						div.appendChild(Page.Following.getAuthor(b.author.uid, b.author.dname, b.author.pic));
						
						bcon.appendChild(div);
					}
					panel.append(bcon);
					
					var panelWidth = panel[0].offsetWidth;
					
					var ratio = 2;
					if (panelWidth >= 600) {
						ratio = 3;
					}
					
					var w = (panelWidth / ratio) - 15;
					var h = (w * 4) / 3;
					panel.find('.book_size').css({
						width: w + 'px',
						height: h + 'px',
						margin: 0,
						float: 'none'
					}).click(function() {
						var bid = $(this).data('bid');
						var uid = $(this).data('uid');
						Page.open('Book', true, { bid: bid, uid: uid });
					});
					panel.find('.panel').click(function() {
						var uid = $(this).data('uid');
						Page.open('Profile', true, { uid: uid, back: true });
					});
				});
			} else if (type == 'tag') {
				Page.bodyShowLoading(panel, true);
				
				Service.Search.Tags(keyword, function(data) {
					Page.bodyHideLoading(panel);
					
					for (var i = 0; i < data.length; i++) {
						var tag = data[i];
						panel.append(self.getTag(tag.tag, tag.count));
					}
					panel.find('.tag_item').click(function() {
						var tag = $(this).data('tag');
						Page.open('Tag', true, { tag: tag });
					});
				});
			}
		}
	}
};