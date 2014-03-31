Page.Profile = {
	url: 'pages/html/profile.html',
	init: function(params, container) {
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});
		container.find('[data-id=btn_a]').tap(function() {
			Page.open('AddPage', true);
		});
		
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		// set content data
		var uid = (params && params.uid)? params.uid: Account.userId;
		Service.User.GetProfile(uid, function(data) {
			Page.bodyHideLoading(content);
			
			self.load(container, data);
			
			// set content links
			container.find('.book').tap(function() {
				var b = $(this);
				Page.open('Book', true, { bid: b.data('bid'), uid: uid });
			});
		});
	},
	
	load: function(container, userData) {		
		container.find('.profile_info .name').text(userData.dname);
		
		var bookPanel = container.find('.books_panel .books');
		var books = userData.books;
		for (var i = 0; i < books.length; i++) {
			var b = books[i];
			
			var bItemDiv = document.createElement('div');
			bItemDiv.className = 'bitem flex1 flex_lock';
			var bookDiv = document.createElement('div');
			bookDiv.className = 'book';
			bookDiv.dataset.bid = b.bid;
			bookDiv.style.backgroundImage = 'url(temp/b' + (i + 1) + '.jpg)';
			var titleH3 = document.createElement('h3');
			titleH3.className = 'title';
			titleH3.innerText = b.title;
			
			bookDiv.appendChild(titleH3);
			bItemDiv.appendChild(bookDiv);
			
			bookPanel.append(bItemDiv);
		}
		
		// set background image		
		var img = $('<img class="profile_bg absolute fade_out show" src="temp/bg3.jpg" />');
		img.load(function() {
			img.prependTo(container);
			
			var h = $(window).innerHeight();
			var w = $(window).innerWidth();
			
			img.height(h);
			img.css('left', -1 * (img.width() / 2 - w / 2) + 'px');
		});		
		
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
	}
};