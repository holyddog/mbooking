Page.Share = {
	url: 'pages/html/share.html',
	init: function(params, container) {	
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back(function(c, page) {
			    if(page.reverseIndex){
					page.reverseIndex(c);
				}
			});
		});
		
		var btnCheck = container.find('[data-id=btn_c]'); 
		btnCheck.tap(function() {
			if (!btnCheck.hasClass('check')) {
				var allow = function() {
					btnCheck.addClass('check');
					btnAccept.removeClass('disabled');
					
					Account.fbObject.off = false;
					localStorage.setItem('u', JSON.stringify(Account));
				};
				
				if (Account.fbObject && Account.fbObject.token) {
					allow();
				}
				else {
					Page.showLoading('Connecting...');
					self.fbConnect(function() {
						Page.hideLoading();
						
						allow();
					});					
				}
			}		
			else {
				Account.fbObject.off = true;
				localStorage.setItem('u', JSON.stringify(Account));
				btnCheck.removeClass('check');
				btnAccept.addClass('disabled');
			}
		});

		var btnAccept = container.find('[data-id=btn_a]');
		if (Account.fbObject && Account.fbObject.fbname) {
			var fb = Account.fbObject;
			if (fb.off) {
				btnCheck.removeClass('check');
				btnAccept.addClass('disabled');
			}
			else {
				btnCheck.addClass('check');
				btnAccept.removeClass('disabled');
			}
		}
		
		var inputText = container.find('[name=text]');
		var focus = function(el) {
			el.focus();
			el.setSelectionRange && el.setSelectionRange(0, 0);
		};
		focus(inputText[0]);
		
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
				
				Service.Book.GetBookByBid(params.bid, function(data) {					
					self.fbPost(data.bid, data.title, data.desc, Util.getImage(data.pic, 2), inputText.val(), function() {
						Page.btnHideLoading(btnAccept[0]);
						
						MessageBox.drop('Your book has been shared to facebook');
						
						Page.back();
					});
				});
			}
		}, true);
	},
	
	fbConnect: function(callback) {
		Device.PhoneGap.loginFacebook(function(user) {
			var fn = function(data) {
				var fbobj = {
					fbpic: user.fbpic,
					fbname: user.fbname,
					token: user.access_token
				};

				if (!user.fbemail) {
					fbobj.fbemail = user.fbemail;
				}

				Account.fbObject = fbobj;
				localStorage.setItem('u', JSON.stringify(Account));
				
				callback();
			};
			Service.User.linkFB(Account.userId, user.fbid, user.fbpic, user.fbname, user.fbemail, user.access_token, fn);
		});
	},
	
	fbPost: function(bid, title, desc, pic, message, callback) {
		var post = function() {
			var link = Config.WEB_BOOK_URL + '?bid=' + bid;
			
			var privacy = {
				"value" : "EVERYONE"
			};
			var opt = {
				access_token: Account.fbObject.token,
				message : message,
				
				link : link,
				name : title,
				description : desc,
				picture : pic,

				caption : "The Story Application",
				privacy: privacy
	        };
	    	var cb = function(response) {	    		
	            if (!response || response.error) { 
	            	console.error(JSON.stringify(response.error));
					callback(false);
	            } else {
	            	callback(true);
	            }
	        };
	    	FB.api("/me/feed", 'post', opt, cb); 
		};
		post();
	}
};