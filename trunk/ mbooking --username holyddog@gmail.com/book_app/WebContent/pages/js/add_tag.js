Page.AddTag = {
	url: 'pages/html/add_tag.html',
	init: function(params, container) {
		var self = this;
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
		
		var tagData = Data;
		if (tagData) {			
			for (var i = 0; i < tagData.length; i++) {
				var tag = tagData[i];
				panel.append(self.getTag(tag.tag, tag.label, tag.count));
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
					inputText.val(tag);
				}
				temp = undefined;
				
				if (inputText.val().length > 0) {
					btnAccept.removeClass('disabled');
				}
			});
		}
		
		inputText[0].addEventListener('input', function() {
			if (inputText.val().length > 0) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
				panel.empty();
				return;
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
						temp = undefined;
					});
				});				
			}
		}, false);
		
		var focus = function(el) {
			el.focus();
			el.setSelectionRange && el.setSelectionRange(0, 0);
		};
		focus(inputText[0]);
	},
	
	getTag: function(tag, labelText, count) {
//		<div class="tag_item">
//			<div class="label">#HongKong</div>
//			<div class="count">20 Books</div>
//		</div>
		
		var div = document.createElement('div');
		div.className = 'tag_item box horizontal';
		div.dataset.tag = tag.toLowerCase();
		
		var flex = document.createElement('div');
		flex.className = 'flex1';
		
		var label = document.createElement('div');
		label.className = 'label';
		label.innerText = labelText;
		var c = document.createElement('div');
		c.className = 'count';

		c.innerText = '#' + tag;
		
		flex.appendChild(label);
		flex.appendChild(c);
		div.appendChild(flex);
		
		var num = document.createElement('div');
		num.className = 'num';
		num.innerText = count;
		
		div.appendChild(num);
		
		return div;
	} 
};