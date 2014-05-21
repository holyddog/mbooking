Page.Following = {
	url: 'pages/html/following.html',
	init: function(params, container) {		
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
		container.find('[data-id=btn_r]').tap(function() {
			self.load(container);
		});	
		var btnAdd = container.find('[data-id=btn_a]');
		btnAdd.tap(function() {
			Page.open('AddPage', true, { total: Account.bookCount });
		});
		var btnNotf = container.find('[data-id=btn_n]');
		btnNotf.tap(function() {
			btnNotf.find('.notf_count').removeClass('show');
			Page.open('Notifications', true);
		});	
		
		Page.createShortcutBar(container.find('.content'));
		self.load(container);		
	},
	
	getAuthor: function(uid, name, pic) {
//		<div class="panel flow_hidden" data-uid="1">
//			<div class="fleft">
//				<img class="image" src="images/user.jpg">
//			</div>
//			<div class="author">
//				<div class="text">Holy D Dog</div>
//			</div>
//		</div>
		
		var adiv = document.createElement('div');
		adiv.dataset.uid = uid;
		adiv.className = 'panel flow_hidden';
		
		var fdiv = document.createElement('div');
		fdiv.className = 'fleft';
		
		var img = document.createElement('img');
		img.className = 'image';
		if (pic) {
			img.src = Util.getImage(pic, 3);
		}
		else {
			img.src = 'images/user.jpg';
		}
		fdiv.appendChild(img);
		adiv.appendChild(fdiv);
		
		var au = document.createElement('div');
		au.className = 'author';
		
		var text = document.createElement('div');
		text.className = 'text';
		text.innerText = name;
		
		au.appendChild(text);
		
		adiv.appendChild(au);
		
		return adiv;
	},
	
	load: function(container) {		
		var self = this;
		clearInterval(Page.inv1);

		var content = container.find('.content');
		var panel = container.find('.book_con');
		panel.empty();
		Page.bodyShowLoading(content);
		Service.Book.GetFollowBooksByUID(Account.userId, 0, Config.LIMIT_ITEM, function(data) {
			Page.bodyHideLoading(content);
			self.loadItems(data, container, panel);
			
			if (data.length >= Config.LIMIT_ITEM) {
				self.runInterval(container, panel);
			}
		});
	},
	
	runInterval: function(container, panel) {		
		var self = this;
		var content = container.find('.content');
		var start = container.find('.book_size').length;
		var more = container.find('.load_more');
		Page.inv1 = setInterval(function() {
			if (!more.is(':visible') && content[0].scrollHeight - content[0].scrollTop <= content[0].offsetHeight) {
				more.show();
				Page.bodyShowLoading(more);
				
				Service.Book.GetFollowBooksByUID(Account.userId, start, Config.LIMIT_ITEM, function(data) {
					self.loadItems(data, container, panel);
					start += data.length;
					more.hide();
					Page.bodyHideLoading(more);
					
					if (data.length < Config.LIMIT_ITEM) {
						clearInterval(Page.inv1);
					}
				});
			}
		}, 1);
	},
	
	loadItems: function(data, container, panel) {
		var self = this;
		
		for (var i = 0; i < data.length; i++) {
			var b = data[i];
			
			var div = document.createElement('div');
			div.className = 'book';
			
			div.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic, b.pcount, b.author));
			div.appendChild(self.getAuthor(b.author.uid, b.author.dname, b.author.pic));
			
			panel.append(div);
		}
		
		var ratio = 2;
		if (panel[0].offsetWidth >= 600) {
			ratio = 3;
		}
		
		var w = (panel[0].offsetWidth / ratio) - 15;
		var h = (w * 4) / 3;
		container.find('.book_size').css({
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
	}
};