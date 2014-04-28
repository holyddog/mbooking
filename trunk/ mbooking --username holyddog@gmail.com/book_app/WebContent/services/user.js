Service.User = {
	SignIn : function(loginName, password, callback) {
		var url = Service.url + '/signIn.json';
		var params = {
			login : loginName,
			pwd : password
		};
		Web.post(url, params, callback);
	},
	SignUp : function(fullName, email, userName, password, callback) {
		var url = Service.url + '/signUp.json';
		var params = {
			dname : fullName,
			email : email,
			uname : userName,
			pwd : password
		};
		Web.post(url, params, callback);
	},
	unLinkFB : function(uid, callback) {
		var url = Service.url + '/unlinkFB.json';
		var params = {
			uid : uid
		};
		Web.post(url, params, callback);
	},
	linkFB : function(uid,fbid,fbpic,fbname,fbemail, callback) {
		var url = Service.url + '/linkFB.json';
		var params = {
			uid : uid,
	        fbid : fbid,
	        fbpic : fbpic,
	        fbname : fbname
		};
	        
        if(fbemail!=null&&fbemail&&fbemail!=undefined)
        {
	        params.fbemail  = fbemail;
	    }
	            
		Web.post(url, params, callback);
	},
	SignInFB : function(fbid, callback) {
		var url = Service.url + '/signInFB.json';
		var params = {
			fbid : fbid
		};
		Web.post(url, params, callback);
	},
	SignUpFB : function(email,fullName,userName, password,fbid,fbpic,fbname,fbemail, callback) {
		var url = Service.url + '/signUpFB.json';
		var params = {
			email : email,
			dname : fullName,
	        uname : userName,
			pwd : password,
	        fbid : fbid,
	        fbpic : fbpic,
	        fbname : fbname
		};
	        
	    if(fbemail!=null&&fbemail&&fbemail!=undefined)
	    {
	    	params.fbemail  = fbemail;
	    }
	        
		Web.post(url, params, callback);
	},
	GetProfile : function(uid, follid, callback) {
		var url = Service.url + '/getProfile.json';
		var params = {
			uid : uid,
			follid : follid
		};
		Web.get(url, params, callback);
	},
	ChangePassword : function(uid, oldpassword, newpassword, callback) {
		var url = Service.url + '/changePassword.json';
		var params = {
			uid : uid,
			oldpwd : oldpassword,
			newpwd : newpassword
		};
		Web.post(url, params, callback);
	},
	ChangeDisplayName : function(uid, dname, callback) {
		var url = Service.url + '/changeDisplayName.json';
		var params = {
			uid : uid,
			dname : dname
		};
		Web.post(url, params, callback);
	},
	ChangeProfilePic: function(uid,pic, callback) {
		var url = Service.url + '/changeProfilePic.json';
		var params = {
			uid: uid,
			pic:pic
		};
		Web.post(url, params, callback);
	},
	GetNotificationByUid: function(uid,skip,limit, callback) {
		var url = Service.url + '/getNotificationByUid.json';
		var params = {
			uid: uid
		};
		
		if(skip!=null&&skip!=undefined)
			params.skip = skip;
			
		if(limit!=null&&limit!=undefined)
			params.limit = limit;
		
		Web.get(url, params, callback);
	},
	ReadedNotification: function(ntid, callback) {
		var url = Service.url + '/readedNotification.json';
		var params = {
			ntid: ntid
		};
		Web.post(url, params, callback);
	}

};