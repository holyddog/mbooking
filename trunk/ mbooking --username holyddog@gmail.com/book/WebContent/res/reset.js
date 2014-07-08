$('#resetpass').find('input').on('input',
	function() {
			var text = $(this).val();
			if (text.length > 0) {
				var inp_name = $(this).attr("name");
				if (inp_name == 'npwd') {
					if (text.length < 6) {
						$('[data-lbl=npwd]').html("The length must be 6 charactors or more");
					}
					else{
						$('[data-lbl=npwd]').html("");
					}
				}
				var npw = $('[name=npwd]').val();
				var cpw = $('[name=cpwd]').val();
				if (npw == cpw && npw >= 6) {
					$('.input_layout .submit_btn').removeClass('disable');
				} else {
					$('.input_layout .submit_btn').addClass('disable');
					if (npw != cpw && npw.length==cpw.length) {
						$('[data-lbl=cpwd]').html("Confirm password is inccorect");
					}else{
						$('[data-lbl=cpwd]').html('');
					}
				}
			} else {
				$('.input_layout .submit_btn').addClass('disable');
			}
	}
);