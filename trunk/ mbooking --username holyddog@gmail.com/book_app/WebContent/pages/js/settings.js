Page.Settings = {
	url: 'pages/html/settings.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
		
		// set content links
		container.find('[data-id=chg_pwd]').tap(function() {
			Page.open('ChangePwd', true);
		});
		container.find('[data-id=sign_out]').tap(function() {
			localStorage.removeItem('u');
			Page.open('Home');
		});
	}
};