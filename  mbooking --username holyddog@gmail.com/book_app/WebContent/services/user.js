Service.User = {
	SignIn: function(loginName, password, callback) {
		var url = Service.url + '/signIn.json';
		var params = {
			login: loginName,
			pwd: password
		};
		Web.post(url, params, callback);
	},		
	SignUp: function(fullName, email, userName, password, callback) {
		var url = Service.url + '/signUp.json';
		var params = {
			dname: fullName,
			email: email,
			uname: userName,
			pwd: password
		};
		Web.post(url, params, callback);
	},		
	GetProfile: function(uid, callback) {
		var url = Service.url + '/getProfile.json';
		var params = {
			uid: uid
		};
		Web.get(url, params, callback);
	}
};