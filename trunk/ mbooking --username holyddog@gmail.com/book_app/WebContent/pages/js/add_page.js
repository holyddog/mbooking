Page.AddPage = {
	url: 'pages/html/add_page.html',
	init: function(params, container) {	
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
			Page.showLoading();
			
			var bid = container.find('.sel_book').data('bid');
			var bgImage = $('#add_photo').css('background-image');
			var pic = null;
			if (bgImage != 'none') {
				pic = bgImage.split(',')[1].replace(')', '');
			}
			
			var fn = function(data) {
				Page.hideLoading();
				
				MessageBox.drop('New page added');
				
				removeFn();
				captionText.val(null);
				// reset form
			};
			Service.Page.CreatePage(bid, Account.userId, captionText.val(), pic, null, fn);
		});
		container.find('[data-id=btn_p]').tap(function() {
			Page.open('PublishBook', true);
		});
		
		// set content links
		container.find('[data-id=link_b]').tap(function() {
			Page.open('BookList', true);
		});
		container.find('[data-id=link_c]').tap(function() {
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