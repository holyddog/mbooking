Page.Comments = {
	url: 'pages/html/comments.html',
	init: function(params, container) {
		var self = this;
		var list = container.find('.comment_list');
		var inputMsg = container.find('input[name=msg]');
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});	
		container.find('[data-id=btn_r]').tap(function() {
			self.load(params.bid, list, container);
		});	
		
		// set content binding
		var btnSend = container.find('[data-id=btn_send]');
		btnSend.tap(function() {
			if (!btnSend.hasClass('disabled')) {
				var c = $(self.createComment('images/user.jpg', Account.displayName, inputMsg.val(), 'Sending...'));
				c.prependTo(list);
				
				Service.Book.PostComment(params.bid, Account.userId, inputMsg.val(), function(data) {
					c.find('.time').text(Util.getTime(new Date()));
				});
				inputMsg.val(null);
				btnSend.addClass('disabled');
			}
		});	
		
		self.load(params.bid, list, container);
		
		inputMsg[0].addEventListener('input', function() {
			if (inputMsg.val().length) {
				btnSend.removeClass('disabled');
			}
		}, false);
	},
	
	load: function(bid, list, container) {	
		var self = this;
		
		list.empty();
		
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		Service.Book.GetComments(bid, 0, Config.LIMIT_ITEM, function(data) { 
			Page.bodyHideLoading(content);
			
			for (var i = 0; i < data.length; i++) {
				var c = data[i];
				
				list.append(self.createComment('images/user.jpg', c.dname, c.comment, c.strtime));
			} 
		});
	},
	
	createComment: function(image, name, message, time) {
		var comment = document.createElement('div');
		comment.className = 'comment box horizontal';
		
		var imageDiv = document.createElement('div');
		imageDiv.className = 'image';
		
		var img = document.createElement('img');
		img.src = image;
		
		var cbox = document.createElement('div');
		cbox.className = 'cbox flex1';
		
		var dname = document.createElement('div');
		dname.className = 'dname';
		dname.innerText = name;
		
		var msg = document.createElement('div');
		msg.className = 'message';
		msg.innerText = message;
		
		var timeDiv = document.createElement('div');
		timeDiv.className = 'time';
		timeDiv.innerText = time;
		
		cbox.appendChild(dname);
		cbox.appendChild(msg);
		cbox.appendChild(timeDiv);
		
		imageDiv.appendChild(img);
		
		comment.appendChild(imageDiv);
		comment.appendChild(cbox);
		
		return comment;
		
//		<div class="comment box horizontal">
//			<div class="image">
//				<img src="images/user.jpg" />
//			</div>
//			<div class="cbox flex1">
//				<div class="dname">Holy D Dog</div>
//				<div class="message">Aliqua, excepteur felis. Per wisi nulla vestibulum. At elit, exercitation maiores accumsan? Nunc dolorum, platea perferendis</div>
//				<div class="time">1 hour ago</div>
//			</div>
//		</div>
	}
};