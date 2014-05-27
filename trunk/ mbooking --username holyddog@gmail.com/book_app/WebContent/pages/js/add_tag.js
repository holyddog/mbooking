Page.AddTag = {
	url: 'pages/html/add_tag.html',
	init: function(params, container) {
		var bid = params.bid;
		var inputText = container.find('input[name=tag]');
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
				
				var tagName = inputText.val();
				Service.Book.UpdateTag(bid, tagName, true, function(data) {
					Page.btnHideLoading(btnAccept[0]);
					
					if (data.success) {
						Page.back(function(c, page) {
							page.addTag(c.find('.tags'), tagName);
						});						
					}
				});
			}
		});
		
		inputText[0].addEventListener('input', function() {
			if (inputText.val().length > 0) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
			}
		}, false);
		var focus = function(el) {
			el.focus();
			el.setSelectionRange && el.setSelectionRange(0, 0);
		};
		focus(inputText[0]);
	}
};