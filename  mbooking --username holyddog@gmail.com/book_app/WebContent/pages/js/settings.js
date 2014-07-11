Page.Settings = {
	url: 'pages/html/settings.html',
	init: function(params, container) {
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
		
		// set content links
        container.find('[data-id=find_friend]').tap(function() {
            Page.open('FollowFriend', true);
        });
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
	   	  if(Device.PhoneGap.isReady){
           		 Device.PhoneGap.logoutFacebook(function(){});
           		 Device.PhoneGap.setAliasPushnotification("");
		  }
		});
		container.find('[data-id=terms]').tap(function() {
			Page.open('TermsOfUse', true);
		});
		
		self.setImage(container);

		if (Account.fbObject && Account.fbObject.dname) {
			fblogin_check.className = "btn_check check";
		}
        
		var checkbox = container.find('#fblogin_check');
        checkbox.click(function() {
        	if ($(this).hasClass('check')) {
        		MessageBox.confirm({
        			message: 'By disconnect, you will not be able to log in to The Story via Facebook',
					callback: function(button) {

                        Page.btnShowLoading(checkbox[0],true);
                                   checkbox.css('pointer-events','none');
                                   
						Device.PhoneGap.deleteAllPermission(function() {
	        				Device.PhoneGap.logoutFacebook(function() {
	        					fblogin_check.className = "btn_check";

	        					Service.User.unLinkFB(Account.userId, function(data) {
                                    delete Account.fbObject;
	        						localStorage.setItem('u', JSON.stringify(Account));
                                    Page.btnHideLoading(checkbox[0]);
                                     checkbox.css('pointer-events','');
	        					});
                                                           
	        				});
						});
	        		}
        		});
//              navigator.notification.confirm(msg, onConfirm, 'Disconnect Facebook', 'Cancel,Disconnect');
    		} else {

    			Device.PhoneGap.loginFacebook(function(user) {
    				var fn = function(data) {
						var fbobj = {
							fbpic: user.fbpic,
							dname: user.dname,
							token: user.access_token
						};

						if (!user.fbemail) {
							fbobj.fbemail = user.fbemail;
						}

						Account.fbObject = fbobj;
						localStorage.setItem('u', JSON.stringify(Account));
                        fblogin_check.className = "btn_check check";
					};
    				Service.User.linkFB(Account.userId, user.fbid, user.fbpic, user.dname, user.fbemail, user.access_token, fn);
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