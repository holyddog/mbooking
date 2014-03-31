Page.Profile = {
	url: 'pages/html/profile.html',
	init: function(params, container) {
		// set background image		
		var img = $('<img class="profile_bg absolute fade_out show" src="temp/bg3.jpg" />');
		img.load(function() {
			img.prependTo(container);
			
			var h = $(window).innerHeight();
			var w = $(window).innerWidth();
			
			img.height(h);
			img.css('left', -1 * (img.width() / 2 - w / 2) + 'px');

//			img.addClass('show');
//			setTimeout(function() {
//				img.addClass('show');
//			}, 0);
		});		
		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});
		container.find('[data-id=btn_a]').tap(function() {
			Page.open('AddPage', true);
		});
		
		// set content links
		container.find('.book').tap(function() {
			Page.open('Book', true);
		});
	}
};