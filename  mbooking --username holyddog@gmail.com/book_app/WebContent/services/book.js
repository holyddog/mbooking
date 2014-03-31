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
			uid : userID,
		};
		Web.get(url, params, callback);
	},

	PublishBook : function(userID, callback) {
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
		Web.get(url, params, callback);
	}
};