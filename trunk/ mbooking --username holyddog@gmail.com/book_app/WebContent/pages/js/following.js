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
		
		self.load(container);		
	},
	
	load: function(container) {		
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		var list = container.find('.book_list');
		list.empty();
		
		Service.Book.GetFollowBooksByUID(Account.userId, 0, Config.LIMIT_ITEM, function(data) {
			Page.bodyHideLoading(content);
			
			var bcWidth = list.width();
			var bw = bcWidth / 2;
			var bh = (bw * 4) / 3;
			for (var i = 0; i < data.length; i++) {
				var b = data[i];
				var pic = Config.FILE_URL + Util.getImage(b.pic, Config.FILE_SIZE.COVER);
				
				var li = document.createElement('li');
				li.className = 'book_con';
				
				var divB = document.createElement('div');
				divB.className = 'b shadow_border';
				
				var divCover = document.createElement('div');
				divCover.dataset.bid = b.bid;
				divCover.dataset.uid = b.author.uid;
				divCover.className = 'cover';
				divCover.style.backgroundImage = 'url(' + pic + ')';
				
				var h3 = document.createElement('h3');
				h3.className = 'title';
				h3.innerText = b.title;
				
				var divPanel = document.createElement('div');
				divPanel.className = 'panel flow_hidden';
				
				var divLeft = document.createElement('div');
				divLeft.className = 'fleft';
				
				var img = document.createElement('img');
				img.className = 'image';
				img.src = 'images/user.jpg';
				
				var divAuthor = document.createElement('div');
				divAuthor.className = 'author';
				
				var divText = document.createElement('div');
				divText.className = 'text';
				divText.innerText = b.author.dname;
				
				divAuthor.appendChild(divText);
				divLeft.appendChild(img);
				
				divPanel.appendChild(divLeft);
				divPanel.appendChild(divAuthor);				
				divCover.appendChild(h3);
				
				divB.appendChild(divCover);
				divB.appendChild(divPanel);
				
				li.appendChild(divB);
				
				list.append(li);
			}
			
			container.find('.book_con').width(bw);
			container.find('.book_con .cover').height(bh);
			container.find('li .cover').tap(function() {
				var obj = $(this);
				Page.open('Book', true, { bid: obj.data('bid'), uid: obj.data('uid') });
			}, true);
		});
	}
};