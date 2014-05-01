Page.SignIn = {
	url: 'pages/html/sign_in.html',
	
	init: function(params, container) {	
		// check authen
		if (localStorage.getItem('u')) {
			Account = JSON.parse(localStorage.getItem('u'));
			Page.open('Profile');
			
			return;
		}
		
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
				Page.btnShowLoading(btnAccept[0]);
				Service.User.SignIn(inputText.val(), inputPwd.val(), function(data) {
					Page.btnHideLoading(btnAccept[0]);
					
                                    
					if (data.error) {
						MessageBox.alert({ message: data.error.message });
					}
					else {
                        var fbobj = {};
                        if(data.fbobj){
                            if(data.fbobj.fbid)
                            fbobj = {fbpic:data.fbobj.pic,fbname:data.fbobj.dname};
                        }
                                    
						Account = {
							userId: data.uid,
							email: data.email,
							displayName: data.dname,
							userName: data.uname,
							picture: data.pic,							
							cover: data.cover,
							bookCount: data.pbcount,
							draftCount: data.drcount,
							
//							followerCount: data.fcount,
//							bookCount: data.pbcount
							
                            fbObject: fbobj
						};                                    

						if (data.fbobj && data.fbobj.email) {
							Account.fbObject.fbemail = data.fbobj.email;
						}
						localStorage.setItem("u", JSON.stringify(Account));						

						Page.loadMenu();						
						Page.open('Profile');
					}
				});
			}
		}, true);
		
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