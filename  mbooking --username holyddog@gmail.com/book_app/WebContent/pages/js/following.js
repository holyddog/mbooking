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
		
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
//		var list = container.find('.book_list');
//		list.empty();
//		
//		Service.Book.GetFollowBooksByUID(Account.userId, 0, Config.LIMIT_ITEM, function(data) {
//			Page.bodyHideLoading(content);
//			
//			var bcWidth = list.width();
//			var bw = bcWidth / 2;
//			var bh = (bw * 4) / 3;
//			for (var i = 0; i < data.length; i++) {
//				var b = data[i];
//				var pic = Config.FILE_URL + Util.getImage(b.pic, Config.FILE_SIZE.COVER);
//				
//				var li = document.createElement('li');
//				li.className = 'book_con';
//				
//				var divB = document.createElement('div');
//				divB.className = 'b shadow_border';
//				
//				var divCover = document.createElement('div');
//				divCover.dataset.bid = b.bid;
//				divCover.dataset.uid = b.author.uid;
//				divCover.className = 'cover';
//				divCover.style.backgroundImage = 'url(' + pic + ')';
//				
//				var h3 = document.createElement('h3');
//				h3.className = 'title';
//				h3.innerText = b.title;
//				
//				var divPanel = document.createElement('div');
//				divPanel.className = 'panel flow_hidden';
//				divPanel.dataset.uid = b.author.uid;
//				
//				var divLeft = document.createElement('div');
//				divLeft.className = 'fleft';
//				
//				var img = document.createElement('img');
//				img.className = 'image';
//				img.className = 'image';
//				if (b.author.pic) {
//					img.src = Config.FILE_URL + Util.getImage(b.author.pic, Config.FILE_SIZE.SQUARE);
//				}
//				else {
//					img.src = 'images/user.jpg';					
//				}
//				
//				var divAuthor = document.createElement('div');
//				divAuthor.className = 'author';
//				
//				var divText = document.createElement('div');
//				divText.className = 'text';
//				divText.innerText = b.author.dname;
//				
//				divAuthor.appendChild(divText);
//				divLeft.appendChild(img);
//				
//				divPanel.appendChild(divLeft);
//				divPanel.appendChild(divAuthor);				
//				divCover.appendChild(h3);
//				
//				divB.appendChild(divCover);
//				divB.appendChild(divPanel);
//				
//				li.appendChild(divB);
//				
//				list.append(li);
//			}
//			
//			container.find('.book_con').width(bw);
//			container.find('.book_con .cover').height(bh);
//			container.find('li .cover').tap(function() {
//				var obj = $(this);
//				Page.open('Book', true, { bid: obj.data('bid'), uid: obj.data('uid') });
//			}, true);
//			container.find('li .panel').tap(function() {
//				var obj = $(this);
//				Page.open('Profile', true, { uid: obj.data('uid') });
//			}, true);
//		});
		
		var panel = container.find('.book_con');
		panel.empty();
		
		Service.Book.GetFollowBooksByUID(Account.userId, 0, Config.LIMIT_ITEM, function(data) {
			Page.bodyHideLoading(content);
			
			for (var i = 0; i < data.length; i++) {
				var b = data[i];
				
				var div = document.createElement('div');
				div.className = 'b';
				
				div.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic, b.pcount, b.author));
				div.appendChild(self.getAuthor(b.author.uid, b.author.dname, b.author.pic));
				
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