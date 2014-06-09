Page.ChangePic = {
	url: 'pages/html/change_pic.html',
	init: function(params, container) {			
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
				
				var temp = container.find('img[data-ref]').attr('src');
				var pic = null;
				pic = temp.replace('data:image/jpg;base64,', '');			
				
				Service.User.ChangeProfilePic(Account.userId, pic, function(data) {
					Page.btnHideLoading(btnAccept[0]);
					
					Account.picture = data.picture;
					localStorage.setItem('u', JSON.stringify(Account));
					
					var profileCover = $('#profile_cover');
					profileCover.find('.pimage img').attr('src', Util.getImage(Account.picture, 3));
					
					MessageBox.drop('Picture changed');					
					Page.back(function(c, page) {
						page.setImage(c);
					});
				});
			}
		});
		container.find('[data-id=btn_change]').tap(function() {
			Page.popDialog(function(img) {
				container.find('img[data-ref=base64]').attr('src', 'data:image/jpg;base64,' + img);
				btnAccept.removeClass('disabled');
			});
		});
		
		if (Account.picture) {
			container.find('.bg_pic img').attr('src', Util.getImage(Account.picture, 3));
		}
	}
};