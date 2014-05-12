Config = {
	DEBUG_MODE: true,
	DEFAULT_PAGE: 'Home',
	LIMIT_ITEM: 20,
	
	SLIDE_DELAY: 250,
	FADE_DELAY: 250,
	INTERVAL_DELAY: 1000, //60000, // 1 minute
	
	WEB_BOOK_URL:'http://localhost:8080/book',
	FILE_URL: 'http://' + window.location.hostname + '/res/book',
	FB_APP_ID: '370184839777084',
	
//	FILE_URL: 'http://119.59.122.38/book_dev_files',

	
	FILE_SIZE: {
		COVER: 1,
		SMALL: 2,
		PROFILE: 3
	}
};

Service = {
	url: 'http://' + window.location.hostname + ':8080/book/data'		
};

Account = {};

Util = {
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	getAndroidVersion: function() {
	    var ua = navigator.userAgent; 
	    var match = ua.match(/Android\s([0-9\.]*)/);
	    return match ? match[1] : false;
	},
	getTime: function(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	},
	getImage: function(file, size) {
		if (!file) {
			return '';
		}
		
		var suffix = '';
		switch (size) {
			case Config.FILE_SIZE.COVER: {
				suffix = '_c';
				break;
			}
			case Config.FILE_SIZE.SMALL: {
				suffix = '_s';
				break;
			}
			case Config.FILE_SIZE.PROFILE: {
				suffix = '_sp';
				break;
			}
			default: {
				suffix = '';
				break;
			}
		}
		return Config.FILE_URL + file.substring(0, file.lastIndexOf('.')) + suffix + file.substring(file.lastIndexOf('.'), file.length);
	}
};

MessageBox = {
	confirm: function(config) {
		if (Device.PhoneGap.isReady) {
			navigator.notification.confirm(config.message, function(index) {
				if (index == 1 && typeof config.callback == 'function') {
					config.callback();
				}
			}, config.title);
		}
		else {
			confirm(config.message);
			if (typeof config.callback == 'function') {
				config.callback();
			}
		}
	},
	alert: function(config) {
		if (Device.PhoneGap.isReady) {
			navigator.notification.alert(config.message, config.callback, config.title);
		}
		else {
			alert(config.message);
			if (typeof config.callback == 'function') {
				config.callback();
			}
		}
	},
	drop: function(message) {
		var dd = document.getElementById('dd_message');
		dd.style.zIndex = 2000;
		dd.children[0].innerText = message;
		var temp = dd.className;
		dd.className = temp + ' show';
		
		setTimeout(function() {
			dd.className = temp;
			setTimeout(function() {
				dd.style.zIndex = -1;
			}, 300);
		}, 3000);
	}
};

$(document).ready(function() {	
	if (localStorage.getItem("u")) {
		Account = JSON.parse(localStorage.getItem("u"));	
	}
	Page.loadMenu();
	
	var win = $(window);
	win.on('resize', function() {
		var h = win.height() - 50;
		custom_style.innerHTML = '#sidebar { height: ' + h + 'px } #overlay { height: ' + h + 'px }';
	});
	win.trigger('resize');
	
	var sb = $('#sidebar_panel');
	$('#overlay').bind('touchmove touchstart touchend', function(e) {
		e.preventDefault();
	});
	
	sb.find('.item').tap(function() {
		var page = $(this).data('link');
		
		var hash = location.hash;	
		var arr = hash.split('?');
		var current = arr[0].substring(1);
		if (current != page) {
			Page.open(page);
		}
		else {
			history.back();
		}
	});
	
	var dialog = $('#dialog');
	dialog.bind('click', function() {
		history.back();
	});
	dialog.bind('touchmove', function(e) {
		e.preventDefault();
	});
	
	var dIndex = 1;
	dialog.find('[data-link=camera]').tap(function() {		
		if (Page._callbackDialog) {
			if (Device.PhoneGap.isReady) {
				Device.PhoneGap.takePhoto({
					success: function(imageData) {
						history.back();
						Page._callbackDialog(imageData);
					}
				});
			}
			else {
				history.back();
				Page._callbackDialog(Data['Image' + dIndex]);
				dIndex = (dIndex % 4) + 1;
			}
		}
	});
	dialog.find('[data-link=gallery]').tap(function() {
        if (Page._callbackDialog) {
        	if (Device.PhoneGap.isReady) {
	        	Device.PhoneGap.choosePhoto({
					success: function(imageData) {
						history.back();
						Page._callbackDialog(imageData);
					}
				});
        	}
        	else {
				history.back();
				Page._callbackDialog(Data['Image' + dIndex]);
				dIndex = (dIndex % 4) + 1;
        	}
		}
	});
});

