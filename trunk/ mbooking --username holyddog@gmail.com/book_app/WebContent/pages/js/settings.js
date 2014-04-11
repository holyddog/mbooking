Page.Settings = {
	url: 'pages/html/settings.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
		
		// set content links
		container.find('[data-id=chg_pic]').tap(function() {
			Page.open('ChangePic', true);
		});
		container.find('[data-id=chg_pwd]').tap(function() {
			Page.open('ChangePwd', true);
		});
		container.find('[data-id=disp_name]').tap(function() {
			Page.open('ChangeName', true);
		});
		container.find('[data-id=sign_out]').tap(function() {
			localStorage.removeItem('u');
			Page.open('Home');
		});
		
		if (Account.picture) {
			container.find('.chg_pic img').attr('src', Config.FILE_URL + Util.getImage(Account.picture, Config.FILE_SIZE.SQUARE));
		}
	}
};