Page.Profile = {
	url: 'pages/html/profile.html',
	init: function(params, container) {
//		// set background image
//		var img = $('<img class="fade_out fill_dock" src="temp/profile_bg.jpg" />');
//		img.prependTo(container);
//		img.load(function() {
//			img.addClass('show');
//		});
//		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});
		container.find('[data-id=btn_a]').tap(function() {
			Page.open('AddPage', true);
		});
//		
//		// set content link
//		container.find('[data-id=link_book]').tap(function() {
//			Page.open('Book', true);
//		});	
		container.find('.book_lists .item').tap(function() {
			Page.open('MyBooks', true);
		});		
	}
};