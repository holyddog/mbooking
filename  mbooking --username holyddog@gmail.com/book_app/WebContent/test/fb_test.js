document.addEventListener("deviceready", function() {
	alert('App Ready');
	FB.init({
		appId : '370184839777084',
		nativeInterface : CDV.FB,
		useCachedDialogs : false
	});
}, false);

btn_login.addEventListener('click', function() {
	FB.login(function(response) {
		if (response.authResponse) {
			var access_token = FB.getAuthResponse()['accessToken'];
			localStorage.setItem('token', access_token);
			FB.api('/me?fields=picture,name,email', function(user) {
				alert('Log In -> Success');
				if (user) {
					alert(user.id + '\r\n' + user.name + '\r\n' + user.picture.data.url + '\r\n' + access_token);
					
					var img = document.createElement('img');
					img.style.width = '100%;';
					img.style.height = '100%';
					img.src = user.picture.data.url;
					
					fb_pic.appendChild(img);
					fb_name.innerText = user.name;
				}
			});
		} else {
			console.log('login response:' + response.error);
		}
	}, {
		scope : "email,publish_actions"
	});
}, false);
btn_logout.addEventListener('click', function() {
	alert('Log Out');
	
	try {
		FB.logout(function(response) {
			alert('Log Out -> Success');
		});
	}
	catch (e) {
		alert(e.message);
	}
}, false);
btn_check.addEventListener('click', function() {
	FB.getLoginStatus(function(response) {
		if (response && response.status === 'connected') {
			alert('Connected');
		}
		else {
			alert('Status: ' + JSON.stringify(response));
		}
	});
}, false);
btn_post.addEventListener('click', function() {
	var token = localStorage.getItem('token');
	if (!token) {
		alert('No Access Token');
		return;
	}	
	alert(token);
	
	var message = 'Hello World';
	var link = 'http://www.google.com/nexus/5';
	var title = 'Nexus 5 - Google';
	var desc = 'It’s a 5” phone, and so much more. Built with precision, Nexus 5 delivers an intelligently simple design and showcases a stunning full HD display. Plus it comes in '; 
	var pic = 'https://fbexternal-a.akamaihd.net/safe_image.php?d=AQAS-LIU8fVJQl-s&w=154&h=154&url=http%3A%2F%2Fwww.google.com%2Fnexus%2Fimages%2Fdevice-nav-all.png&cfs=1&upscale';
	
	var opt = {
		access_token: token,
		message: message,
		
		link: link,
		name: title,
		description: desc,
		picture: pic,

//		caption: "Test Application",
		privacy: {
			"value" : "EVERYONE"
		}
    };
	FB.api("/me/feed", 'post', opt, function(response) {	    		
        if (!response || response.error) { 
			alert('Status: ' + JSON.stringify(response));
        } else {
        	alert('Post -> Success');
        }
    }); 
}, false);