Container = {	
	getBody: function() {
		return $('#wrapper');
	},
	loadPage: function(container) {
		this.getBody().empty().append(container);
	},
	changePage: function(container) {
		var bd = this.getBody();
		bd.find('.page:last-child').remove();
		bd.append(container);
	},
	addPage: function(container) {
		this.getBody().append(container);
	}
};

Device = {
	isMobile: function() {
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			return true;
		}
		return false;
	},
	PhoneGap: {
		isReady : false,
	    
		_getPhoto : function(opts) { 
			var options = {
//				quality : 75,
//				targetWidth : 100,
//				targetHeight : 100,
				targetWidth : 960,
				targetHeight : 960,
				correctOrientation : true,
				encodingType : navigator.camera.EncodingType.JPEG,
				destinationType : navigator.camera.DestinationType.DATA_URL
			};
	        
			if (!opts.camera) {
				options.sourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY;
			}
	        
			function onSuccess(imageData) {
				opts.success(imageData);
			}
			
			navigator.camera.getPicture(onSuccess, function(message) {
				history.back();
			}, options);
		},
	    
		choosePhoto : function(opts) {
			this._getPhoto(opts);
		},
	    
		takePhoto : function(opts) {
			opts.camera = true;
	        
			this._getPhoto(opts);
		},
	    loginFacebook: function(callback){
	    	if (!Device.PhoneGap.isReady) return;

	    	FB.login(function(response) {
				if (response.authResponse) {
					var access_token = FB.getAuthResponse()['accessToken'];
					FB.api('/me?fields=picture,name,email', function(user) {
						if (user) {
							if (user.id)
								callback({
									fbid : user.id,
									fbpic : user.picture.data.url,
									token : access_token,
									fbname : user.name,
									fbemail : user.email
								});
						}
					});
				} else {
					console.log('login response:' + response.error);
				}
	        },
	        { scope: "email" }
	        );
	    
	    },
	    logoutFacebook: function(callback){
	    	if (!Device.PhoneGap.isReady) return;
	    	
	        FB.getLoginStatus(function(response) {
	                          if (response && response.status === 'connected') {
	                                FB.logout(function(response) {
	                                    callback();
	                                });
	                          }
	                          });
	    },
		
	    postBookToFacebook : function(title,caption,desc,pic,link,message,callback){            
            if (!Device.PhoneGap.isReady) return;
            
            var privacy={"value":"EVERYONE"};//default
            
            if(pic==undefined){
                pic = "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc1/t1.0-1/p160x160/10171181_1399600216986895_2357837022372529589_n.jpg";
            }
            
            FB.getLoginStatus(function(response) {
				var postfb = function() {
					FB.api("/me/feed", 'post', {
						message : message,
						link : link,
						caption : caption,
						name : title,
						picture : pic,
						description : desc,
						privacy : privacy
					}, function(response) {
						if (!response || response.error) {
							alert(response.error);
						} else {
							callback();
							alert('Message sent!');
						}
					});
				};

				if (response && response.status === 'connected') {
					postfb();
				} else {
					Device.PhoneGap.loginFacebook(function(user) {
						var linkToFb = function(data) {
							var fbobj = {
								fbpic : user.fbpic,
								fbname : user.fbname
							};

							if (user.fbemail != undefined) {
								fbobj.fbemail = user.fbemail;
							}

							Account.fbObject = fbobj;
							localStorage.setItem('u', JSON
									.stringify(Account));
							postfb();
						};
						Service.User.linkFB(Account.userId, user.fbid, user.fbpic, user.fbname, user.fbemail, linkToFb);
					});
				}
			}); 
            
            var postfb = function() {
            	var opt = { message: message,
	                link: link,
	                caption: caption,
	                name:title,
	                picture:pic,
	                description: desc,
	                privacy: privacy
                };
            	var cb = function(response) {
                    if (!response || response.error) { 
                    	console.log(response.error);
						 callback(false);
                    } else {
                    	callback(true);
                    }
                };
            	FB.api("/me/feed", 'post', opt, cb);                              
            };                

            if (response && response.status === 'connected') {
				postfb();
			} else {
				Device.PhoneGap.loginFacebook(function(user) {
					Service.User.linkFB(Account.userId, user.fbid, user.fbpic,
					user.fbname, user.fbemail, function(data) {
						var fbobj = {
							fbpic : user.fbpic,
							fbname : user.fbname
						};

						if (user.fbemail != undefined) {
							fbobj.fbemail = user.fbemail;
						}

						Account.fbObject = fbobj;
						localStorage.setItem('u', JSON
								.stringify(Account));
						postfb();
					});
				});
			}
	    }
	    
	},
	screenWidth: $(window).innerWidth(),
	screenHeight: $(window).innerHeight()
};

