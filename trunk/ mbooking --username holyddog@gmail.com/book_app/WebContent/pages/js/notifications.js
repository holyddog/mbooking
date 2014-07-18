Page.Notifications = {
	url: 'pages/html/notifications.html',
	init: function(params, container) {
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});	
		container.find('[data-id=btn_r]').tap(function() {
			self.load(container);
		});	
		
		this.load(container);
	},
	
	load: function(container) {	
		var self = this;
		var list = container.find('.content');		
		list.empty();
		Page.bodyHideNoItem(list);
		Page.bodyShowLoading(list, true);
		
		Service.User.GetNotificationByUid(Account.userId, 0, Config.LIMIT_ITEM, function(data) {
			Page.bodyHideLoading(list);
	       if(data.error||data.length==0){
	    	   Page.bodyHideLoading(list);
	    	   Page.bodyNoItem(list,"No Notification");
	       }else{
				for (var i = 0; i < data.length; i++) {
					var c = data[i];
					list.append(self.createItem(c));
				} 
				
				list.find('.notf_item').bind('click', function() {
					var item = $(this);
					if(item.data('href'))
					window.location.href = item.data('href');
				});
				
				list.find('.msg').bind('click', function() {
					var item = $(this);
					if(item.data('href'))
					window.location.href = item.data('href');
				});
				
				list.find('.uimage').bind('click', function() {
					var item = $(this);
					if(item.data('href'))
					window.location.href = item.data('href');
				});
				
				list.find('.follow_btn').bind('click', function() {
					var item = $(this);
					if(item.data('uid'))
					{
	//					item.css('pointer-events','none');
						item.hide();
						Service.Book.FollowAuthor(item.data('uid'), Account.userId, function(data) {
							Account.following = data.following;
	    					localStorage.setItem("u", JSON.stringify(Account));
	                    });
					}
				});
	       }
		}
		,
		function(error){
			if(error.responseText=="" && error.status == 200){
				Page.bodyHideLoading(list);
				Page.bodyNoItem(list,"No Notification");
			}
		});
	},
	
	createItem: function(data) {
//		<div class="notf_item box horizontal">
//			<div class="uimage">
//				<img src="temp/u1.jpg" />
//			</div>
//			<div class="msg flex1">
//				<div class="text"><b>Nostrum</b> started following you</div>
//				<div class="time">2 days ago</div>
//			</div>
//		</div>
		var user = data.who;
		var book = data.book;
		
		if(user){
			data.pic = user.pic;
		}
		
		var notfDiv = document.createElement('div');
		notfDiv.className = 'notf_item box horizontal';
		
		if (book) {
			notfDiv.dataset.href = '#Book?append=true&bid=' + book.bid + '&uid=' + data.uid;
		}
		else if(data.ntype!=1) {
			notfDiv.dataset.href = '#Profile?append=true&uid=' + data.uid + '&back=true';
		}
		
		var uimage = document.createElement('div');
		uimage.className = 'uimage';
		var img = document.createElement('img');
		var scr_url = Util.getImage(data.pic, 3);
		img.src = (data.pic)? scr_url: 'images/user.jpg';
		img.setAttribute("onerror", "this.src = 'images/user.jpg';");
		uimage.appendChild(img);
		
		var msg = document.createElement('div');
		msg.className = 'msg flex1';
		var text = document.createElement('div');
		text.className = 'text';
		text.innerHTML = data.message;
		var time = document.createElement('div');
		time.className = 'time';
		time.innerHTML = data.time;
		msg.appendChild(text);
		msg.appendChild(time);
		
		notfDiv.appendChild(uimage);
		notfDiv.appendChild(msg);
		
		if(data.ntype==1&&(Account.following).indexOf(data.who.uid)==-1){
			
			uimage.dataset.href = '#Profile?append=true&uid=' + user.uid + '&back=true';
			msg.dataset.href = '#Profile?append=true&uid=' + user.uid + '&back=true';
	
			var follbtn = document.createElement('div');
			follbtn.className = 'follow_btn';
			follbtn.dataset.uid=user.uid;
			
			follbtn.innerHTML = "+ Follow";
			
			notfDiv.appendChild(follbtn);
		}else if(data.ntype==1){
			notfDiv.dataset.href = '#Profile?append=true&uid=' + user.uid + '&back=true';
		}
		
		return notfDiv;			
	}
};