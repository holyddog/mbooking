Service.Book = {
	CreateBook : function(bookName, desc, userID, picName, startDate, endDate,
			tags, callback) {
		var url = Service.url + '/createBook.json';
		var params = {
			title : bookName,
			desc : desc,
			fdate : startDate, // Non - Require Field
			tdatep : endDate, // Non - Require Field
			tags : tags, // Non - Require Field
			uid : userID,
			pic : picName
		// Non - Require Field
		};
		Web.post(url, params, callback);
	},

	CreateBookSimple : function(bookName, desc, userID, callback) {
		Service.Book.CreateBook(bookName, desc, userID, null, null, null, null,
				callback);
	},

	EditBook : function(bookID, bookName, desc, userID, picName, startDate,
			endDate, tags, callback) {
		var url = Service.url + '/editBook.json';
		var params = {
			bid : bookID,
			title : bookName,
			desc : desc,
			fdate : startDate, // Non - Require Field
			tdatep : endDate, // Non - Require Field
			tags : tags, // Non - Require Field
			uid : userID,
			pic : picName // Non - Require Field
		};
		Web.post(url, params, callback);
	},

	EditBookBookSimple : function(bookID, bookName, desc, userID, picName,
			callback) {
		Service.Book.EditBook(bookID, bookName, desc, userID, picName, null,
				null, null, callback);
	},

	EditBookBookSimple : function(bookID, bookName, desc, userID, picName,
			callback) {
		Service.Book.EditBook(bookID, bookName, desc, userID, picName, null,
				null, null, callback);
	},

	DeleteBook : function(bookID, userID, callback) {
		var url = Service.url + '/deleteBook.json';
		var params = {
			bid : bookID,
			uid : userID
		};
		Web.post(url, params, callback);
	},

	GetBook : function(bookID, userID, callback) {
		var url = Service.url + '/getBook.json';
		var params = {
			bid : bookID,
			uid : userID,
		};
		Web.get(url, params, callback);
	},

	GetBooksByUid : function(userID, callback) {
		var url = Service.url + '/getBooksByUid.json';
		var params = {
			uid : userID
		};
		Web.get(url, params, callback);
	},
	
	GetBooksByUid : function(userID,pbstate,skip,limit, callback) {
		var url = Service.url + '/getBooksByUid.json';
		var params = {
			uid : userID,
			pbstate:pbstate,	//0||null : all, 1: publish, 2: un-publish (draft)
			skip:skip,
			limit:limit
		};
		Web.get(url, params, callback);
	},

	PublishBook : function(bookID, userID, callback) {
		var url = Service.url + '/publishBook.json';
		var params = {
			bid : bookID,
			uid : userID,
		};
		Web.post(url, params, callback);
	},

	UnPublishBook : function(userID, callback) {
		var url = Service.url + '/unpublishBook.json';
		var params = {
			bid : bookID,
			uid : userID,
		};
		Web.post(url, params, callback);
	},

	GetPublishBooks : function(callback) {
		var url = Service.url + '/getPublishBooks.json';
		var params = {};
		Web.get(url, params, callback);
	},
	
	GetPublishBooks : function(skip, limit, callback) {
		var url = Service.url + '/getPublishBooks.json';
		var params = {
				skip:skip,
				limit:limit
		};
		Web.get(url, params, callback);
	},
	
	//Page
	
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
	},		
	
	//Follow
	
	FollowAuthor: function(authorID,userID,callback){
		var url = Service.url + '/followAuthor.json';
		var params = {
				auid	:authorID,
				uid		:userID
		};
		Web.post(url, params, callback);
	},
	
	UnFollowAuthor: function(authorID,userID,callback){
		var url = Service.url + '/unfollowAuthor.json';
		var params = {
				auid	:authorID,
				uid		:userID
		};
		Web.post(url, params, callback);
	},
	
	GetFollowAuthors: function(userID,callback){
		var url = Service.url + '/getFollowAuthors.json';
		var params = {
				uid	:userID
		};
		Web.get(url, params, callback);
	},
	
	GetFollowBooksByUID: function(userID,callback){
		var url = Service.url + '/getFollowBooksByUID.json';
		var params = {
				uid	:userID
		};
		Web.get(url, params, callback);
	},
	
	GetFollowBooksByUID: function(userID,skip,limit,callback){
		var url = Service.url + '/getFollowBooksByUID.json';
		var params = {
				uid	:userID,
				skip:skip,
				limit:limit
		};
		Web.get(url, params, callback);
	},
	
	GetFollowPagessByUID: function(userID,skip,limit,callback){
		var url = Service.url + '/getFollowPagessByUID.json';
		var params = {
				uid	:userID,
				skip:skip,
				limit:limit
		};
		Web.get(url, params, callback);
	},
	
	GetFollowers: function(authorID,callback){
		var url = Service.url + '/getFollowers.json';
		var params = {
				auid	:authorID
		};
		Web.get(url, params, callback);
	}
	
};