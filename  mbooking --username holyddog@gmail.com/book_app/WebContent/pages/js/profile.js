Page.Profile = {	
	url: 'pages/html/profile.html',
	init: function(params, container, append) {				
		// set toolbar buttons
		var btnMenu = container.find('[data-id=btn_m]');
		btnMenu.tap(function() {
			Page.slideMenu();
		});
		container.find('[data-id=btn_a]').tap(function() {
			Page.open('CreateBook', true);
		});
		
		var w = (profile_header.offsetWidth / 2) - 15;
		var h = (w * 4) / 3;
		book_style.innerHTML = '.book_size { width: ' + w + 'px; height: ' + h + 'px }';
		
		container.find('.ptab').click(function() {
			var ptab = $(this);
			container.find('.ptab').removeClass('active');
			ptab.addClass('active');
			
			container.find('.tpage').hide();
			container.find('.tpage').eq($(this).index()).show();
		});
		
		container.find('#ptab3 .book_size').click(function() {
			var bg = $(this).css('background-image');
			var title = $(this).find('h2').text();
			Page.open('Book1', true, { bg: bg, title: title });
		});
		
		container.find('.header_title span').text(Account.displayName);
		if (Account.picture) {
			container.find('.pimage img').attr('src', Util.getImage(Account.picture, 3));
		}
	}
};