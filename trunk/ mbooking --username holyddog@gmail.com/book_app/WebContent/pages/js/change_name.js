Page.ChangeName = {
	url: 'pages/html/change_name.html',
	init: function(params, container) {	
		var inputName = container.find('input[name=dname]'); 
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				
			}
		});
		
		var verify = function() {
			if (inputName.val().length > 0) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
			}
		};
		
		// set content binding
		inputName[0].addEventListener('input', function() {
			verify();
		}, false);
		verify();
	}
};