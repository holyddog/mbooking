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
	
	AddPage: function(pid, picture, imageSize, cropPos, caption, ref, bookId, addBy, callback) {
		var url = Service.url + '/addPage.json';
		var params = {
			pid: pid,
			pic : picture,
			size: imageSize,
			crop: cropPos,
			caption : caption,
			bid : bookId, 
			uid : addBy,
			ref: ref
		};
		Web.post(url, params, callback);
	},
	
	AddMultiPages: function(pics, bookId, addBy, callback) {
		var url = Service.url + '/addMultiPages.json';
		var params = {
			pics: pics,
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

	DeletePage : function(pageId, bookId, callback) {
		var url = Service.url + '/deletePage.json';
		var params = {
			pid : pageId,
			bid : bookId
		};
		Web.post(url, params, callback);
	},

	ChangeSeq : function(bookId, fromSeq, toSeq, callback) {
		var url = Service.url + '/changeSeq.json';
		var params = {
			bid : bookId,
			fseq : fromSeq,
			tseq : toSeq
		};
		Web.post(url, params, callback);
	}
};