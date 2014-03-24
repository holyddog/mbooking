Page.SignIn = {
	url: 'pages/html/sign_in.html',
	
	init: function(params, container) {	
		// declare elements
		var inputText = container.find('input[name=login]');
		var inputPwd = container.find('input[name=pwd]');
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Service.User.SignIn(inputText.val(), inputPwd.val(), function(data) {
					if (data.error) {
						MessageBox.alert({ message: data.error.message });
					}
					else {
						Account = {
							userId: data.uid,
							email: data.email,
							displayName: data.dname,
							userName: data.uname
						};
					}
				});
			}
		});
		
		// check required field before enable sign in button
		container.find('input').each(function() {
			var input = $(this)[0];
			input.addEventListener('input', function() {
				if (inputText.val().length > 0 && inputPwd.val().length > 0) {
					btnAccept.removeClass('disabled');
				}
				else {
					btnAccept.addClass('disabled');
				}
			}, false);
		});
	}
};