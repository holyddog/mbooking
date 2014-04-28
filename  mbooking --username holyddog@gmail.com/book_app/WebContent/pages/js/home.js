Page.Home = {
	url: 'pages/html/home.html',
	
	init: function(params, container) {		
		// check authen
		if (localStorage.getItem('u')) {
			Account = JSON.parse(localStorage.getItem('u'));
			Page.open('Profile');
			
			return;
		}
		
		// set content links
		container.find('[data-id=link_f]').tap(function() {
                                            
            Device.PhoneGap.loginFacebook(
                                               
                function(user){
//                        Page.btnShowLoading(container.find('[data-id=link_f]')[0]);
                        Service.User.SignInFB(user.fbid, function(data) {
//                            Page.btnHideLoading(container.find('[data-id=link_f]')[0]);
                                              
                            if (data.error) {
                                              var params={
                                                fbid:user.fbid,
                                                fbpic:user.fbpic,
                                                fbname:user.fbname,
                                                fbemail:user.fbemail
                                              };
                            
                                              Page.open('SignUp',true, params);

                            }
                            else {

                                    Account = {
                                                userId: data.uid,
                                                email: data.email,
                                                displayName: data.dname,
                                                userName: data.uname,
                                                lastEditBook: data.leb,
                                                cover: data.cover,
                                                picture: data.pic,
                                                followerCount: data.fcount,
                                                bookCount: data.pbcount,
                                                fbObject:{fbpic:data.fbobj.pic,fbname:data.fbobj.dname}
                                              };
            
                                              if(data.fbobj.email&&data.fbobj.email!=undefined&&data.fbobj.email!=null&&data.fbobj.email!=""){
                                                    Account.fbObject.fbemail = data.fbobj.email;
                                              
                                              }
                                              
                                    if (data.leb && data.leb.pcount) {
                                        Account.lastEditBook.pageCount = data.leb.pcount;
                                    }
                                    
                                    localStorage.setItem("u", JSON.stringify(Account));
                                    Page.loadMenu();
                                    Page.open('Profile');
                            }
                        });
                                          
                }
        
            );
           
		});
		container.find('[data-id=link_e]').tap(function() {
			Page.open('SignUp', true);
		});
		container.find('[data-id=link_l]').tap(function() {
			Page.open('SignIn', true);
		});
	}
};