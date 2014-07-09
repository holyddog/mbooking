Page.SignIn = {
	url: 'pages/html/sign_in.html',
	
	init: function(params, container) {	
		// check authen
		if (localStorage.getItem('u')) {
			Account = JSON.parse(localStorage.getItem('u'));
			Page.open('Following');
			
			return;
		}
		
		// declare elements
		var inputText = container.find('input[name=login]');
		var inputPwd = container.find('input[name=pwd]');
		
//        inputText.focus();
        
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		
		var btnAccept = container.find('[data-id=btn_a]');
		
        function login(){
            if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
                
                var dvtoken = '';
                
                if (localStorage.getItem("dvk"))
                	dvtoken = localStorage.getItem("dvk");
                
                Service.User.SignIn(inputText.val(), inputPwd.val(),Config.OS_Int,dvtoken, 
                		function(data) {
                			if (Device.PhoneGap.isReady)
								Device.PhoneGap.setAliasPushnotification(data.email);
									
									// Device.PhoneGap.enablePush();
									Page.btnHideLoading(btnAccept[0]);

									if (data.error) {
										MessageBox.alert({
											message : data.error.message
										});
									}
									else {
										var fbobj = {};
										if (data.fbobj) {
											if (data.fbobj.fbid)
												fbobj = {
													fbpic : data.fbobj.pic,
													dname : data.fbobj.dname
												};
										}

										
										
										Account = {
											userId : data.uid,
											email : data.email,
											displayName : data.dname,
											userName : data.uname,
											picture : data.pic,
											cover : data.cover,
											bookCount : data.pbcount,
											draftCount : data.drcount,
											following:data.following,	
											draftBooks : data.books,
										
											exguide: data.exguide,
											bguide: data.bguide,
											epguide: data.epguide,
											// followerCount: data.fcount,
											// bookCount: data.pbcount

											fbObject : fbobj
										};
										
										console.log(Account);
										
										if (data.fbobj && data.fbobj.email) {
											Account.fbObject.fbemail = data.fbobj.email;
										}
										localStorage.setItem("u", JSON
												.stringify(Account));

										Page.loadMenu();
										Page.open('Explore');
									}
                         }, function() {					
                                    MessageBox.alert({
                                                     message: 'An internal error occurred',
                                                     title: 'Error',
                                                     callback: function() {
                                                     Page.btnHideLoading(btnAccept[0]);							
                                                     }
                                                     });
                         }
                   );
			}
        }
        
        
        btnAccept.tap(login, true);
		
        $('input.signin_inp').on('keydown', function(event) {
			if (event.keyCode == 13) {
				var inp_name = $(this).attr("name");
				// alert(inp_name);
				if (inp_name == 'login') {
					$('input[name=login]').blur();
					$('input[name=pwd]').focus();

				} else if (inp_name == 'pwd') {

					$('input[name=pwd]').blur();
					if (inputText.val().length > 0
							&& inputPwd.val().length >= 6) {
						login();
					}
				}
			}
        });
        
        
		// check required field before enable sign in button
		container.find('input').each(function() {
			var input = $(this)[0];
			input.addEventListener('input', function() {
				if (inputText.val().length > 0 && inputPwd.val().length > 0) {
					btnAccept.removeClass('disabled');
				}
				else {
					btnAccept.addClass('disabled');
				}
			}, false);
		});
		
		container.find('.text_link').tap(function(){
			Page.open('ForgetPass');
			location.reload();
		});
	}
};