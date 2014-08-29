Page.Recent = {
	url: 'pages/html/recent.html',
	init: function(params, container) {		
		clearInterval(Page.inv1);
		clearInterval(Page.inv2);
		
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});	
		container.find('[data-id=btn_r]').tap(function() {
			self.load(container.find('.content'));
		});
		self.load(container.find('.content'));
	},
	
	load: function(content, pwidth) {
		Page.bodyShowLoading(content);

		var panel = content.find('.book_con');
		panel.empty();
		

		Service.Book.GetPublishBooks(0, 100, function(data) {
			Page.bodyHideLoading(content);

			for (var i = 0; i < data.length; i++) {
				var b = data[i];

				var div = document.createElement('div');
				div.className = 'book';

				div.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic,
						b.pcount, b.author, b.lcount, b.ccount, b.key));
				div.appendChild(Page.Following.getAuthor(b.author.uid,
						b.author.dname, b.author.pic));

				panel.append(div);
			}

			var panelWidth = panel[0].offsetWidth;
			if (!panelWidth && pwidth) {
				panelWidth = pwidth;
			}

			var ratio = 2;
			if (panelWidth >= 600) {
				ratio = 3;
			}

			var w = (panelWidth / ratio) - 15;
			var h = (w * 4) / 3;
			content.find('.book').css({
				width : w + 'px'
			});
			content.find('.book_size').css({
				width : w + 'px',
				height : h + 'px',
				margin : 0,
				float : 'none'
			}).click(function(e) {
				e.preventDefault();

				var bid = $(this).data('bid');
				var uid = $(this).data('uid');
				var key = $(this).data('key');
				Page.open('Book', true, {
					bid : bid,
					uid : uid,
					key : key,
					back_reload : true
				});
			});
			panel.find('.panel').click(function(e) {
				e.preventDefault();

				var uid = $(this).data('uid');
				Page.open('Profile', true, {
					uid : uid,
					back : true
				});
			});

			if (Device.PhoneGap.isReady && Page.Explore.callPushNote
					&& Page.Explore.callPushNote != {}) {
				Page.Explore.callPushNote();
				Page.Explore.callPushNote = {};
			}
		}, 
			function() {}, 
			function() {},
			function() {}
		);

	},
	callPushNote:{}
};