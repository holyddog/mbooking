Page.Follows = {
	url: 'pages/html/follows.html',
	init: function(params, container) {			
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});	
		
		var content = container.find('.content');
		Page.bodyShowLoading(content, true);
		
		if (params.follower) {
			container.find('.tbar .title').text('Followers');
			Service.User.FindFollowers(params.uid, function(data) {
				Page.bodyHideLoading(content);
				
				self.load(content, data,params);
			});		
		}
		else {
			container.find('.tbar .title').text('Following');
			Service.User.FindFollowing(params.uid, function(data) {
				Page.bodyHideLoading(content);
				Page.bodyHideNoItem(content);
				self.load(content, data,params);
			});		
		}
	},
	
	load: function(content, data,params) {
		if(data.error||data.length==0){
	    	   if (params.follower)
	    		   Page.bodyNoItem(content,"No Followers");
	    	   else
	    		   Page.bodyNoItem(content,"No Following");
	    }
		else{
			for (var i = 0; i < data.length; i++) {
				content.append(Page.Search.getUser(data[i]));
			}
			
			$('.user_item').css('visibility','hidden');
	
	        setTimeout(function(){
	        	$('.user_item').css('padding','10px');
	        	$('.user_item').css('visibility','');
	        },1);
			
			content.find('.user_item').click(function() {
				Page.open('Profile', true, { uid: $(this).data('uid'), back: true });
			});
		}
	
	
	}
};