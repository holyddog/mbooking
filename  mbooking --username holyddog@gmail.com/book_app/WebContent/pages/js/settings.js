Page.Settings = {
	url: 'pages/html/settings.html',
	init: function(params, container) {
		var self = this;
		
        //newver
        var vcurrent;
        
        if(Config.OS_Int==1)
            vcurrent = Config.IOS_VERSION;
        else
            vcurrent = Config.ANDROID_VERSION;
        
        if(localStorage.getItem("ver")!=vcurrent){
            container.find('.newver').show();
        }
        else{
            container.find('.newver').hide();
        }
        
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
		
		// set content links
        container.find('[data-id=find_friend]').click(function() {
            Page.open('FollowFriend', true);
        });
		container.find('[data-id=chg_pic]').click(function() {
			Page.open('ChangePic', true);
		});
		container.find('[data-id=chg_pwd]').click(function() {
			Page.open('ChangePwd', true);
		});
		container.find('[data-id=disp_name]').click(function() {
			Page.open('ChangeName', true);
		});
		container.find('[data-id=sign_out]').click(function() {			
            localStorage.removeItem('u');
			Account = {};
			Page.loadMenu();
			Page.open('Home');
	   	  if(Device.PhoneGap.isReady){
           		 Device.PhoneGap.logoutFacebook(function(){});
           		 Device.PhoneGap.setAliasPushnotification("");
		  }
		});
		container.find('[data-id=about]').click(function() {
			Page.open('About', true);
		});
		
		self.setImage(container);

		if (Account.fbObject && Account.fbObject.dname) {
			fblogin_check.className = "btn_check check";
		}
        
		var checkbox = container.find('#fblogin_check');
        checkbox.click(function() {
           var timeout = 15000;
           var timeout_lk = 20000;
           var self = $(this);
                if (self.hasClass('check')) {
                    MessageBox.confirm({
                        message: 'By disconnect, you will not be able to log in to The Story via Facebook',
                        callback: function() {
                            function unlink(checkbox,fblogin_check,timer){
                                Page.btnShowLoading(checkbox[0],true,5);
                                checkbox.css('pointer-events','none');
                                Device.PhoneGap.deleteAllPermission(function() {
                                    Device.PhoneGap.logoutFacebook(function() {
                                        fblogin_check.className = "btn_check";
                                        Service.User.unLinkFB(Account.userId, function(data) {
                                            clearTimeout(timer);
                                            delete Account.fbObject;
                                            localStorage.setItem('u', JSON.stringify(Account));
                                            Page.btnHideLoading(checkbox[0]);
                                            checkbox.css('pointer-events','');
                                        });
                                                                   
                                    });
                                });
                            }
                           var timer = setTimeout(function(){
                                Page.btnHideLoading(checkbox[0]);
                                checkbox.css('pointer-events','');
                                MessageBox.confirm({
                                    message: 'Connection timed out. Do you want to retry unlinking facebook ?',
                                    callback: function() {
                                        var timer_al = setTimeout(function(){
                                            Page.btnHideLoading(checkbox[0]);
                                            checkbox.css('pointer-events','');
                                            MessageBox.alert({
                                                title: 'Connection Timed Out',
                                                message: 'Connection timed out. Please check your internet connection and try again.'
                                            });
                                        },timeout);
                                                   
                                        unlink(checkbox,fblogin_check,timer_al);
                                    }
                                });
                            },timeout);
                            
                            unlink(checkbox,fblogin_check,timer);
                        }
                    });
                    
                } else {
                   
                    function link(checkbox,fblogin_check,timer){
                    Page.btnShowLoading(checkbox[0],true,5);
                    checkbox.css('pointer-events','none');
                        Device.PhoneGap.loginFacebook(function(user) {0
                            clearTimeout(timer);
                            var fn = function(data) {
                                Page.btnHideLoading(checkbox[0]);
                                checkbox.css('pointer-events','');
                                
                                if(!data.error){
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
                                }
                                else{
                                    if(data.error.message){
                                        MessageBox.alert({
                                            title: 'Link to facebook failed',
                                            message: data.error.message
                                        });
                                    }
                                }
                                
                            };
                            Service.User.linkFB(Account.userId, user.fbid, user.fbpic, user.dname, user.fbemail, user.access_token, fn);
                        });
                    }

                   var timer = setTimeout(function(){
                        Page.btnHideLoading(checkbox[0]);
                        checkbox.css('pointer-events','');
                        MessageBox.confirm({
                            message: 'Connection timed out. Do you want to retry linking facebook ?',
                            callback: function() {
                                var timer_al = setTimeout(function(){
                                    Page.btnHideLoading(checkbox[0]);
                                    checkbox.css('pointer-events','');
                                    MessageBox.alert({
                                        title: 'Connection Timed Out',
                                        message: 'Connection timed out. Please check your internet connection and try again.'
                                    });
                                },timeout_lk);
                                           
                                link(checkbox,fblogin_check,timer_al);
                            }
                        });
                    },timeout_lk);
                       
                    link(checkbox,fblogin_check,timer);
            }
                       
        });

	},
	
	setImage: function(container) {		
		if (Account.picture) {
			container.find('.chg_pic img').attr('src', Util.getImage(Account.picture, 3));
		}
	}
};