fblogin_check.className = "ch_logfb checked";
fblogin_check.style.background = "green";

Device.PhoneGap.loginFacebook(function(user) {
	Service.User.linkFB(Account.userId, user.fbid, user.fbpic, user.fbname,
			user.fbemail, function(data) {

				var fbobj = {
					fbpic : user.fbpic,
					fbname : user.fbname
				};

				if (user.fbemail != undefined) {
					fbobj.fbemail = user.fbemail;
				}

				Account.fbObject = fbobj;
				localStorage.setItem('u', JSON.stringify(Account));

			});

});