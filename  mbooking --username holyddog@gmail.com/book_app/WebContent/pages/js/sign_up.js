Page.SignUp = {
	url: 'pages/html/sign_up.html',
	init: function(params, container) {
		
		var full_correct	= false;
		var email_correct	= false;
		var user_correct	= false;
		var pass_correct	= false;
		
		// check authen
		if (localStorage.getItem('u')) {
			Account = JSON.parse(localStorage.getItem('u'));
			Page.open('Profile');
			
			return;
		}
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var fbid = params.fbid;
        var fbpic = params.fbpic;
        var fbname = params.fbname;
        var fbemail = params.fbemail;
	
        container.find('input[name=dname]').val(fbname);
        container.find('input[name=email]').val(fbemail);
        if(fbemail){
        	$('input[name=email]').blur();
        }
            
		var between_check_email = false ;
		var between_check_uname = false ;
		
		var r =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
		function disableDoneBtn (){
			$('[data-id=btn_a]').css('pointer-events', 'none');
			$('[data-id=btn_a]').css('opacity','0.5');
		}
		function enableDoneBtn (){
			$('[data-id=btn_a]').css('pointer-events', '');
			$('[data-id=btn_a]').css('opacity','');
		}
		
		
	    var dname_inp = container.find('input[name=dname]');
	    var email_inp = container.find('input[name=email]');
		var uname_inp = container.find('input[name=uname]');
     	var pwd_inp = container.find('input[name=pwd]');
	    
		
		function checkReadyToSubmit(){
			
			if(dname_inp.val()==''||email_inp.val()==''||uname_inp.val()==''||pwd_inp.val()==''){
				disableDoneBtn();
				return
			}
			
			//alert('no empty');
			
			if(email_inp.attr("data-error")||uname_inp.attr("data-error")||pwd_inp.attr("data-error")){
				disableDoneBtn();
				console.log('have error');
				return
			}
			
			if(between_check_email||between_check_uname)
			{
				disableDoneBtn();
				return	
			}
			
			enableDoneBtn();
		}
		
		disableDoneBtn();
		
		
	    $('input.signin_inp').on( "blur", function() {
	    	var text = $(this).val();
	    	if(text.length>0){
	    		var inp_name = $(this).attr("name");
				if(inp_name=='email'){
				   if(r.test(text)){
					   if(!between_check_email&&$(this).attr("data-error")!="duplicate"){
				
						   $(this).removeAttr("data-error");   
						   between_check_email=true;
						   
						   Service.User.CheckEmail(text,function(data){
							   between_check_email = false;
			    				if($('input[name=email]').val()==text){
				    				if(!data.result){
				    					$('input[name=email]').removeAttr("data-error");		
				    				}else{
				    					$('input[name=email]').attr("data-error","duplicate");
				    					console.log("email duplicate");
				    				}
				    				checkReadyToSubmit();
			    				}
			    			});
						   
						   
					   }
				   }
				   else{
					  $(this).attr("data-error","format");
					  console.log("email format");
				   }
				}
				checkReadyToSubmit();
	    	}		
		});
	    
	    var uname_timer;
	    email_inp.focus();
	    $('input.signin_inp').on('input', function() { 
	    	var text = $(this).val();
	    	if(text.length>0){
	    		 var inp_name = $(this).attr("name");
				 if(inp_name=='uname'){
					 clearTimeout(uname_timer);
		    		 between_check_uname = true;
					 if(text.length>=6&&text.length<=15){
						   $(this).removeAttr("data-error");   
				    		uname_timer = setTimeout(
								    		function(){
								    			//service check uname «éÓ
								    			Service.User.CheckUserName(text,function(data){
								    				between_check_uname = false;
								    				if($('input[name=uname]').val()==text){
									    				if(!data.result){
									    					$('input[name=uname]').removeAttr("data-error");		
									    				}else{
									    					$('input[name=uname]').attr("data-error","duplicate");
									    					console.log("uname duplicate");
									    				}
									    				checkReadyToSubmit();
								    				}
								    			});
								    		}
								    	,3000);
					 }
					 else{
						   $(this).attr("data-error","length not macth");
						   console.log("uname not in range 6-15");
					 } 
			    }
				else if(inp_name=='pwd'){
					if(text.length>=6){
					   $(this).removeAttr("data-error");   
					}
					else{
					   $(this).attr("data-error","shortpass");
					   console.log("pwd < 6");
					}
				}
				else if(inp_name =='email'){
					disableDoneBtn();
					$(this).removeAttr("data-error");
					return;
				}	
	    	}
	    	checkReadyToSubmit();
	    });
	    
	    //Config phonegap <preference name="KeyboardDisplayRequiresUserAction" value="false" />
	    $('input.signin_inp').on('keydown', function(event) { 
	    	if(event.keyCode==13){
	    		var inp_name = $(this).attr("name");
//	    		alert(inp_name);
				if(inp_name=='dname'){
					$('input[name=dname]').blur();
					$('input[name=email]').focus();
					
				}else if(inp_name=='email'){
					
					$('input[name=email]').blur();
					$('input[name=uname]').focus();
					
				}else if(inp_name=='uname'){
					
					$('input[name=uname]').blur();
					$('input[name=pwd]').focus();
				
				}else if(inp_name=='pwd'){
					//PB
					$('[data-id=btn_a]').trigger( "click" );
					//$('input[name=pwd]').blur();
				}
	    	}
	    });
	    
	  //uname //typing check delay then check uname (service)|letter uname
	  //password // typing check delay then check password length >=6|| too easy
	    
		
        var btnAccept = container.find('[data-id=btn_a]');
        btnAccept.tap(function() {
			
        	Page.btnShowLoading(btnAccept[0]);
            var dname = dname_inp.val();
			var email = email_inp.val();
			var uname = uname_inp.val();
			var pwd   = pwd_inp.val();
			
			function afterSignup(data) {
                      
                Device.PhoneGap.setAliasPushnotification(data.email);
//                      Device.PhoneGap.enablePush();
				Page.btnHideLoading(btnAccept[0]);
                      
				Account = {
					userId : data.uid,
					email : data.email,
					displayName : data.dname,
					userName : data.uname
				};

				if (data.fbobj) {
					Account.fbObject = {
						fbpic : data.fbobj.pic,
						fbname : data.fbobj.dname
					};
					if (data.fbobj.email) {
						Account.fbObject.fbemail = data.fbobj.email;
					}
				}

				localStorage.setItem("u", JSON.stringify(Account));
				Page.open('Profile');
			}

			if (!fbid) {
                    var dvtoken = '';
                    if(localStorage.getItem("dvk"))
                    localStorage.getItem("dvk");
				Service.User.SignUp(dname, email, uname, pwd,Config.OS_Int,dvtoken, function(data) {
					afterSignup(data);
				});
			} else {
				Service.User.SignUpFB(email, dname, uname, pwd, fbid, fbpic, fbname, fbemail, function(data) {
					afterSignup(data);
				});
			}
        });
		
		// set content binding
		btnAccept.removeClass('disabled');
		/*container.find('input[name=name]')[0].addEventListener('input', function() {
			btnAccept.removeClass('disabled');
		}, false);*/
	}
};