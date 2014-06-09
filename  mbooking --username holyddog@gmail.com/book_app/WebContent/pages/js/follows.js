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
				
				self.load(content, data);
			});		
		}
		else {
			container.find('.tbar .title').text('Following');
			Service.User.FindFollowing(params.uid, function(data) {
				Page.bodyHideLoading(content);
				
				self.load(content, data);
			});		
		}
	},
	
	load: function(content, data) {
		for (var i = 0; i < data.length; i++) {
			content.append(Page.Search.getUser(data[i]));
		}
		
		content.find('.user_item').click(function() {
			Page.open('Profile', true, { uid: $(this).data('uid'), back: true });
		});
	}
};