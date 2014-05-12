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
		
		Page.bodyShowLoading(list, true);
		
		Service.User.GetNotificationByUid(Account.userId, 0, Config.LIMIT_ITEM, function(data) {
			Page.bodyHideLoading(list);
			
			for (var i = 0; i < data.length; i++) {
				var c = data[i];
				list.append(self.createItem(c));
			} 
			
			list.find('.notf_item').bind('click', function() {
				var item = $(this);
				window.location.href = item.data('href');
			});
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
		
		var notfDiv = document.createElement('div');
		notfDiv.className = 'notf_item box horizontal';
		
		if (book) {
			notfDiv.dataset.href = '#Book?append=true&bid=' + book.bid + '&uid=' + data.uid;
		}
		else {
			notfDiv.dataset.href = '#Profile?append=true&uid=' + user.uid + '&back=true';
		}
		
		var uimage = document.createElement('div');
		uimage.className = 'uimage';
		var img = document.createElement('img');
		img.src = (user.pic)? Util.getImage(user.pic, 3): 'images/user.jpg';
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
		
		return notfDiv;			
	}
};