Page.CreateBook = {
	url: 'pages/html/create_book.html',
	
	init: function(params, container) {	
		// declare elements
		var inputTitle = container.find('input[name=title]');
		var inputDesc = container.find('textarea[name=desc]');
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});		
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				alert('create');
			}
		});
		
		// check required field
		var checkInput = function() {
			if (inputTitle.val().length > 0 && inputDesc.val().length > 0) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
			}
		};
		
		inputTitle[0].addEventListener('input', function() {
			checkInput();
		}, false);
		inputDesc[0].addEventListener('input', function() {
			checkInput();
		}, false);
	}
};