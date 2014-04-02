Page.Home = {
	url: 'pages/html/home.html',
	
	init: function(params, container) {		
		// check authen
		if (localStorage.getItem('u')) {
			Account = JSON.parse(localStorage.getItem('u'));
			Page.open('Profile');
			
			return;
		}
		
		// set content links
		container.find('[data-id=link_f]').tap(function() {
			alert('Sign Up with Facebok');
		});
		container.find('[data-id=link_e]').tap(function() {
			Page.open('SignUp', true);
		});
		container.find('[data-id=link_l]').tap(function() {
			Page.open('SignIn', true);
		});
	}
};