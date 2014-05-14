Page.Settings = {
	url: 'pages/html/settings.html',
	init: function(params, container) {
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
		
		// set content links
		container.find('[data-id=chg_pic]').tap(function() {
			Page.open('ChangePic', true);
		});
		container.find('[data-id=chg_pwd]').tap(function() {
			Page.open('ChangePwd', true);
		});
		container.find('[data-id=disp_name]').tap(function() {
			Page.open('ChangeName', true);
		});
		container.find('[data-id=sign_out]').tap(function() {			
            localStorage.removeItem('u');
			Account = {};
			Page.open('Home');
                      
            Device.PhoneGap.logoutFacebook(function(){});
		});
		self.setImage(container);

		if (Account.fbObject && Account.fbObject.fbname) {
			fblogin_check.className = "ch_logfb checked";
			fblogin_check.style.background = "green";
		}
        
		var checkbox = container.find('#fblogin_check');
        checkbox.click(function() {                     
        	if ($(this).hasClass('checked')) {
        		MessageBox.confirm({
        			message: 'By disconnect, you will not be able to log in to The Story via Facebook',
					callback: function(button) {
	        			if (button == 2) {
	        				Device.PhoneGap.logoutFacebook(function() {
	        					fblogin_check.className = "ch_logfb";
	        					fblogin_check.style.background = "";

	        					Service.User.unLinkFB(Account.userId, function(data) {
	        						var fbobj = {};
	        						Account.fbObject = fbobj;
	        						localStorage.setItem('u', JSON.stringify(Account));
	        					});
	        				});
	        			}
	        		}
        		});
//              navigator.notification.confirm(msg, onConfirm, 'Disconnect Facebook', 'Cancel,Disconnect');
    		} else {
    			fblogin_check.className = "ch_logfb checked";
    			fblogin_check.style.background = "green";

    			Device.PhoneGap.loginFacebook(function(user) {
    				var fn = function(data) {
						var fbobj = {
							fbpic: user.fbpic,
							fbname: user.fbname
						};

						if (!user.fbemail) {
							fbobj.fbemail = user.fbemail;
						}

						Account.fbObject = fbobj;
						localStorage.setItem('u', JSON.stringify(Account));

					};
    				Service.User.linkFB(Account.userId, user.fbid, user.fbpic, user.fbname, user.fbemail, fn);
    			});
    		}
        
        });

	},
	
	setImage: function(container) {		
		if (Account.picture) {
			container.find('.chg_pic img').attr('src', Util.getImage(Account.picture, 3));
		}
	}
};