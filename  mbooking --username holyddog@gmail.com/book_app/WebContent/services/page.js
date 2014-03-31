Service.Page = {
	CreatePage: function(bookID,userID,desc,picByteArray,date,callback) {
		var url = Service.url + '/createPage.json';
		var params = {
				bid:bookID,
				uid:userID,
				date:date,			//Non - Require Field
				pic:picByteArray,
				caption:desc		//Non - Require Field
		};
		Web.post(url, params, callback);
	},		
	
	EditPage: function(pageID,bookID,userID,desc,picByteArray,date,callback) {
		var url = Service.url + '/editPage.json';
		var params = {
				pid:pageID,
				bid:bookID,
				uid:userID,
				date:date,			//Non - Require Field
				pic:picByteArray,
				caption:desc		//Non - Require Field
		};
		Web.post(url, params, callback);
	},	
	
	DeletePage: function(pageID,bookID,userID,callback) {
		var url = Service.url + '/deletePage.json';
		var params = {
				pid		:pidID,
				bid		:bookID,
				uid		:userID
		};
		Web.post(url, params, callback);
	}	
};