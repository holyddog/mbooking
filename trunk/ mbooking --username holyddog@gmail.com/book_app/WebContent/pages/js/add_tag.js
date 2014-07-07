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
				
				var tagName = inputText.val().trim().replace(/[^a-zA-Z0-9\s\,]/g,'').replace(/\s+/ig, ' ');
				Service.Book.UpdateTag(bid, tagName, true, function(data) {
					Page.btnHideLoading(btnAccept[0]);
					
					if (data.success) {
						Page.back(function(c, page) {
							var tagArr = tagName.split(',');
							for (var i = 0; i < tagArr.length; i++) {
								if (tagArr[i].trim().length > 0) {
									page.addTag(c.find('.tags'), tagArr[i].trim());									
								}
							}
						});						
					}
				});
			}
		});
		
//		inputText[0].addEventListener('keyup', function(e) {
//			console.log(e.which);
////			48 - 57 (number)
////			44 (comma)
////			32 (space)
//			if (e.which < 97) {
//				if ((e.which >= 48 && e.which <= 57) || e.which == 44 || e.which == 32) {
//					
//				}
//				else {
//					e.preventDefault();					
//				}
//			}
//		}, false);
		
		var panel = container.find('#tag_list');
		
		inputText[0].addEventListener('input', function() {
			if (inputText.val().length > 0) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
			}
			
			var keyword = inputText[0].value;
			keyword = keyword.trim().replace(/[^a-zA-Z0-9\s\,]/g,'').replace(/\s+/ig, ' ');
			if (keyword.length > 0) {
				panel.empty();
				
				Service.Search.Tags(keyword, function(data) {					
					for (var i = 0; i < data.length; i++) {
						var tag = data[i];
						panel.append(Page.Search.getTag(tag.tag, tag.count));
					}
					
					var temp = undefined;
					panel.find('.tag_item').bind('touchstart', function(e) {
						temp = $(this).data('tag');
					});
					panel.find('.tag_item').bind('touchmove', function(e) {
						temp = undefined;
					});
					panel.find('.tag_item').bind('touchend', function(e) {
						var tag = $(this).data('tag');
						if (temp == tag) {
							inputText.val(tag + ', ');
						}
					});
				});				
			}
		}, false);
		
		var focus = function(el) {
			el.focus();
			el.setSelectionRange && el.setSelectionRange(0, 0);
		};
		focus(inputText[0]);
	}
};