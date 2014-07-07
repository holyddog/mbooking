Page.EditRef = {
	limitText:150,		
	url: 'pages/html/edit_ref.html',
	init: function(params, container) {	
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		
		var inputText = container.find('[name=text]');
		
		if (params && params.text) {
			container.find('.tbar .title').text('Edit Reference');
			btnAdd.find('.label').text('Update');
			inputText.val(params.text);
		}
		
		var focus = function(el) {
		  el.focus();
		  el.setSelectionRange && el.setSelectionRange(0, 0);
		};
		focus(inputText[0]);		

		var btnAdd = container.find('[data-id=link_a]');
		btnAdd.click(function() {
			var val = inputText.val();
			if (val && val.length > 0)
			Page.back(function(c, page) {
				page.updateRef(c, val);
			});
		});
	}
};