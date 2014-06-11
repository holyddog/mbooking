Page.CreateBook = {
	url: 'pages/html/create_book.html',
	
	init: function(params, container) {			
		var pub = params? params.pub: false;
		
		// declare elements
		var inputTitle = container.find('input[name=title]');
		var inputDesc = container.find('textarea[name=desc]');
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});		
		
		var btnCheck = container.find('[data-id=btn_c]'); 
		btnCheck.tap(function() {
			btnCheck.toggleClass('check');
		});
		
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
				
				var title = inputTitle.val();
				var desc = inputDesc.val();
				
				var fn = function(data) {	
					var bid = data.bid;
					
					Page.btnHideLoading(btnAccept[0]);
					Page.back(function(c, page) {
//						var b = [{
//							bid: bid,
//							title: title
//						}];
//						page.loadDraftBooks(b, Account.userId, c, true);
//						var notf = c.find('#xbar .notf').show();
//						var count = 1;
//						if (notf.text().length) {
//							count = parseInt(notf.text()) + 1;
//						}
//						notf.text(count);

						var lb = c.find('.sc_bar [data-link=edit] .label');
						if (Account.draftCount) {
							Account.draftCount = parseInt(Account.draftCount) + 1;
							lb.text(lb.text().replace(/\d/i, Account.draftCount));							
						}
						else {
							lb.text(lb.text().replace(/\d/i, 1));
							c.find('.sc_bar .sep').show();
							c.find('.sc_bar [data-link=edit]').show();
							Account.draftCount = 1;
						}			
						
						if (!Account.draftBooks) {
							Account.draftBooks = [];
						}
						Account.draftBooks.push({
							bid: bid,
							title: title
						});
						
						localStorage.setItem('u', JSON.stringify(Account));
						
						Page.open('EditBook', true, { bid: bid, title: title, desc: desc });						
					});
				};
				
				pub = btnCheck.hasClass('check');
				if (params && params.bid) {
					Service.Book.EditBook(params.bid, title, desc, pub, function() {
						Page.back(function(c, page) {
							page.updateBook(c, title, desc, pub);
							
							if (Account.draftBooks) {
								var books = Account.draftBooks;
								for (var i = 0; i < books.length; i++) {
									if (params.bid == books[i].bid) {
										Account.draftBooks[i].title = title;
										break;
									}
								}
								localStorage.setItem('u', JSON.stringify(Account));
							}
						});
					});					
				}
				else {
					Service.Book.CreateBook(inputTitle.val(), inputDesc.val(), Account.userId, pub, fn);					
				}
			}
		});
		
		if (pub) {
			btnCheck.addClass('check');
		}
		else {
			btnCheck.removeClass('check');
		}
		
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
		
		if (params && params.bid) {
			container.find('.tbar .title').text('Edit Book');
			
			var editBook = $('.page[data-page=EditBook]');
			if (editBook.length > 0) {
				var title = editBook.find('#book_header .book_title').text();
				var desc = editBook.find('#book_header .desc').text();
				var pub = editBook.find('#book_header .privacy').hasClass('priv');
				
				inputTitle.val(title);
				inputDesc.val(desc);
				if (!pub) {
					btnCheck.addClass('check');
				}
				else {
					btnCheck.removeClass('check');
				}
				
				checkInput();
			}
			
//			Service.Book.GetBookByBid(params.bid, function(data) { 
//				inputTitle.val(data.title);
//				inputDesc.val(data.desc);
//				if (data.pub) {
//					btnCheck.addClass('check');
//				}
//				checkInput();
//			});
		}
	}
};