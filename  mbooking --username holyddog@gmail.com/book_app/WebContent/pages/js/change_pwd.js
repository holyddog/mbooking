Page.ChangePwd = {
	url: 'pages/html/change_pwd.html',
	init: function(params, container) {	
		var inputPwd = container.find('input[name=pwd]');
		var inputNPwd = container.find('input[name=npwd]');
		var inputCPwd = container.find('input[name=cpwd]'); 
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (inputNPwd.val() == inputCPwd.val()) {
				Page.btnShowLoading(btnAccept[0]);
				Service.User.ChangePassword(Account.userId, inputPwd.val(), inputNPwd.val(), function(data) {
					Page.btnHideLoading(btnAccept[0]);
					MessageBox.drop('Password changed');
					
					Page.back();
				});
			}
			else {
				MessageBox.alert({ message: 'Confirm password did not match' });
			}
		});
		
		var verify = function() {
			if (inputPwd.val().length > 0 && inputNPwd.val().length >= 6 && inputCPwd.val().length >= 6) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
			}
		};
		
		// set content binding
		inputPwd[0].addEventListener('input', function() {
			verify();
		}, false);
		inputNPwd[0].addEventListener('input', function() {
			verify();
		}, false);
		inputCPwd[0].addEventListener('input', function() {
			verify();
		}, false);
	}
};