Page.CreateBook = {
	url: 'pages/html/create_book.html',
	
	init: function(params, container) {	
		var ret = params.ret;
		
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
				Page.btnShowLoading(btnAccept[0]);
				
				var fn = function(data) {	
					// update local user data
					Account.lastEditBook = {
						bid: data.bid,
						pic: data.pic,
						title: data.title
					};
					localStorage.setItem("u", JSON.stringify(Account));
					
					Page.btnHideLoading(btnAccept[0]);
					Page.back(function(c) {
						if (!ret) {
							Page.BookList.load(c);							
						}
						else {
							var src = '';
							
							var selBook = c.find('.sel_book').show();
							selBook.data('bid', data.bid);
							selBook.find('.bimage img').attr('src', src);
							selBook.find('.btitle span').text(data.title);							

							var linkCreate = c.find('[data-id=link_c]');
							linkCreate.hide();
						}
					});
				};
				Service.Book.CreateBook(inputTitle.val(), inputDesc.val(), Account.userId, null, null, null, null, fn);
			}
		});
		
		// check required field
		var checkInput = function() {
			if (inputTitle.val().length > 0) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
			}
		};
		
		inputTitle[0].addEventListener('input', function() {
			checkInput();
		}, false);
	}
};