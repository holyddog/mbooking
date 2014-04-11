Page.ChangePic = {
	url: 'pages/html/change_pic.html',
	init: function(params, container) {			
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		container.find('[data-id=btn_change]').tap(function() {
			Page.popDialog();
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
					profileCover.find('.pimage img').attr('src', Config.FILE_URL + Util.getImage(Account.picture, Config.FILE_SIZE.SQUARE));
					
					MessageBox.drop('Picture changed');					
					Page.back();
				});
			}
		});
		
		if (Account.picture) {
			container.find('.bg_pic img').attr('src', Config.FILE_URL + Util.getImage(Account.picture, Config.FILE_SIZE.SQUARE));
		}
	}
};