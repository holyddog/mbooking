Page.EditCaption = {
	limitText:150,		
	url: 'pages/html/edit_caption.html',
	init: function(params, container) {			
		var limit_txt = Page.EditCaption.limitText;
		var remain_lb = container.find('[data-id=letter_count]');
		var btnAdd = container.find('[data-id=link_a]');
		var warnning = 20;
		var ex_warnning = 10;
		function updateRemainLetter(count){
			var remain = limit_txt - (count);
			if (remain < limit_txt) {
				if (remain < ex_warnning) {
					remain_lb.css("color", '#DF0101');
				} else if (remain < warnning) {
					remain_lb.css("color", '#B40404');
				} else {
					remain_lb.css("color", 'darkgray');
				}

				if (remain < 0) {
					btnAdd.css("pointer-events", 'none');
					btnAdd.css("opacity", 0.6);
				} else {
					btnAdd.css("pointer-events", '');
					btnAdd.css("opacity", '');
				}

				remain_lb.html(remain);
			} else {
				remain_lb.html('');
			}
		}
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		
		var inputText = container.find('[name=text]');
		if (params && params.text) {
			container.find('.tbar .title').text('Edit Description');
			btnAdd.find('.label').text('Update');
			inputText.val(params.text);
			updateRemainLetter((params.text).length);
		}
		
		var focus = function(el) {
		  el.focus();
		  el.setSelectionRange && el.setSelectionRange(0, 0);
		};
		focus(inputText[0]);		
		
		btnAdd.click(function() {
			var val = inputText.val();
			if (val && val.length > 0)
			Page.back(function(c, page) {
				page.updateDesc(c, val);
			});
		});
		inputText.keyup(function() {
			updateRemainLetter(($(this).val()).length);
		});
	}
};