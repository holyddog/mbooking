Service.User = {
	CheckEmail	: function(email, callback) {
		var url = Service.url + '/checkEmail.json';
		var params = {
			email : email
		};
		Web.get(url, params, callback);
	},
	CheckUserName	: function(userName, callback) {
		var url = Service.url + '/checkUserName.json';
		var params = {
				uname : userName
		};
		Web.get(url, params, callback);
	},
	SignIn : function(loginName, password,os,dvtoken, callback, error) {
			var url = Service.url + '/signIn.json';
			var params = {
				login : loginName,
				pwd : password,
	            os : os,
	            dvtoken : dvtoken
			};
			Web.post(url, params, callback, error);
		},
	SignUp : function(fullName, email, userName, password,os,dvtoken, callback, error) {
			var url = Service.url + '/signUp.json';
			var params = {
				dname : fullName,
				email : email,
				uname : userName,
				pwd : password,
	            os : os,
	            dvtoken : dvtoken
			};
			Web.post(url, params, callback, error);
	},
	unLinkFB : function(uid, callback) {
		var url = Service.url + '/unlinkFB.json';
		var params = {
			uid : uid
		};
		Web.post(url, params, callback);
	},
	linkFB : function(uid,fbid,fbpic,fbname,fbemail, access_token,callback) {
		var url = Service.url + '/linkFB.json';
		var params = {
			uid : uid,
	        fbid : fbid,
	        fbpic : fbpic,
	        fbname : fbname,
	        token: access_token
		};
	        
        if(fbemail!=null&&fbemail&&fbemail!=undefined)
        {
	        params.fbemail  = fbemail;
	    }
	            
		Web.post(url, params, callback);
	},
	SignInFB : function(fbid,os,dvtoken, callback) {
		var url = Service.url + '/signInFB.json';
		var params = {
			fbid : fbid,
            os : os,
            dvtoken : dvtoken
		};
		Web.post(url, params, callback);
	},
	SignUpFB : function(email, fullName, userName, password, fbid, fbpic, fbname, fbemail,os,dvtoken, callback) {
		var url = Service.url + '/signUpFB.json';
		var params = {
			email : email,
			dname : fullName,
			uname : userName,
			pwd : password,
			fbid : fbid,
			fbpic : fbpic,
			fbname : fbname,
            os : os,
            dvtoken : dvtoken
		};

		if (fbemail != null && fbemail && fbemail != undefined) {
			params.fbemail = fbemail;
		}

		Web.post(url, params, callback);
	},
	GetProfile : function(userId, guestId, callback, error) {
		var url = Service.url + '/getProfile.json';
		var params = {
			uid : userId,
			gid : guestId
		};
		Web.get(url, params, callback, error);
	},
	GetPublicBooks : function(userId, start, limit, callback) {
		var url = Service.url + '/getPublicBooks.json';
		var params = {
			uid : userId,
			start : start,
			limit: limit
		};
		Web.get(url, params, callback);
	},
	GetPrivateBooks : function(userId, start, limit, callback) {
		var url = Service.url + '/getPrivateBooks.json';
		var params = {
			uid : userId,
			start : start,
			limit: limit
		};
		Web.get(url, params, callback);
	},
	GetFavBooks : function(userId, start, limit, callback) {
		var url = Service.url + '/getFavBooks.json';
		var params = {
			uid : userId,
			start : start,
			limit: limit
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
	ChangeProfileCover: function(uid, pic, callback) {
		var url = Service.url + '/changeProfileCover.json';
		var params = {
			uid: uid,
			pic: pic
		};
		Web.post(url, params, callback);
	},
	GetNotificationByUid: function(uid,skip,limit, callback,error) {
		var url = Service.url + '/getNotificationByUid.json';
		var params = {
			uid: uid
		};
		
		if(skip!=null&&skip!=undefined)
			params.skip = skip;
			
		if(limit!=null&&limit!=undefined)
			params.limit = limit;
		
		Web.get(url, params, callback,error);
	},
	CountNotifications: function(uid, callback) {
		var url = Service.url + '/countNotifications.json';
		var params = {
			uid: uid
		};
		Web.update(url, params, callback);
	},
	
	FindFollowing: function(uid, callback) {
		var url = Service.url + '/getFollowing.json';
		var params = {
			uid: uid
		};
		Web.get(url, params, callback);
	},
	
	FindFollowers: function(uid, callback) {
		var url = Service.url + '/getFollowers.json';
		var params = {
			uid: uid
		};
		Web.get(url, params, callback);
	},
	FindFBFriend:function(uid,fbid,callback){
		var url = Service.url + '/getFBFriendsList.json';
		var params = {
			uid:uid,
			fbid: fbid //list
		};
		Web.post(url, params, callback);
	},
	FollowMulti:function(uid,callback){
		var url = Service.url + '/followMulti.json';
		var params = {
			uid: uid,
			auid:auld	//list
		};
		Web.post(url, params, callback);
	},
	
	
	CheckAccount:function(user,callback){
		var url = Service.url + '/checkAccount.json';
		var params = {
			user:user
		};
		Web.get(url, params, callback);
	},
	
	SendForgetPassToEmail:function(email,callback){
		var url = Service.url + '/sendForgetPassToEmail.json';
		var params = {
				email:email
		};
		Web.post(url, params, callback);
	},
	
	ViewGuide:function(guide,uid,callback){
		var url = Service.url + '/viewGuide.json';
		var params = {
				guide:guide,
				uid:uid
		};
		Web.post(url, params, callback);
	},
	
	//version 0.2
	SubmitReport:function(type, bid, uid, msg, callback){
		var url = Service.url + '/submitReport.json';
		var params = {
			type: type,
			bid: bid,
			uid: uid,
			msg: msg
		};
		Web.post(url, params, callback);
	},
	
	SubmitReportWithType:function(type, subtype,uid,uname,auid,auname,oid,msg,comment, callback){
		var url = Service.url + '/submitReportWithType.json';
		var params = {
			type: type,
			subtype:subtype,
			uid:uid,
			uname: uname,
			auid: auid,
			auname:auname,
			oid:oid,
			msg:msg,
			comment:comment
		};
		Web.post(url, params, callback);
	}
	
};