Page = {	
	_stackPages: new Array(),
	_slideMenu: false,
	_showDialog: false,
	
	_tempBack: [],
	
	getNotifications: function(page) {
		if (Page.bgService) {
			Service.User.CountNotifications(Account.userId, function(data) {
				var count = parseInt(data.result);
				if (count > 0) {
					$('.tbar .notf_count').text(count).addClass('show');			
				}
				else {
					$('.tbar .notf_count').text(count).removeClass('show');
				}
				console.log(count + ', ' + new Date().getTime());
				setTimeout(function() {
					Page.getNotifications();						
				}, Config.INTERVAL_DELAY);
			});
		}
	},
	
	loadMenu: function() {
		var profileCover = $('#profile_cover');
		if (Account.cover) {
			var cover = Util.getImage(Account.cover, 2);
			profileCover.css('background-image', 'url(' + cover + ')');
		}
		if (Account.displayName) {
			profileCover.find('h1').text(Account.displayName);
		}
		var profileCover = $('#profile_cover');
		if (Account.picture) {
			profileCover.find('.pimage img').attr('src', Util.getImage(Account.picture, 3));
		}
		var bookCount = (Account.bookCount)? Account.bookCount: 0;
		profileCover.find('.stat').text(bookCount + ' Books');
	},
	open: function(page, append, params) {
		var fn = function() {
			var url = '#' + page;
			if (append) {
				url += '?append=true';
				if (params) {
					url += '&' + $.param(params);
				}
			}
			window.location = url;
		};
		if (Page._slideMenu) {
			history.back();
			setTimeout(fn, Config.SLIDE_DELAY);
		}
		else {
			fn();
		}
	},
	load: function(page, params) {
		var currentPage = Page[page];
		Web.html(currentPage.url, function(html) {
			var container = $('<div id="page_' + page + '" data-page="' + page + '" class="page fill_dock box vertical active">' + html + '</div>');
			container.data('page', page);
			
			$('.page').removeClass('active');
			container.addClass('active');			

			Container.changePage(container);			
			currentPage.init(params, container);
			
//			var p = Page._stackPages.pop();
//			
//			var pageUrl = page;
//			if (params) {
//				pageUrl += '?' + $.param(params);
//			}
//			Page._stackPages.push(pageUrl);
//			Page._tempUrl[p] = pageUrl;
		});
	},
	back: function(fn) {
		if (typeof fn == 'function') {
			Page._tempBack.push(fn);
		}
		history.back();
	},
	slideMenu: function() {		
		if (!Page._slideMenu) {
			window.location = '#slide';
		}
		else {
			history.back();
		}
	},
	popDialog: function(fn) {		
		if (!Page._showDialog) {
			if (typeof fn == 'function') {
				Page._callbackDialog = fn; 
			}
			window.location = '#dialog';
		}
		else {
			history.back();
		}
	},
	hideDialog: function() {
		var dialog = document.getElementById('dialog');
		dialog.className = dialog.className.replace(' show', '');
	},
	showLoading: function(text) {
		var overlay = document.getElementById('overlay_loading');
		overlay.style.display = '-webkit-box';
		
		setTimeout(function() {			
			overlay.className = 'show';
			loading_panel.className = 'show';
			if (text) {
				loading_panel.children[0].children[1].innerText = text;
			}
			
			var cv = document.getElementById('cv_loading');
			var ctx = cv.getContext('2d');
			
			var img = new Image();
			img.onload = function() {
				ctx.drawImage(img, 0, 0, 720, 40);

				var i = 1;
				Page.interval = setInterval(function() {
					ctx.drawImage(img, (i % 18) * -40, 0, 720, 40);
					i++;
				}, 80);
			};
			img.src = 'images/circle.png';
		}, 0);
	},
	hideLoading: function() {
		if (Page.interval) {
			clearInterval(Page.interval);
			Page.interval = undefined;
		}
		
		var overlay = document.getElementById('overlay_loading');
		overlay.className = '';
		overlay.style.display = 'none';
		loading_panel.className = '';
		loading_panel.children[0].children[1].innerText = '';
	},
	
	bodyShowLoading: function(content, white) {
		var cv = document.createElement('canvas');
		cv.className = 'content_loading';
		cv.width = 40;
		cv.height = 40;
		content.append(cv);
		
		var ctx = cv.getContext('2d');		
		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img, 0, 0, 720, 40);

			var i = 1;
			Page.bodyInterval = setInterval(function() {
				ctx.drawImage(img, (i % 18) * -40, 0, 720, 40);
				i++;
			}, 80);
		};
		if (white) {
			img.src = 'images/circle.png';
		}
		else {
			img.src = 'images/circle_g.png';			
		}
	},
	
	bodyHideLoading: function(content) {
		if (Page.bodyInterval) {
			clearInterval(Page.bodyInterval);
			Page.bodyInterval = undefined;
		}
		if (content) {
			content.find('canvas').remove();
		}
	},
	
	btnShowLoading: function(btn) {
		var cv = document.createElement('canvas');
	    cv.id = "cv_button";
	    cv.width = 20;
	    cv.height = 20;
	    cv.style.margin= '15px 0';

	    btn.children[0].style.display = 'none';
	    btn.appendChild(cv);	    
		
		//var cv = document.getElementById('cv_button');
		var ctx = cv.getContext('2d');
		
		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img, 0, 0, 360, 20);

			var i = 1;
			Page.btnInterval = setInterval(function() {
				ctx.drawImage(img, (i % 18) * -20, 0, 360, 20);
				i++;
			}, 80);
		};
		img.src = 'images/circle_s.png';
	},
	btnHideLoading: function(btn) {
		if (Page.btnInterval) {
			clearInterval(Page.btnInterval);
			Page.btnInterval = undefined;
		}
		$('#cv_button').remove();
	    btn.children[0].style.display = 'block';
	}
};

