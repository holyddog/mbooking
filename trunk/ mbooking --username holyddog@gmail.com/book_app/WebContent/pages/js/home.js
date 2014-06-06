Page.Home = {
	url: 'pages/html/home.html',
	init: function(params, container) {
        
		// check authen
		if (localStorage.getItem('u')) {
			Account = JSON.parse(localStorage.getItem('u'));
			Page.open('Profile');
                       
			if(Device.PhoneGap.isReady)
                    	Device.PhoneGap.setAliasPushnotification(Account.email);
			
			return;
		}
		
		// set content links
		container.find('[data-id=link_f]').tap(function() {
			var fn = function(user) {
				Service.User.SignInFB(user.fbid, function(data) {	
					if (data.error) {
						var params = {
							fbid : user.fbid,
							fbpic : user.fbpic,
							fbname : user.fbname,
							fbemail : user.fbemail
						};	
						Page.open('SignUp', true, params);
			
					} else {
		 			     if(Device.PhoneGap.isReady)
                    				Device.PhoneGap.setAliasPushnotification(data.email);
						Account = {
							userId : data.uid,
							email : data.email,
							displayName : data.dname,
							userName : data.uname,
							lastEditBook : data.leb,
							cover : data.cover,
							picture : data.pic,
							followerCount : data.fcount,
							bookCount : data.pbcount,
							fbObject : {
								fbpic : data.fbobj.pic,
								fbname : data.fbobj.dname,
								token: data.fbobj.token
							}
						};
			
						if (data.fbobj.email) {
							Account.fbObject.fbemail = data.fbobj.email;
						}			
						localStorage.setItem("u", JSON.stringify(Account));
						
						Page.loadMenu();
						Page.open('Profile');
					}
				});	
			};
			Device.PhoneGap.loginFacebook(fn);
		});
		container.find('[data-id=link_e]').tap(function() {
			Page.open('SignUp', true);
		});
		container.find('[data-id=link_l]').tap(function() {
			Page.open('SignIn', true);
		});
	}
};