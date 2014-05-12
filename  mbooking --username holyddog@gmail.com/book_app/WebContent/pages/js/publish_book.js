Page.PublishBook = {
	url: 'pages/html/publish_book.html',
	init: function(params, container) {
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var btnCheck = container.find('[data-id=btn_c]'); 
		btnCheck.tap(function() {
			btnCheck.toggleClass('check');
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			Page.btnShowLoading(btnAccept[0]);
			var pub = btnCheck.hasClass('check');
			Service.Book.PublishBook(params.bid, Account.userId, pub, function() {
				Page.btnHideLoading(btnAccept[0]);
				
				Account.cover = self.bookCover;
				Page.loadMenu();
				localStorage.setItem('u', JSON.stringify(Account));
				
				if ($('#page_Profile').length > 0) {
					Page.back(function() {
						Page.back(function(c) {
							alert(c);
//							Page.Profile.invoke(Account.userId, c);			
						});
					});			
				}
				else {
					Page.back();
				}
			});
		});
		container.find('[data-id=btn_e]').tap(function() {
			Page.open('CreateBook', true, { ret: true, bid: params.bid });
		});
		var btnPreview = container.find('[data-id=btn_p]');
		btnPreview.tap(function() {
			Page.open('Book', true, { bid: params.bid, uid: Account.userId, preview: true });
		});
		
		// set content data
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		Service.Book.GetBookByBid(params.bid, function(data) { 
			Page.bodyHideLoading(content);
			
			var panelDiv = document.createElement('div');
			panelDiv.className = 'book_panel shadow_border';
			
			var titleH2 = document.createElement('h2');
			titleH2.className = 'title';
			titleH2.innerText = data.title;
			panelDiv.appendChild(titleH2);
			
			var boxDiv = document.createElement('div');
			boxDiv.className = 'box horizontal';			
			var imageDiv = document.createElement('div');
			imageDiv.className = 'bimage';
			if (data.pic) {
				var img = document.createElement('img');
				img.src = Util.getImage(Config.FILE_URL + data.pic, Config.FILE_SIZE.COVER);
				self.bookCover = data.pic;			
				imageDiv.appendChild(img);
			}
			boxDiv.appendChild(imageDiv);
			
			var infoDiv = document.createElement('div');
			infoDiv.className = 'binfo flex1';
			var descDiv = document.createElement('div');
			descDiv.className = 'desc';
			descDiv.innerText = data.desc;
			var countDiv = document.createElement('div');
			countDiv.className = 'pcount';
			countDiv.innerText = (data.pcount)? (data.pcount + ' Pages'): 'No Page';
			infoDiv.appendChild(descDiv);
			infoDiv.appendChild(countDiv);
			boxDiv.appendChild(infoDiv);
			
			panelDiv.appendChild(boxDiv);
			$(panelDiv).prependTo(content);
			
			content.find('.hid_panel').show();
			if (data.pub) {
				btnCheck.addClass('check');
			}
			
			if ($('[data-page=Book]').length) {
				container.find('.btn_panel .hid').hide(); 
			}
			
//			<div class="book_panel shadow_border">		
//				<h2 class="title"></h2>
//				<div class="box horizontal">
//					<div class="bimage">
//						<img src="">
//					</div>
//					<div class="binfo flex1">
//						<div class="desc"></div>
//						<div class="pcount">34 Pages</div>
//					</div>
//				</div>
//			</div>
			
//			container.find('.book_panel').data('bid', data.bid);
//			container.find('.book_panel .title').text(data.title);
//			container.find('.book_panel .desc').text(data.desc);
		});		
	},
	
	bookCover: '',
};