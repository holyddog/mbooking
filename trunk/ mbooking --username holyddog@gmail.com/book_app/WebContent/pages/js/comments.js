
Page.Comments = {
    comment_scr:{},
    scrollToBottom: function(){
        
        Page.Comments.comment_scr = new IScroll('#wrapper');
        var cover_h = $('#wrapper').height();
        var list_h = $('.comment_list').height();
        
        if(list_h>cover_h){
            Page.Comments.comment_scr.scrollTo(0,((list_h-cover_h)*-1));
        }
    },
	url: 'pages/html/comments.html',
	init: function(params, container) {
		var self = this;
		var list = container.find('.comment_list');
		var inputMsg = container.find('input[name=msg]');
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back(function(c, page) {
			    if(page.reverseIndex){
					page.reverseIndex(c);
				}
			});
		});	
		container.find('[data-id=btn_r]').tap(function() {
			self.load(params.bid, list, container);
		});	
		
		// set content binding
		var btnSend = container.find('[data-id=btn_send]');
		btnSend.tap(function() {
			if (!btnSend.hasClass('disabled')) {
				var pic = 'images/user.jpg';
				if (Account.picture) {
					pic = Account.picture;//Util.getImage(Account.picture, 3);
				}
				var c = $(self.createComment(pic, Account.displayName, inputMsg.val(), 'Sending...'));
				c.appendTo(list);
				
				Service.Book.PostComment(params.bid, Account.userId, inputMsg.val(), function(data) {
					c.find('.time').text(Util.getTime(new Date()));
					
                    Page.Comments.scrollToBottom();
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
		Page.bodyShowLoading(content, true);
		
		Service.Book.GetComments(bid, 0, Config.LIMIT_ITEM, function(data) { 
			Page.bodyHideLoading(content);
			
			for (var i = 0; i < data.length; i++) {
				var c = data[i];
				list.append(self.createComment(c.pic, c.dname, c.comment, c.strtime));
			}
            Page.Comments.scrollToBottom();
            
		});
		
		
	},
	
	createComment: function(image, name, message, time) {
		var comment = document.createElement('div');
		comment.className = 'comment box horizontal ';
		
		var imageDiv = document.createElement('div');
		imageDiv.className = 'image';
		
		var img = document.createElement('img');
		if (image) {
			img.src = Util.getImage(image, 3);
		}
		else {
			img.src = 'images/user.jpg';
		}
		
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