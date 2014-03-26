Page.AddPage = {
	url: 'pages/html/add_page.html',
	init: function(params, container) {	
		// set toolbar buttons
		container.find('[data-id=btn_c]').tap(function() {
			Page.back();
		});	
		container.find('[data-id=btn_s]').tap(function() {
			Page.showLoading();
			setTimeout(function() {
				Page.hideLoading();
			}, 5000);
		});
		container.find('[data-id=btn_p]').tap(function() {
			//alert('publish');
		});
		
		// set content links
		container.find('[data-id=link_b]').tap(function() {
			Page.open('BookList', true);
		});
		
		var content = container.find('.content');
		var addPhoto = content.find('#add_photo');
		var photoLabel = addPhoto.find('.photo_label');
		var removeBg = content.find('.remove_bg');
		var removeBtn = content.find('.remove');
		var index = 0;
		addPhoto.tap(function() {			
			var imgs = ['Img1', 'Img2', 'Img3'];
			
			photoLabel.addClass('no_display');
			removeBg.removeClass('no_display');
			removeBtn.removeClass('no_display');
			addPhoto.css('background-image', 'url(' + Data.Images[imgs[index]] + ')');
			index = (index + 1) % 3;
		}, true);
		removeBtn.tap(function() {
			photoLabel.removeClass('no_display');
			removeBg.addClass('no_display');
			removeBtn.addClass('no_display');
			addPhoto.css('background-image', '');
		});
	}
};