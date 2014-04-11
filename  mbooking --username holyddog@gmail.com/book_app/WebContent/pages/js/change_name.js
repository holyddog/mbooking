Page.ChangeName = {
	url: 'pages/html/change_name.html',
	init: function(params, container) {	
		var inputName = container.find('input[name=dname]'); 
		inputName.val(Account.displayName);
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
				Service.User.ChangeDisplayName(Account.userId, inputName.val(), function(data) {
					Page.btnHideLoading(btnAccept[0]);
					
					Account.displayName = inputName.val();
					localStorage.setItem('u', JSON.stringify(Account));
					
					var profileCover = $('#profile_cover');
					profileCover.find('h1').text(Account.displayName);

					MessageBox.drop('Display name changed');
					
					Page.back();
				});
			}
		});
		
		var verify = function() {
			if (inputName.val().length > 0) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
			}
		};
		
		// set content binding
		inputName[0].addEventListener('input', function() {
			verify();
		}, false);
		verify();
	}
};