Page.Error = {
	init: function(code) {
		switch (code) {
			case 404: {
				Container.loadPage('<div id="page_error" class="fill_dock box center_middle">Page Not Found</div>');
				$('#page_error').tap(function() {
					Page.open(Config.DEFAULT_PAGE);
				});
				break;
			}
		}
	}
};

Web = {
	html: function(url, success) {
		$.ajax({
			url: url,
			success: success,
			error: function(xhr) {
				console.error('Internal Error: ' + xhr.responseText);
			},
			cache: !Config.DEBUG_MODE,
			dataType: 'html'
		});
	},
	get: function(url, params, success) {
		$.ajax({
			url: url,
			success: success,
			error: function(xhr) {
				console.error('Internal Error: ' + xhr.responseText);
			},
			data: params,
			cache: !Config.DEBUG_MODE,
			dataType: 'json'
		});
	},
	post: function(url, params, success) {
		$.ajax({
			type: 'POST',
			url: url,
			success: success,
			error: function(xhr) {
				console.error('Internal Error: ' + xhr.responseText);
			},
			data: params,
			cache: !Config.DEBUG_MODE,
			dataType: 'json'
		});
	}
};

(function($){ 
	$.fn.tap = function(fn, allowDefault) {
		return this.each(function() {
			var self = $(this);
			self.callback = fn;
			
			if (Device.isMobile()) {
				
				self.bind('touchstart', function(e) {	
					if (!allowDefault)
						e.preventDefault();

					self.pos = self.offset();
					self.size = { w: self.width(), h: self.height() };
					self.addClass('highlight');
				});
				self.bind('touchmove', function(e) {
					if (!allowDefault)
						e.preventDefault();
					
					var x = e.originalEvent.touches[0].pageX;
					var y = e.originalEvent.touches[0].pageY;
					
					if (x > self.pos.left + self.size.w || y > self.pos.top + self.size.h) {
						self.removeClass('highlight');
					}
					else if (x < self.pos.left || y < self.pos.top) {
						self.removeClass('highlight');
					}
				});
				self.bind('touchend', function(e) {
					if (!allowDefault)
						e.preventDefault();
					
					if (self.hasClass('highlight')) {
						self.callback();
						self.removeClass('highlight');
					}
				});
			}
			else {
				self.bind('mousedown', function(e) {
					if (e.button == 0) {
						e.preventDefault();
	
						self.addClass('highlight');
					}
				});
				self.bind('mouseout', function(e) {
					if (e.button == 0) {
						e.preventDefault();
						
						if (self.hasClass('highlight')) {
							self.removeClass('highlight');
						}
					}
				});
				self.bind('mouseup', function(e) {
					if (e.button == 0) {
						e.preventDefault();
	
						self.removeClass('highlight');					
						self.callback();
					}
				});
			}
		});
	};
})(jQuery);

