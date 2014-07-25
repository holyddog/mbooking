Page.Report = {
	url: 'pages/html/report.html',
	init: function(params, container) {			
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		
		var sel = container.find('select[name=type]');
		var text = container.find('textarea[name=text]');
		
		sel.bind('change', function() {
			if (sel.val() > 0) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
			}
		});
		
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
				
				// call service
				Service.User.SubmitReport(sel.val(), params.bid, Account.userId, text.val(), function() {
					Page.btnHideLoading(btnAccept[0]);
					Page.back();
				});
			}
		});
	}
};