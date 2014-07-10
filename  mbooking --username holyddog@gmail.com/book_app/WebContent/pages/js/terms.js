Page.TermsOfUse = {
	url: 'pages/html/terms.html',
	init: function(params, container) {	
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
	}
};