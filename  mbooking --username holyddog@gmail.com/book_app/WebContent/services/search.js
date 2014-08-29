Service.Search = {
	Users: function(keyword, callback) {
		var url = Service.url + '/findUsersByName.json';
		var params = {
			keyword: keyword
		};
		Web.get(url, params, callback);
	},

	Books: function(keyword, callback) {
		var url = Service.url + '/findBooksByTitle.json';
		var params = {
			keyword: keyword
		};
		Web.get(url, params, callback);
	},

	Tags: function(keyword, callback) {
		var url = Service.url + '/findTags.json';
		var params = {
			keyword: keyword
		};
		Web.get(url, params, callback);
	},

	Explore: function(uid, callback) {
		var url = Service.url + '/explore.json';
		var params = {
			uid: uid
		};
		Web.get(url, params, callback);
	},

	Pickup: function(callback) {
		var url = Service.url + '/pickup.json';
		var params = {};
		Web.get(url, params, callback);
	},

	BooksTag: function(tag, callback) {
		var url = Service.url + '/findBooksByTag.json';
		var params = {
			tag: tag
		};
		Web.get(url, params, callback);
	}
};