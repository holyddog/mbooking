Page.AddPage = {
	url: 'pages/html/add_page.html',
	init: function(params, container) {		
		var selBook = container.find('.sel_book');
		var linkCreate = container.find('[data-id=link_c]');
		if (!params.total) {
			selBook.hide();
		}
		else {
			linkCreate.hide();
			
			if (!selBook.data('bid')) {
				var lb = Account.lastEditBook;
				selBook.find('.bimage img').attr('src', Config.FILE_URL + Util.getImage(lb.pic, Config.FILE_SIZE.COVER));
				selBook.find('.btitle span').text(lb.title);
				selBook.data('bid', lb.bid);
			}
		}
		
		var captionText = container.find('[name=caption]');
		var content = container.find('.content');
		var addPhoto = content.find('#add_photo');
		var photoLabel = addPhoto.find('.photo_label');
		var removeBg = content.find('.remove_bg');
		var removeBtn = content.find('.remove');
		var index = 0;
		
		var removeFn = function() {
			photoLabel.removeClass('no_display');
			removeBg.addClass('no_display');
			removeBtn.addClass('no_display');
			addPhoto.css('background-image', '');
		};
		
		// set toolbar buttons
		container.find('[data-id=btn_c]').tap(function() {
			Page.back();
		});	
		container.find('[data-id=btn_s]').tap(function() {
			var bid = container.find('.sel_book').data('bid');			
			var bgImage = $('#add_photo').css('background-image');
			var pic = null;
			if (bgImage != 'none') {
				pic = bgImage.split(',')[1].replace(')', '');
			}
			
			if (!bid) {
				MessageBox.alert({ message: 'Please select a book' });
				return;
			}
			else if (!pic && !captionText.val()) {
				MessageBox.alert({ message: 'Please insert photo or caption' });
				return;				
			}
			
			Page.showLoading();
			
			var fn = function(data) {
				Page.hideLoading();
				
				MessageBox.drop('New page added');

				// reset form
				removeFn();
				captionText.val(null);
				
				// update local user data
				Account.lastEditBook = {
					bid: data.bid,
					pic: data.pic,
					title: data.title
				};
				localStorage.setItem("u", JSON.stringify(Account));
			};
			Service.Page.CreatePage(bid, Account.userId, captionText.val(), pic, null, fn);
		});
		container.find('[data-id=btn_p]').tap(function() {		
			var bid = selBook.data('bid');
			Page.open('PublishBook', true, { bid: bid });
		});
		
		// set content links
		container.find('[data-id=link_b]').tap(function() {
			Page.open('BookList', true);
		});
		linkCreate.tap(function() {
			Page.open('CreateBook', true, { ret: 1 });
		});
		
		addPhoto.tap(function() {			
			var imgs = ['Img1', 'Img2', 'Img3', 'Img4', 'Img5'];
			
			photoLabel.addClass('no_display');
			removeBg.removeClass('no_display');
			removeBtn.removeClass('no_display');
			addPhoto.css('background-image', 'url(' + Data.Images[imgs[index]] + ')');
			index = (index + 1) % 5;
		}, true);
		removeBtn.tap(removeFn);
	}
};