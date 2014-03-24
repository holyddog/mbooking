Page.Book = {
	url: 'pages/html/book.html',
	init: function(params, container) {
		// set background image
		var img = $('<img class="fade_out fill_dock" src="temp/book_bg.jpg" />');
		img.prependTo(container);
		img.load(function() {
			img.addClass('show');
		});
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		container.find('[data-id=btn_c]').tap(function() {
			Page.open('Comments', true);
		});
		container.find('[data-id=btn_s]').tap(function() {
			alert('share');
		});	
		
		// set content link
		container.find('[data-id=link_open]').tap(function() {
			Page.open('Page', true);
		});
	}
};