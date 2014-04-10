Page.Profile = {	
	url: 'pages/html/profile.html',
	init: function(params, container) {
		var self = this;
		var uid = (params && params.uid)? params.uid: Account.userId;
		var isGuest = false;
		if (uid != Account.userId) {
			isGuest = true;
		}
		
		// check authen
		if (!localStorage.getItem('u')) {
			Page.open('Home');
			
			return;
		}
		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});
		var btnAdd = container.find('[data-id=btn_a]');
		btnAdd.tap(function() {
			Page.open('AddPage', true, { total: self.totalBook });
		});
		container.find('[data-id=link_more]').tap(function() {
			Page.open('AllBooks', true, { uid: uid });
		});
		
		// change some layout for another user
		if (params && params.uid != Account.userId) {
			var btnFollow = container.find('.btn_follow');
			btnFollow.tap(function() {
				if (btnFollow.hasClass('follow')) {
					Service.Book.UnFollowAuthor(params.uid, Account.userId, function() {
						btnFollow.html(self.followHtml.follow).removeClass('follow');
					});					
				}
				else {
					Service.Book.FollowAuthor(params.uid, Account.userId, function() {
						btnFollow.html(self.followHtml.unfollow).addClass('follow');
					});					
				}
			});
			btnAdd.hide();
		}
		else {
			container.find('.box_area').removeClass('vertical').addClass('horizontal').addClass('center_middle');
			container.find('.stat').addClass('flex1');
			container.find('.btn_follow').hide();			
		}
		
		// set content data
		this.invoke(uid, container, isGuest);
	},
	
	lastEditBook: {
		
	},
	totalBook: 0,
	followHtml: {
		follow: '<span style="padding-right: 5px;">+</span>FOLLOW',
		unfollow: '<span style="padding-right: 5px;">&#10003;</span>FOLLOWING'
	},
	
	invoke: function(uid, container, isGuest) {	
		var self = this;
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		var success = function(data) {
			Page.bodyHideLoading(content);
			
			self.load(container, data);
			
			// set content links
			container.find('.book').tap(function() {
				var b = $(this);
				Page.open('Book', true, { bid: b.data('bid'), uid: uid });
			});
		};
		
		if (!isGuest) {
			Service.User.GetProfile(uid, null, success);
		}
		else {
			Service.User.GetProfile(uid, Account.userId, success);
		}
	},
	load: function(container, userData) {		
		var self = this;
		
		container.find('.pname').text(userData.dname);
		
		var bookCount = (userData.pbcount)? userData.pbcount: 0;
		container.find('[data-id=bcount]').text(bookCount);
		Account.bookCount = bookCount;
		$('#profile_cover').find('.stat').text(bookCount + ' Books');
		
		container.find('[data-id=fcount]').text((userData.fcount)? userData.fcount: 0);
		container.find('[data-id=fgcount]').text((userData.fgcount)? userData.fgcount: 0);
		
		if (userData.tcount) {
			this.totalBook = userData.tcount;
		}		
		if (!userData.pbcount || userData.pbcount < 4) {
			container.find('.books_panel .label a').hide();
		}
		
		if (userData.isFollow) {
			container.find('.btn_follow').html(self.followHtml.unfollow).addClass('follow');
		}
		
		this.loadBook(userData.books, container);
		
		// show panel
		container.find('.content').removeClass('gray').addClass('no_color');
		container.find('.hid_loading').removeClass('hid_loading');
		
//		<div class="bitem flex1 flex_lock">
//			<div class="book" style="background-image: url(temp/b1.jpg);">
//				<h3 class="title">Vestibulum commodi</h3>
//			</div>
//		</div>
//		<div class="bitem flex1 flex_lock">
//			<div class="book" style="background-image: url(temp/b2.jpg);">
//				<h3 class="title">Sagittis eum, magnis</h3>
//			</div>
//		</div>
//		<div class="bitem flex1 flex_lock">
//			<div class="book" style="background-image: url(temp/b3.jpg);">
//				<h3 class="title">Adipiscing eaque error</h3>
//			</div>
//		</div>
	},
	loadBook: function(books, container) {
		var bookPanel = container.find('.books_panel .books').empty();
		var bgImage = 'temp/home.jpg';
		for (var i = 0; i < 3; i++) {
			var b = books[i];
			
			var bItemDiv = document.createElement('div');
			bItemDiv.className = 'bitem flex1 flex_lock';
			if (b) {
				var bookDiv = document.createElement('div');
				bookDiv.className = 'book';
				bookDiv.dataset.bid = b.bid;
				bookDiv.style.backgroundImage = 'url(' + (Util.getImage(Config.FILE_URL + b.pic, Config.FILE_SIZE.COVER)) + ')';
				var titleH3 = document.createElement('h3');
				titleH3.className = 'title';
				titleH3.innerText = b.title;
				
				bookDiv.appendChild(titleH3);
				bItemDiv.appendChild(bookDiv);
			}			
			bookPanel.append(bItemDiv);
		}
		
		if (books.length) {
			var rIndex = Util.getRandomInt(0, books.length - 1);
			bgImage = Util.getImage(Config.FILE_URL + books[rIndex].pic, Config.FILE_SIZE.LARGE);
		}
		
		// set background image		
//		var img = $('<img class="profile_bg absolute fade_out show" src="' + bgImage +'" />');
		var img = container.find('#profile_bg').attr('src', bgImage);
		img.load(function() {			
			var h = $(window).innerHeight();
			var w = $(window).innerWidth();
			
			img.height(h);
			img.css('left', -1 * (img.width() / 2 - w / 2) + 'px');
		});	
	}
};