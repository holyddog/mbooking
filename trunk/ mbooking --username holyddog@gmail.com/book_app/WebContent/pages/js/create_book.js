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
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
				
				var title = inputTitle.val();
				var desc = inputDesc.val();
				
				var fn = function(data) {	
					var bid = data.bid;
					
					Page.btnHideLoading(btnAccept[0]);
					Page.back(function() {
						Page.open('EditBook', true, { bid: bid, title: title, desc: desc });						
					});
				};
				
				pub = btnCheck.hasClass('check');
				if (params && params.bid) {
					Service.Book.EditBook(params.bid, title, desc, pub, function() {
						Page.back(function(c, page) {
							page.updateBook(c, title, desc);
						});
					});					
				}
				else {
					Service.Book.CreateBook(inputTitle.val(), inputDesc.val(), Account.userId, pub, fn);					
				}
				
				Page.Profile.load(Account.userId, false, $(page_Profile));
			}
		});
		var btnCheck = container.find('[data-id=btn_c]'); 
		btnCheck.tap(function() {
			btnCheck.toggleClass('check');
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
			Service.Book.GetBookByBid(params.bid, function(data) { 
				inputTitle.val(data.title);
				inputDesc.val(data.desc);
				if (data.pub) {
					btnCheck.addClass('check');
				}
				checkInput();
			});
		}
	}
};