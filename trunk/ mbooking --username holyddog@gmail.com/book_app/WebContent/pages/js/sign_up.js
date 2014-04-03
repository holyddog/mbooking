Page.SignUp = {
	url: 'pages/html/sign_up.html',
	init: function(params, container) {
		// check authen
		if (localStorage.getItem('u')) {
			Account = JSON.parse(localStorage.getItem('u'));
			Page.open('Profile');
			
			return;
		}
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			Page.btnShowLoading(btnAccept[0]);
			
			var dname = container.find('input[name=dname]').val();
			var email = container.find('input[name=email]').val();
			var uname = container.find('input[name=uname]').val();
			var pwd = container.find('input[name=pwd]').val();
			
			Service.User.SignUp(dname, email, uname, pwd, function(data) {
				Page.btnHideLoading(btnAccept[0]);
				
				Account = {
					userId: data.uid,
					email: data.email,
					displayName: data.dname,
					userName: data.uname
				};
				localStorage.setItem("u", JSON.stringify(Account));
				
				Page.open('Profile');
			});
		});
		
		// set content binding
		btnAccept.removeClass('disabled');
		/*container.find('input[name=name]')[0].addEventListener('input', function() {
			btnAccept.removeClass('disabled');
		}, false);*/
	}
};