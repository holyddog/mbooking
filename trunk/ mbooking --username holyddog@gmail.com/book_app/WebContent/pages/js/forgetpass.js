Page.ForgetPass = {
	url: 'pages/html/forgetpass.html',
	
	init: function(params, container) {
		var inputText = container.find('input[name=user]');
		var searchbtn = container.find('[data-id=btn_a]');
		var inp_layout = container.find('.input_layout');
		var cancel_btn = container.find('[data-id=cancel]');
		var sendmail_btn = container.find('[data-id=sendmail]');
		var email='';
		
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});	
		
		function findAccount (user){
			Page.btnShowLoading(searchbtn[0]);	
			Service.User.CheckAccount(user,function(data){
				console.log(data);
				Page.btnHideLoading(searchbtn[0]);	
				searchbtn.addClass('disabled');
				
				if(data.uid){
					
				container.find('[data-id=uname]').html(data.uname);	
				var img = container.find('.uimage img')[0];
				img.src = (data.pic)? Util.getImage(data.pic, 3): 'images/user.jpg';
				
				email = data.email;
			
				inp_layout.css('opacity',0.5);
				inp_layout.css('pointer-events', 'none');
				container.find('.user_detail').show();
				
				}else{
					
					container.find('[data-lbl=uname]').html('Email or username is not exist');
				}
			});
		
		}
		
		cancel_btn.tap(function(){
			inp_layout.css('opacity','');
			inp_layout.css('pointer-events', '');
			container.find('.user_detail').hide();		
			inputText.focus();
			searchbtn.removeClass('disabled');
		});	
		
		sendmail_btn.tap(function(){

			cancel_btn.css('pointer-events', 'none');
			sendmail_btn.css('pointer-events', 'none');
			sendmail_btn.html('Sending Email ...');
			Page.btnShowLoading(cancel_btn[0],true);	
			cancel_btn.find('canvas').css('margin','10px');
			
			Service.User.SendForgetPassToEmail(email, function(data){
				Page.btnHideLoading(cancel_btn[0]);	
				if(data.result){
					cancel_btn.hide();
					$(container.find('.msg').children()[1]).html('Reset Password Link had already been Send');
					sendmail_btn.hide();
					inp_layout.hide();
				}else{
					inp_layout.show();
					cancel_btn.css('pointer-events', '');
					sendmail_btn.css('pointer-events', '');
					sendmail_btn.html('Send Reset Password to Your Email');
					console.log('Try again');
				}
			});
		});
		
		searchbtn.tap(function(){
			findAccount(inputText.val());
			inputText.blur();
		});
		
		inputText.on('keydown', function(event) {
			if (event.keyCode == 13&&inputText.val().length>0) {
				findAccount(inputText.val());
				event.preventDefault(); 
				inputText.blur();
			}
	    });
		
		inputText.on('input', function() { 
			if((inputText.val()).length>0){
				searchbtn.removeClass('disabled');
				container.find('.err_msg').html('');
			}else{
				searchbtn.addClass('disabled');
			}
		});
	}
};