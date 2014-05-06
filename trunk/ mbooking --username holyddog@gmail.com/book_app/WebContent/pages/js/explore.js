Page.Explore = {
	url: 'pages/html/explore.html',
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
		
		self.load(container);
	},
	
	load: function(container) {		
		var content = container.find('.content');
		Page.bodyShowLoading(content);

		var panel = container.find('.book_con');
		panel.empty();
		
		Service.Book.GetPublishBooks(0, Config.LIMIT_ITEM, function(data) {
			Page.bodyHideLoading(content);
			
			for (var i = 0; i < data.length; i++) {
				var b = data[i];
				
				var div = document.createElement('div');
				div.className = 'b';
				
				div.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic, b.pcount, b.author));
				div.appendChild(Page.Following.getAuthor(b.author.uid, b.author.dname, b.author.pic));
				
				panel.append(div);
			}
			
			var w = (panel.width() / 2) - 15;
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
		});
	}
};