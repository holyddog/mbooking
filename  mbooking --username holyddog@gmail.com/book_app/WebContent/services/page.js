Service.Page = {
	CreatePage : function(bookID, userID, desc, picByteArray, date, callback) {
		var url = Service.url + '/createPage.json';
		var params = {
			bid : bookID,
			uid : userID,
			date : date, // Non - Require Field
			pic : picByteArray,
			caption : desc
		// Non - Require Field
		};
		Web.post(url, params, callback);
	},
	
	GetPage: function(pageId, callback) {
		var url = Service.url + '/getPage.json';
		var params = { pid: pageId };
		Web.get(url, params, callback);
	},
	
	AddPage: function(picture, imageSize, cropPos, caption, bookId, addBy, callback) {
		var url = Service.url + '/addPage.json';
		var params = {
			pic : picture,
			size: imageSize,
			crop: cropPos,
			caption : caption,
			bid : bookId, 
			uid : addBy
		};
		Web.post(url, params, callback);
	},
	
	EditCaption: function(pageId, caption, callback) {
		var url = Service.url + '/editCaption.json';
		var params = {
			pid: pageId,
			caption: caption
		};
		Web.post(url, params, callback);
	},

	EditPage : function(pageID, bookID, userID, desc, picByteArray, date,
			callback) {
		var url = Service.url + '/editPage.json';
		var params = {
			pid : pageID,
			bid : bookID,
			uid : userID,
			date : date, // Non - Require Field
			pic : picByteArray,
			caption : desc
		// Non - Require Field
		};
		Web.post(url, params, callback);
	},

	DeletePage : function(pageID, bookID, userID, callback) {
		var url = Service.url + '/deletePage.json';
		var params = {
			pid : pidID,
			bid : bookID,
			uid : userID
		};
		Web.post(url, params, callback);
	}
};