var pageLoad = function() {
	Page.hideLoading();
	Page.bodyHideLoading();
	
	var hash = location.hash;	
	var arr = hash.split('?');
	var page = arr[0].substring(1);
	var pageUrl = window.location.hash.substring(1);
	
	var params = undefined;
	var append = false;
	if (arr.length == 2) {
		params = $.deparam(arr[1], true);
		append = params.append;
		delete params['append'];
	}
	
	var overlay = $('#overlay');
	var sidebar = $('#sidebar');
	
	var slide = false;
	if (Page._slideMenu) {		
		overlay.removeClass('slide');
		sidebar.removeClass('slide');
		
		Page._slideMenu = false;
		slide = true;
		
		setTimeout(function() {
			overlay.css('display', 'none');
		}, Config.FADE_DELAY);
	}
	
	var dialog = false;
	if (Page._showDialog) {
		var dd = document.getElementById('dialog');
		dd.className = dd.className.replace(' show', '');
		
		Page._showDialog = false;
		Page._callbackDialog = undefined;
		dialog = true;
	}
	
	if (page != 'slide' && page != 'dialog') {		
		var currentPage = Page[page];
		var checkPage = $.inArray(pageUrl, Page._stackPages);
		if (currentPage && checkPage == -1) {
			if ($.inArray(page, ['Profile', 'Following', 'Explore']) > -1) {
				if (!Page.bgService) {
					Page.bgService = true;
					Page.getNotifications();
				}				
			}
			else {
				Page.bgService = false;
			}
			
			if (currentPage.url) {
				Web.html(currentPage.url, function(html) {
					var container = $('<div id="page_' + page + '" data-page="' + page + '" class="page fill_dock box vertical active">' + html + '</div>');
					container.data('page', page);
					
					$('.page').removeClass('active');
					container.addClass('active');
					
					if (append) {
						Container.addPage(container);
					}
					else {						
						Page._stackPages.length = 0;
						Container.loadPage(container);
					}
					Page._stackPages.push(pageUrl);
					
					currentPage.init(params, container, append);
				});
			}	
			else {
				var container = $('<div data-page="' + page + '" class="page fill_dock active">');
				
				currentPage.init(params, container, append);
			}
		}
		else if (!slide && !dialog && checkPage > -1) {
			var p = Page._stackPages.pop().split('?')[0];
			var activeContainer = $('[data-page=' + Page._stackPages[Page._stackPages.length - 1].split('?')[0] + ']');
			activeContainer.addClass('active');
			$('[data-page=' + p + ']').remove();	
			
//			if (typeof Page._tempBack == 'function') {
//				Page._tempBack(activeContainer);
//				Page._tempBack = undefined;
//			}
			if (Page._tempBack && Page._tempBack.length) {
				var fn = Page._tempBack.pop();
				fn(activeContainer, Page[activeContainer.data('page')]);
			}
			
			if ($.inArray(page, ['Profile', 'Following', 'Explore']) > -1) {
				if (!Page.bgService) {
					Page.bgService = true;
					Page.getNotifications();
				}				
			}
		}
		else if (checkPage == -1) {
			Page.open(Config.DEFAULT_PAGE);
			//Page.Error.init(404);
		}
	}
	else if (page != 'dialog') {			
		var slideMenu = function() {
			setTimeout(function() {  
				$('#overlay').css('display', 'block').tap(function() {
					history.back();
				}).toggleClass('slide');
				$('#sidebar').toggleClass('slide');
				Page._slideMenu = true;
			}, 0);
		};
		slideMenu();
	}
	else if (page != 'slide') {
		var dd = document.getElementById('dialog');
		dd.className = dd.className + ' show';
		Page._showDialog = true;
	}
};
$(function(){
	$(window).hashchange(function() {
		pageLoad();
	});
	$(window).hashchange();  
});

document.addEventListener("deviceready", function() {
	Device.PhoneGap.isReady = true;
	Device.PhoneGap.PictureSourceType = navigator.camera.PictureSourceType;
	Device.PhoneGap.DestinationType = navigator.camera.DestinationType;
	
	 FB.init({
         appId: Config.FB_APP_ID,
         nativeInterface: CDV.FB,
         useCachedDialogs: false
     });
}, false);