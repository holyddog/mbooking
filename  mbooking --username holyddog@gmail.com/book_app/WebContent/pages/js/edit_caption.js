Page.EditCaption = {
	url: 'pages/html/edit_caption.html',
	init: function(params, container) {			
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		
		var inputText = container.find('[name=text]');
		if (params && params.text) {
			inputText.val(params.text);
		}
		
		var btnAdd = container.find('[data-id=link_a]');
		btnAdd.tap(function() {
			var val = inputText.val();
			if (val && val.length > 0)
			Page.back(function(c, page) {
				page.updateDesc(c, val);
			});
		});
	}
};