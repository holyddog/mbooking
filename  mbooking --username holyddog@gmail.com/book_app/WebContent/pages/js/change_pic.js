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
				Service.User.ChangeProfilePic(Account.userId, container.find('img[data-ref]').attr('src'), function(data) {
					Page.btnHideLoading(btnAccept[0]);
					MessageBox.drop('Picture changed');
					
					Page.back();
				});
			}
		});
	}
};