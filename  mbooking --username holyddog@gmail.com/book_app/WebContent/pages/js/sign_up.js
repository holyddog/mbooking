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
        
        var fbid = params.fbid;
        var fbpic = params.fbpic;
        var fbname = params.fbname;
        var fbemail = params.fbemail;
	
        container.find('input[name=dname]').val(fbname);
        
        btnAccept.tap(function() {
			Page.btnShowLoading(btnAccept[0]);
            
			var dname = container.find('input[name=dname]').val();
			var email = container.find('input[name=email]').val();
			var uname = container.find('input[name=uname]').val();
			var pwd = container.find('input[name=pwd]').val();
			
			function afterSignup(data) {
				Page.btnHideLoading(btnAccept[0]);

				Account = {
					userId : data.uid,
					email : data.email,
					displayName : data.dname,
					userName : data.uname
				};

				if (data.fbobj) {
					Account.fbObject = {
						fbpic : data.fbobj.pic,
						fbname : data.fbobj.dname
					};
					if (data.fbobj.email) {
						Account.fbObject.fbemail = data.fbobj.email;
					}
				}

				localStorage.setItem("u", JSON.stringify(Account));
				Page.open('Profile');
			}

			if (!fbid) {
				Service.User.SignUp(dname, email, uname, pwd, function(data) {
					afterSignup(data);
				});
			} else {
				Service.User.SignUpFB(email, dname, uname, pwd, fbid, fbpic, fbname, fbemail, function(data) {
					afterSignup(data);
				});
			}
        });
		
		// set content binding
		btnAccept.removeClass('disabled');
		/*container.find('input[name=name]')[0].addEventListener('input', function() {
			btnAccept.removeClass('disabled');
		}, false);*/
	}
};