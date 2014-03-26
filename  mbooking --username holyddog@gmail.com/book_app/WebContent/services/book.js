Service.Book = {	
	//Book
	CreateBook: function(bookName,desc,userID,picName,startDate,endDate,tags) {
		var url = Service.url + '/createBook.json';
		var params = {
				title	:bookName,
				desc	:desc,
				fdate	:startDate,	//Non - Require Field
				tdatep	:endDate,	//Non - Require Field
				tags	:tags,		//Non - Require Field
				uid		:userID,
				pic		:picName	//Non - Require Field
		};
		Web.post(url, params, callback);
	},		
	
	CreateBookSimple: function(bookName,desc,userID) {
		Service.Book.CreateBook(bookName,desc,userID,null,null,null,null);
	},	
	
	EditBook: function(bookID,bookName,desc,userID,picName,startDate,endDate,tags) {
		var url = Service.url + '/editBook.json';
		var params = {
				bid		:bookID,
				title	:bookName,
				desc	:desc,
				fdate	:startDate,	//Non - Require Field
				tdatep	:endDate,	//Non - Require Field
				tags	:tags,		//Non - Require Field
				uid		:userID,
				pic		:picName	//Non - Require Field
		};
		Web.post(url, params, callback);
	},		
	
	EditBookBookSimple: function(bookID,bookName,desc,userID,picName) {
		Service.Book.EditBook(bookID,bookName,desc,userID,picName,null,null,null);
	},	
	
	EditBookBookSimple: function(bookID,bookName,desc,userID,picName) {
		Service.Book.EditBook(bookID,bookName,desc,userID,picName,null,null,null);
	},	
	
	DeleteBook: function(bookID,userID) {
		var url = Service.url + '/deleteBook.json';
		var params = {
				bid		:bookID,
				uid		:userID
		};
		Web.post(url, params, callback);
	},		
	
	GetBook: function(bookName,userID) {
		var url = Service.url + '/getBook.json';
		var params = {
				bid		:bookID,
				uid		:userID,
		};
		Web.get(url, params, callback);
	},
	
	GetBooksByUid: function(bookName,userID) {
		var url = Service.url + '/getBooksByUid.json';
		var params = {
				uid		:userID,
		};
		Web.get(url, params, callback);
	},
	
	PublishBook: function(bookName,userID) {
		var url = Service.url + '/publishBook.json';
		var params = {
				bid		:bookID,
				uid		:userID,
		};
		Web.post(url, params, callback);
	},
	
	UnPublishBook: function(bookName,userID) {
		var url = Service.url + '/unpublishBook.json';
		var params = {
				bid		:bookID,
				uid		:userID,
		};
		Web.post(url, params, callback);
	},
	
	//Page
	
	CreatePage: function(bookID,userID,desc,picByteArray,date) {
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
	
	EditPage: function(pageID,bookID,userID,desc,picByteArray,date) {
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
	
	DeletePage: function(pageID,bookID,userID) {
		var url = Service.url + '/deletePage.json';
		var params = {
				pid		:pidID,
				bid		:bookID,
				uid		:userID
		};
		Web.post(url, params, callback);
	}		
};