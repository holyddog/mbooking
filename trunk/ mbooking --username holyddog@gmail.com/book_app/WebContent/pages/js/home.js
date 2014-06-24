Page.Home = {
	url: 'pages/html/home.html',
	init: function(params, container) {
		// check authen
		if (localStorage.getItem('u')) {
			Account = JSON.parse(localStorage.getItem('u'));
			Page.open('Explore');
                       
			if(Device.PhoneGap.isReady)
                    	Device.PhoneGap.setAliasPushnotification(Account.email);
			
			return;
		}
		
		var panel = container.find('#login_panel');
		
		var owl = container.find("#owl-example").owlCarousel({
			singleItem: true
		});
		owl.find('.owl-item .item').height(window.innerHeight);
		owl.find('.owl-controls').css('bottom', panel[0].offsetHeight + 'px');
		owl.find('.owl-item .item .promo').height((window.innerHeight - panel[0].offsetHeight - 30) + 'px');
		owl.find('.owl-item .item .image').height((window.innerHeight - panel[0].offsetHeight) / 2 + 'px');
		
		// set content links
		container.find('[data-id=link_f]').tap(function() {
			var fn = function(user) {
				var dvtoken = '';
	            if(localStorage.getItem("dvk"))
	            dvtoken = localStorage.getItem("dvk");
	            Page.showLoading('Loading information...');
				Service.User.SignInFB(user.fbid,Config.OS_Int,dvtoken, function(data) {		
					Page.hideLoading();
					if (data.error) {
						var params = {
							fbid : user.fbid,
							fbpic : user.fbpic,
							dname : user.dname,
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
							cover : data.cover,
							picture : data.pic,
							followerCount : data.fcount,
							bookCount : data.pbcount,
							following:data.following,
							draftCount : data.drcount,
							draftBooks : data.books,
							
							fbObject : {
								fbpic : data.fbobj.pic,
								dname : data.fbobj.dname,
								token: data.fbobj.token
							}
						};
			
						if (data.fbobj.email) {
							Account.fbObject.fbemail = data.fbobj.email;
						}			
						localStorage.setItem("u", JSON.stringify(Account));
						
						Page.loadMenu();
						Page.open('Explore');
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