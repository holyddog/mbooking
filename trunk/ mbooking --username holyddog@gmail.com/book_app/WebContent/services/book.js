Service.Book = {
//	CreateBook : function(bookName, desc, userID, picName, startDate, endDate,
//			tags, pub, callback) {
//		var url = Service.url + '/createBook.json';
//		var params = {
//			title : bookName,
//			desc : desc,
//			fdate : startDate, // Non - Require Field
//			tdatep : endDate, // Non - Require Field
//			tags : tags, // Non - Require Field
//			uid : userID,
//			pic : picName,
//			pub: pub
//		};
//		Web.post(url, params, callback);
//	},
		
	CreateBook: function(title, desc, userId, pub, callback) {
		var url = Service.url + '/createBook.json';
		var params = {
			title : title,
			desc : desc,
			uid : userId,
			pub: pub
		};
		Web.post(url, params, callback);
	},
	
	EditBook: function(bid, title, desc, pub, callback) {
		var url = Service.url + '/createBook.json';
		var params = {
			bid: bid,
			title : title,
			desc : desc,
			pub: pub
		};
		Web.post(url, params, callback);
	},

	CreateBookSimple : function(bookName, desc, userID, callback) {
		Service.Book.CreateBook(bookName, desc, userID, null, null, null, null,
				callback);
	},

	LikeBook: function(bid, uid, like, callback) {
		var url = Service.url + '/likeBook.json';
		var params = {
			bid : bid,
			uid : uid,
			like : like
		};
		Web.post(url, params, callback);
	},

	FavBook: function(bid, uid, fav, callback) {
		var url = Service.url + '/favBook.json';
		var params = {
			bid : bid,
			uid : uid,
			fav : fav
		};
		Web.post(url, params, callback);
	},

//	EditBook : function(bookID, bookName, desc, userID, picName, startDate,
//			endDate, tags, callback) {
//		var url = Service.url + '/editBook.json';
//		var params = {
//			bid : bookID,
//			title : bookName,
//			desc : desc,
//			fdate : startDate, // Non - Require Field
//			tdatep : endDate, // Non - Require Field
//			tags : tags, // Non - Require Field
//			uid : userID,
//			pic : picName // Non - Require Field
//		};
//		Web.post(url, params, callback);
//	},

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

	DeleteBook : function(bookId, userId, callback) {
		var url = Service.url + '/deleteBook.json';
		var params = {
			bid : bookId,
			uid : userId
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

	GetBookData : function(bookId, userId, guestId, callback) {
		var url = Service.url + '/getBook.json';
		var params = {
			bid : bookId,
			uid : userId,
			gid : guestId,
			count: true
			
		};
		Web.get(url, params, callback);
	},
	
	GetBookByBid: function(bid, callback) {
		var url = Service.url + '/getBook.json';
		var params = {
			bid : bid
		};
		Web.get(url, params, callback);
		
	},
	
	ChangeCover: function(bid, cover, callback) {
		var url = Service.url + '/changeCover.json';
		var params = {
			bid: bid,
			cover: cover
		};
		Web.post(url, params, callback);
		
	},

	GetBooksByUid : function(userID,skip,limit, callback) {
		var url = Service.url + '/getBooksByUid.json';
		var params = {
			uid : userID
		};
		
		if(skip!=null&&skip!=undefined)
			params.skip = skip;
			
		if(limit!=null&&limit!=undefined)
			params.limit = limit;
		
		Web.get(url, params, callback);
	},
	
	GetBooksByUidWithState : function(userID,pbstate,skip,limit, callback) {
		var url = Service.url + '/getBooksByUid.json';
		var params = {
			uid : userID
		};
		//State -> 0 or null :all , 1:publish, 2:un-publish
		
		if(pbstate!=null&&pbstate!=undefined)
			params.pbstate = pbstate;
					
		if(skip!=null&&skip!=undefined)
			params.skip = skip;
			
		if(limit!=null&&limit!=undefined)
			params.limit = limit;
		
		Web.get(url, params, callback);
	},

	PublishBook : function(bookId, userId, cover, callback) {
		var url = Service.url + '/publishBook.json';
		var params = {
			bid : bookId,
			uid : userId,
			cover: cover
		};
		Web.post(url, params, callback);
	},

	UnpublishBook : function(bookId, userId, callback) {
		var url = Service.url + '/unpublishBook.json';
		var params = {
			bid : bookId,
			uid : userId,
		};
		Web.post(url, params, callback);
	},

//	GetPublishBooks : function(callback) {
//		var url = Service.url + '/getPublishBooks.json';
//		var params = {};
//		Web.get(url, params, callback);
//	},
	
	GetPublishBooks : function(skip, limit, callback,notconnect,retry,wait) {
		var url = Service.url + '/getPublishBooks.json';
		var params = {};
		
		if(skip!=null&&skip!=undefined)
			params.skip = skip;
        
		if(limit!=null&&limit!=undefined)
			params.limit = limit;
		
		Web.get(url, params, callback,null,notconnect,retry,wait);
	},
	
	GetPublishBooksByTag : function(tag, skip, limit, callback) {
		var url = Service.url + '/getPublishBooksByTag.json';
		var params = {
			tag: tag,
			skip: skip,
			limit: limit
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
    FollowMulti: function(authorID,userID,callback){
        var url = Service.url + '/followMulti.json';
        var params = {
            auid	:authorID,  //String "id1:id2:id3"
            uid		:userID
        };
        Web.post(url, params, callback);
    },
    
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
	
//	GetFollowBooksByUID: function(userID,callback){
//		var url = Service.url + '/getFollowBooksByUID.json';
//		var params = {
//				uid	:userID
//		};
//		Web.get(url, params, callback);
//	},
	
	GetFollowActivity: function(uid, skip, limit, callback,error){
		var url = Service.url + '/getFollowActivity.json';
		var params = {
			uid: uid,
			skip: skip,
			limit: limit
		};		
		Web.get(url, params, callback,error);
	},
	
	GetFollowBooksByUID: function(userID,skip,limit,callback,error){
		var url = Service.url + '/getFollowBooksByUID.json';
		var params = {
				uid	:userID
		};
		
		if(skip!=null&&skip!=undefined)
			params.skip = skip;
			
		if(limit!=null&&limit!=undefined)
			params.limit = limit;
		
		Web.get(url, params, callback,error);
	},
	
	GetFollowPagessByUID: function(userID,skip,limit,callback){
		var url = Service.url + '/getFollowPagessByUID.json';
		var params = {
				uid	:userID
		};
		
		if(skip!=null&&skip!=undefined)
			params.skip = skip;
			
		if(limit!=null&&limit!=undefined)
			params.limit = limit;
			
		Web.get(url, params, callback);
	},
	
	GetFollowers: function(authorID,callback){
		var url = Service.url + '/getFollowers.json';
		var params = {
				auid	:authorID
		};
		Web.get(url, params, callback);
	},
	
	PostComment: function(bid,uid,comment,callback){
		var url = Service.url + '/postComment.json';
		var params = {
				bid	:bid,
				uid :uid,
				comment :comment
		};
		Web.post(url, params, callback);
	},	

	UpdateTag : function(bid, tag, isNew, callback) {
		var url = Service.url + '/updateTag.json';
		var params = {
			bid : bid,
			tag : tag,
			isNew : isNew
		};
		Web.post(url, params, callback);
	},
	
	GetComments: function(bid,skip,limit,callback){
		var url = Service.url + '/findCommentsByBid.json';
		var params = {
				bid	:bid
		};
		
		params.skip = skip;
		params.limit = limit;
		
		Web.get(url, params, callback);
	},
	AcceptNotification: function(uid, auid, allow,callback){
		var url = Service.url + '/allowFollowingNotification.json';
		var params = {
				uid:uid,
				auid:auid,
				allow:allow
		};
		Web.post(url, params, callback);
	}
	
};