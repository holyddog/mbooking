Config = {
	DEBUG_MODE: true,
	DEFAULT_PAGE: 'Home',
	LIMIT_ITEM: 20,
	SLIDE_DELAY: 250,
	FADE_DELAY: 250,
	INTERVAL_DELAY: 30000, //60000, // 1 minute
	SERVICE_TIMEOUT:8000,
	
	FB_APP_ID: '370184839777084',
	
//	WEB_BOOK_URL:'http://119.59.122.38/book',
//	FILE_URL: 'http://' + '119.59.122.38' + '/book_dev_files',
	
	FILE_URL: 'http://' + window.location.hostname + '/res/book',
	WEB_BOOK_URL : 'http://' + window.location.hostname + '/book/index.html',

	OS: 'iOS',
    OS_Int: 1, //iOS :1, Android :2
    
	FILE_SIZE: {
		COVER: 1,
		SMALL: 2,
		PROFILE: 3
	}
};

Service = {	
	url: 'http://' + window.location.hostname + ':8080/book/data'
//	url: 'http://119.59.122.38/book/data'
};	

Account = {};

income_push = false;

Util = {
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
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
            
            if(config.confirm_lb){
                navigator.notification.confirm(config.message,
                                               function(index) {
                                                if (index == 2 && typeof config.callback == 'function') {
                                                config.callback();
                                                }
                                               },
                                               config.title,
                                               'Cancel,'+config.confirm_lb);
            }
			else{
                navigator.notification.confirm(config.message, function(index) {
                                               if (index == 1 && typeof config.callback == 'function') {
                                               config.callback();
                                               }
                                               }, config.title);
            }
		}
		else {
			var res = confirm(config.message);
			if (res && typeof config.callback == 'function') {
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
		dd.children[0].children[0].innerText = message;
		var temp = dd.className;
		dd.className = temp + ' show';
		
		setTimeout(function() {
			dd.className = temp;
			setTimeout(function() {
				dd.style.zIndex = -1;
			}, 300);
		}, 5000);
	},
	drop_retry: function(message,retry) {
		var dd = document.getElementById('dd_message');
		dd.style.zIndex = 2000;
		dd.children[0].children[0].innerText = message;
		var temp = dd.className;
		dd.className = temp + ' warning show';
		var retry_btn = $('#dd_message').find('.retry_btn');
		retry_btn.show();
		retry_btn.tap(function(){
			dd.className = temp;
			dd.style.zIndex = -1;
			
			if(retry)
			retry();	
		});
	},
	hide_drop:function(){
        var dd = document.getElementById('dd_message');
        dd.className = ((dd.className+"").replace(' warning','')).replace(' show','');
        dd.style.zIndex = -1;
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
//	$('#overlay').bind('touchmove touchstart touchend', function(e) {
//		e.preventDefault();
//	});
	
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
//    dialog.bind('click', function(e) {
//		if ($(e.target).closest('.d_panel').length > 0) {
//		} else {
//			history.back();
//		}
//    });
	dialog.bind('touchmove', function(e) {
		if ($(e.target).closest('.d_panel').length == 0) {
			e.preventDefault();
		}
	});
	dialog.find('.d_panel').empty();
});

Container = {
	getBody: function() {
		return $('#wrap');
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
	os: {
		Android: /Android/i.test(navigator.userAgent),
	    iOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
	},
	androidVer: function() {
	    var ua = navigator.userAgent; 
	    var match = ua.match(/Android\s([0-9\.]*)/);
	    return match ? match[1] : false;
	},
	PhoneGap: {
		isReady : false,
        isResume : false,
        isOnScreen : false,
        onNotification : false,
        setAliasPushnotification : function(email){
        	if (!Device.PhoneGap.isReady) return;
            PushNotification.setAlias(email, function() {
                console.log("Set Alias Success: " + email);
            });
        },
        disablePush:function(){
        	if (!Device.PhoneGap.isReady) return;
            PushNotification.disablePush(function() {
                console.log("disablePush");
            });
        }
        ,
    changePage:{},
    enablePush:function(){
//        alert();
        PushNotification.enablePush(function() {
                console.log("enablePush");
        });
    }
        ,
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
		loginFacebook: function(callback,permissions){
	    	if (!Device.PhoneGap.isReady) return;
        
            if(!permissions){
                permissions = "email,publish_actions";
            }
        
	    	FB.login(function(response) {
				if (response.authResponse) {
					var access_token = FB.getAuthResponse()['accessToken'];
					FB.api('/me?fields=picture,name,email', function(user) {
						if (user) {
							if (user.id)
								callback({
									fbid : user.id,
									fbpic : user.picture.data.url,
									access_token : access_token,
									dname : user.name,
									fbemail : user.email
								});
						}
					});
				} else {
					console.log('login response:' + response.error);
				}
	        },
	        { scope: permissions
                     
            }
	        );
	    
	    },
	    deleteAllPermission:function(callback){
            
            if (!Device.PhoneGap.isReady) return;
            
            FB.api('/me/permissions', 'DELETE',
               function(response) {
                   callback();
            });
        },
        getFacebookFreiends:function(callback){
            if (!Device.PhoneGap.isReady) return;
            
            function getFriend(access_token){
                FB.api('/me/friends',
                       {
                        fields: 'id, name, picture',
                        access_token : access_token
                       },
                       function(response) {
                           if(response.data) {
                               var friends = new Array(response.data.length);
                               var fbid ="";
                               $.each(response.data,function(index,friend) {
                                      friends[index] = {fid:friend.id,name:friend.name,pic:friend.picture.data.url};
                                      fbid += friend.id+":";
                               });
                                //alert(JSON.stringify(friends));
                                callback({friends:friends,fbid:fbid});
                            } else {
                               console.log("Error from get fb friends");
                           }
                       });
            }
            
            FB.getLoginStatus(function(response) {
                var token=false;
                if(Account){
                    if(Account.fbObject){
                        if(Account.fbObject.token){
                            token = Account.fbObject.token;
                        }
                    }
                }
                              
	            if (response && response.status === 'connected'&&token) {
                    getFriend();
                }
                else{
                    Device.PhoneGap.loginFacebook(
                        function(user){
                            getFriend(user.access_token);
                        },
                        "user_friends"
                    );
                }
            });
        }
        ,
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
								dname : user.dname,
								token: user.access_token
							};

							if (user.fbemail != undefined) {
								fbobj.fbemail = user.fbemail;
							}

							Account.fbObject = fbobj;
							localStorage.setItem('u', JSON
									.stringify(Account));
							postfb();
						};
						Service.User.linkFB(Account.userId, user.fbid, user.fbpic, user.dname, user.fbemail, user.access_token, linkToFb);
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
					user.dname, user.fbemail, user.access_token, function(data) {
						var fbobj = {
							fbpic : user.fbpic,
							dname : user.dname,
							token: user.access_token
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

var dIndex = 1;
Page = {	
	_stackPages: new Array(),
	_slideMenu: false,
	_showDialog: false,
	
	_tempBack: [],
	
	createResMessage: function(message, c) {
		var div = document.createElement('div');
		div.className = 'res_message';
		div.innerText = message;
		c.append(div);
	},
	createShortcutBar: function(target) {
//		<div class="sc_bar box horiztonal">
//			<div data-link="new" class="flex1 flex_lock box center_middle">
//				<div class="btn_link">
//					<div class="icon mask_icon" style="-webkit-mask-image: url(icons/add.png);"></div>
//					<div class="label">Create</div>
//				</div>
//			</div>
//			<div class="sep"></div>
//			<div data-link="edit" class="flex1 flex_lock box center_middle">
//				<div class="btn_link">
//					<div class="icon mask_icon" style="-webkit-mask-image: url(icons/pencil.png);"></div>
//					<div class="label">Edit</div>
//				</div>
//			</div>
//		</div>
		var bar = document.createElement('div');
		bar.className = 'sc_bar box horiztonal';
		
		var getSep = function() {
			var sep = document.createElement('div');
			sep.className = 'sep';
			return sep;
		};
		var getLink = function(name, text, iconPath) {
			var link = document.createElement('div');
			link.dataset.link = name;
			link.className = 'flex1 flex_lock box center_middle';
			
			var btn = document.createElement('div');
			btn.className = 'btn_link';
			
			var icon = document.createElement('div');
			icon.className = 'icon mask_icon';
			icon.style.webkitMaskImage = 'url(' + iconPath + ')';
			
			var label = document.createElement('div');
			label.className = 'label';
			label.innerText = text;
			
			btn.appendChild(icon);
			btn.appendChild(label);
			
			link.appendChild(btn);
			
			return link;
		};
		
		bar.appendChild(getLink('new', 'Create', 'icons/add.png'));
		bar.appendChild(getSep());
		bar.appendChild(getLink('edit', 'Edit (0)', 'icons/pencil.png'));
		
//		$(bar).insertBefore(target.find('.content'));
		
		if (Device.os.Android) {
			var content = target.find('.content').css('padding-bottom', '50px');
			content.append($(bar).css({
				'position': 'fixed',
				'bottom': '0'
			}));			
		}
		else {
			target.append(bar);			
		}
		
		var scBar = $(bar);
		var btnAdd = scBar.find('[data-link=new]');
		var btnEdit = scBar.find('[data-link=edit]');
		if (Account.draftCount) {
			var lb = btnEdit.find('.label');
			lb.text(lb.text().replace(/\d/i, Account.draftCount));
		}
		else {
			scBar.find('.sep').hide();
			btnEdit.hide();
		}
		
		btnAdd.click(function() {
//			e.preventDefault();
			
			Page.open('CreateBook', true, { pub: true });
		});
		btnEdit.click(function() {
//			e.preventDefault();
			
			if (Account.draftBooks && Account.draftBooks.length == 1) {
				Page.open('EditBook', true, { bid: Account.draftBooks[0].bid });
			}
			else {
				Page.popDialog(function(bid) { 
					history.back();
					
					setTimeout(function() {
						Page.open('EditBook', true, { bid: bid });					
					}, 100);
				}, 3);				
			}
		});
	},
	
	updateShortcutBar: function() {
		var scBar = $('.sc_bar');
		if (scBar.length > 0) {
			var btnEdit = scBar.find('[data-link=edit]');
			if (Account.draftCount > 0) {
				var lb = btnEdit.find('.label');
				lb.text(lb.text().replace(/\d/i, Account.draftCount));
			}
			else {
				scBar.find('.sep').hide();
				btnEdit.hide();
			}			
		}
	},
	
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
		else {
			profileCover.css('background-image', 'none');
		}
		
		if (Account.displayName) {
			profileCover.find('h1').text(Account.displayName);
		}
		var profileCover = $('#profile_cover');
		if (Account.picture) {
			profileCover.find('.pimage img').attr('src', Util.getImage(Account.picture, 3));
		}
		else {
			profileCover.find('.pimage img').attr('src', 'images/user.jpg');
		}
		if (Account.userName) {
			profileCover.find('.stat').html('@' + Account.userName);
		}
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
	popDialog: function(fn, type) {		
		if (!Page._showDialog) {
			if (typeof fn == 'function') {
				Page._callbackDialog = fn; 
			}
			
			if (!type) {
				type = 1;
			}

			var dialog = $('#dialog');
			dialog.find('.d_panel').css('width', 'auto');
			
			var ul = document.createElement('ul');
			ul.className = 'list_item';
			
			var getItem = function(name, label) {
				var li = document.createElement('li');
				li.dataset.link = name;
				li.innerText = label;
				return li;
			};
			
			switch (type) {
				// select photo
				case 1: { 
					var items = [{
						name: 'camera',
						label: 'Take a Photo'
					}, {
						name: 'gallery',
						label: 'Choose from Gallery'
					}];
					
					for (var i = 0; i < items.length; i++) {
						var it = items[i];
						ul.appendChild(getItem(it.name, it.label));
					}
					dialog.find('.d_panel').css('overflow-y', 'hidden').append(ul);
					
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
					break;
				}
				case 2: {
					var items = [{
						name: 'edit',
						label: 'Edit'
					}, {
						name: 'move',
						label: 'Move'
					}, {
						name: 'cover',
						label: 'Set as Cover'
					}, {
						name: 'delete',
						label: 'Delete'
					}];
					
					for (var i = 0; i < items.length; i++) {
						var it = items[i];
						ul.appendChild(getItem(it.name, it.label));
					}
					dialog.find('.d_panel').css('overflow-y', 'hidden').append(ul);
					
					dialog.find('[data-link=edit]').click(function() {	
						Page._callbackDialog('edit');
					});
					dialog.find('[data-link=cover]').click(function() {	
						Page._callbackDialog('cover');
					});
					dialog.find('[data-link=move]').click(function() {	
						Page._callbackDialog('move');
					});
					dialog.find('[data-link=delete]').click(function() {	
						Page._callbackDialog('delete');
					});
					break;
				}
				case 3: {
					var dPanel = dialog.find('.d_panel').css('overflow-y', 'scroll');
					dPanel.width(window.innerWidth - 30);
					dPanel.css('max-height', window.innerHeight - 30);
					
					ul.className = 'list_book';
					
					var items = Account.draftBooks;
					for (var i = 0; i < items.length; i++) {
						var it = items[i];
												
						var dimage = document.createElement('div');
						dimage.className = 'pic';

						if (it.pic) {
							var img = document.createElement('img');
							img.src = Util.getImage(it.pic, 2);
							dimage.appendChild(img);
						}
						
						var label = document.createElement('div');
						label.className = 'label flex1';
						label.innerText = it.title;
						
						var li = document.createElement('li');
						li.className = 'box horizontal';
						li.dataset.bid = it.bid;
						
						li.appendChild(dimage);
						li.appendChild(label);
						
						ul.appendChild(li);
					}
					dPanel.append(ul);
					
					dialog.find('li').click(function() {	
						Page._callbackDialog($(this).data('bid'));
					});
					break;
				}
				case 4: {
					var dPanel = dialog.find('.d_panel').css('overflow-y', 'hidden');
					dPanel.width(window.innerWidth - 30);
					dPanel.css('max-height', window.innerHeight - 30);
					
					var dwidth = (dPanel.width() * 4) / 5;
					var ratio = 2;
					if (dwidth >= 600) {
						ratio = 3;
					}
					var w = Math.floor((dwidth / ratio) - 15);
					var h = Math.floor((w * 4) / 3);
					
					var container = $('.page:last-child');
					var bg = container.find('.book_size').css('background-image');
					var title = container.find('.book_title').text();
					var desc = container.find('.book_det .desc').text();
					var count = container.find('.pcount').html();
					
					var html = 
						'<div class="body box horizontal">' +
						'	<div class="book_size" style="width: ' + w + 'px; height: ' + h + 'px; background-image: ' + bg + ';">' +
						'		<h2 class="book_title">' + title + '</h2>' +
						'	</div>' +
						'	<div class="book_det flex1 box vertical">' +
						'		<div class="flex1 desc">' + desc + '</div>' +
						'		<div class="pcount">' + count + '</div>' +
						'	</div>' +
						'</div>';
					
						html +=
						'<div class="input_layout">' +
						'	<div class="box horizontal">' +
						'		<div class="flex1 box check_label">Share with Facebook</div>' +
						'		<a data-id="btn_c" class="btn_check">' +
						'			<span class="check_icon"></span>' +
						'		</a>' +
						'	</div>' +
						'</div>';
						
//						html +=
//						'<div class="input_layout" style="padding-top: 0 !important;">' +
//						'	<div class="input shadow_border">' +
//						'		<textarea data-id="text_share" placeholder="Write your message" name="text"></textarea>' +
//						'	</div>' +
//						'</div>';
					
					var header = document.createElement('div');
					header.className = 'header';
					header.innerText = 'Confirm';
					
					var getButton = function(text) {
						var div = document.createElement('div');
						div.className = 'flex1 flex_lock';
						div.innerText = text;
						return div;
					};
					var bbar = document.createElement('div');
					bbar.className = 'bbar box horizontal';
					var sep = document.createElement('div');
					sep.className = 'sep';
					var btnOk = getButton('OK');
					var btnCancel = getButton('Cancel');
					bbar.appendChild(btnOk);
					bbar.appendChild(sep);
					bbar.appendChild(btnCancel);
					
					dPanel.append(header);
					dPanel.append(html);
					dPanel.append(bbar);

					var btnCheck = dPanel.find('[data-id=btn_c]'); 
					$(btnOk).click(function() {
						Page._callbackDialog('ok', btnCheck.hasClass('check'));
					});
					$(btnCancel).click(function() {
						Page._callbackDialog('cancel');
					});
					
					if (Account.fbObject && Account.fbObject.email) {
						var fb = Account.fbObject;
						if (fb.off) {
							btnCheck.removeClass('check');
						}
						else {
							btnCheck.addClass('check');
						}
					}
					
					btnCheck.tap(function() {
						if (!btnCheck.hasClass('check')) {
							var fbConnect = function(callback) {
								if (!Device.PhoneGap.isReady) {
									callback();
									return;
								}
								
								Device.PhoneGap.loginFacebook(function(user) {
									var fn = function(data) {
										var fbobj = {
											fbpic: user.fbpic,
											dname: user.dname,
											token: user.access_token
										};

										if (!user.fbemail) {
											fbobj.fbemail = user.fbemail;
										}

										Account.fbObject = fbobj;
										localStorage.setItem('u', JSON.stringify(Account));
										
										callback();
									};
									Service.User.linkFB(Account.userId, user.fbid, user.fbpic, user.dname, user.fbemail, user.access_token, fn);
								});
							};
							
							var allow = function() {
								btnCheck.addClass('check');
								
								Account.fbObject.off = false;
								localStorage.setItem('u', JSON.stringify(Account));
							};
							
							if (Account.fbObject && Account.fbObject.token) {
								allow();
							}
							else {
								if (Device.PhoneGap.isReady) {
									Page.showLoading('Connecting...');
									fbConnect(function() {
										Page.hideLoading();
										
										allow();
									});											
								}		
								else {
									allow();
								}
							}
						}		
						else {
							Account.fbObject.off = true;
							localStorage.setItem('u', JSON.stringify(Account));
							btnCheck.removeClass('check');
						}
					});
					
//					dialog.find('li').click(function() {	
//						Page._callbackDialog($(this).data('bid'));
//					});
					break;
				}
			}
			
			setTimeout(function() {
				dialog.bind('click', function(e) {
					if ($(e.target).closest('.d_panel').length == 0) {
						history.back();
						dialog.unbind('click');
					}
				});		
			}, 0);
			window.location = '#dialog';
		}
		else {
			history.back();
		}
	},
	hideDialog: function() {
		var dialog = document.getElementById('dialog');
		$(dialog).find('.d_panel').empty();
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
			content.children('canvas').remove();
		}
	},
	
	btnShowLoading: function(btn,white) {
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
		if(white)
			img.src = 'images/circle_w.png';
		else
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
				console.warn('Internal Error on "GET HTML": ' + xhr.responseText);
			},
			cache: !Config.DEBUG_MODE,
			dataType: 'html'
		});
	},
	get: function(url, params, success, error,notconnect,retry,wait) {
        var doget = function(){
        	MessageBox.hide_drop();
            if(navigator.onLine){
                var istimeout=false;
                var getreq_timer = setTimeout(
                    function(){
                        if(!istimeout&&retry){
                            MessageBox.drop_retry('Connection time out please try again',retry);
                            istimeout = true;
                            if(notconnect)
                                notconnect();

                        }
                    },
                    Config.SERVICE_TIMEOUT
                );
                
                $.ajax({
                       url: url,
                       success: function(data){
                            istimeout = true;
                            clearTimeout(getreq_timer);
                            success(data);
                       
                       },
                       error: function(xhr,status) {
                           if(status=='timeout'){
                                if(!istimeout&&retry){
                                    clearTimeout(getreq_timer);
                                    MessageBox.drop_retry('Connection time out please try again',retry);
                                    istimeout = true;
                                    if(notconnect)
                                       notconnect();
                                }
                           }
                           else{
                               console.warn('Internal Error on "GET": ' + xhr.responseText);
                               if (typeof error == 'function') {
                                error(xhr);
                               }
                           }
                       },
                       data: params,
                       cache: !Config.DEBUG_MODE,
                       dataType: 'json',
                       timeout:Config.SERVICE_TIMEOUT
                       });
            }else{
               if(notconnect)
               notconnect();
                
                MessageBox.drop_retry('No Internet Connection',
                    function(){
                            var timeout = 300;
                            if(navigator.onLine){
                                timeout = 5000;
                            }
                            
                            if(wait)
                            wait();
                            
                            setTimeout(
                                function(){
                                    if(retry)
                                    retry();
                                },
                                timeout
                            );
                    }
                );
              
            }
        };
        doget();
    },
    update: function(url, params, success, error) {
        if(navigator.onLine){
            $.ajax({
                   url: url,
                   success: success,
                   error: function(xhr,status) {
                       if(status=='timeout'){
                       
                       }
                       else{
                           console.warn('Internal Error on "GET": ' + xhr.responseText);
                           if (typeof error == 'function') {
                            error(xhr);
                           }
                       }
                   },
                   data: params,
                   cache: !Config.DEBUG_MODE,
                   dataType: 'json'
                   });
        }
    },
    post: function(url, params, success, error) {
        if(navigator.onLine){
            $.ajax({
                   type: 'POST',
                   url: url,
                   success: success,
                   error: function(xhr,status) {
                    if(status=='timeout'){
                   
                    }
                    else{
                       console.warn('Internal Error on "GET": ' + xhr.responseText);
                       if (typeof error == 'function') {
                       error(xhr);
                       }
                    }
                   },
                   data: params,
                   cache: !Config.DEBUG_MODE,
                   dataType: 'json'
                   });
        }else{
            
            MessageBox.drop('No Internet Connection');
            
        }
    }
};

(function($){ 
	$.fn.tap = function(fn, allowDefault) {
		return this.each(function() {
			var self = $(this);
			self.callback = fn;
			
			if (Device.isMobile()) {
				self.bind('click', function(e) {
					e.preventDefault();
				});
				
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
	
	if (Page.inv1) {
		clearInterval(Page.inv1);
	}
	if (Page.inv2) {
		clearInterval(Page.inv2);		
	}
	
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
		$(dd).find('.d_panel').empty();
		
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
			$('[data-page=' + p + ']:last-child').remove();	
			
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
				var ov = $('#overlay').css('display', 'block').toggleClass('slide');
				ov.click(function(e) {
					history.back();
				});
//				var x = 0;
//				var y = 0;
//				var time = new Date().getTime();
//				
//				ov.bind('touchstart', function(e) {
//					e.preventDefault();
//					e.stopPropagation();
//					
//					$(e.target).data('ref', time);
//					
//				    x = e.originalEvent.touches[0].pageX;
//					y = e.originalEvent.touches[0].pageY;
//				});
//				ov.bind('touchmove', function(e) {
//					e.preventDefault();
//					e.stopPropagation();
//
//				    x = e.originalEvent.touches[0].pageX;
//					y = e.originalEvent.touches[0].pageY;
//				});
//				ov.bind('touchend', function(e) {
//					e.preventDefault();	
//					e.stopPropagation();
//					
//				    var elm = document.elementFromPoint(x, y);
//				    if ($(elm).data('ref') == time) {
//					    ov.unbind('touchmove touchstart touchend');
//					    
//					    
//				    	history.back();
//				    }
//				});
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
                          FB.init({
                                  appId: Config.FB_APP_ID,
                                  nativeInterface: CDV.FB,
                                  useCachedDialogs: false
                                  });
    
	Device.PhoneGap.isReady = true;
	Device.PhoneGap.PictureSourceType = navigator.camera.PictureSourceType;
	Device.PhoneGap.DestinationType = navigator.camera.DestinationType;
//    PushNotification= cordova.require('cordova/PushNotification');
            
//                          alert();
     var onRegistration = function(event)  {
        if (!event.error) {
                          console.log("Reg Success: " + event.pushID);
                          if(event.pushID&&event.pushID!='')
                          localStorage.setItem("dvk", event.pushID);
                          return event.pushID;
                          }
        else {
                          console.log(event.error);
                          return null;
        }
    };                         
   // Incoming message callback
   var handleIncomingPush = function(event) {
                          
     if(event.message) {
        Device.PhoneGap.onNotification = true;
        var page = (document.URL).split('#')[1];
              // �ó� topage==page �� case by case �Դ����͹
        var topage = null;
        if(event.extras){
           if(event.extras.page)
            topage = event.extras.page;
        }
                          
       if(page!='Home'&&page!='SignIn'&&page!='SignUp'&&(topage)){
          function changePage(){
              var params = {};
              if(topage=="Notifications"){
                 $('.notf_count').removeClass('show');
              }
              else if(topage=="Book"){
                if(event.extras.bid){
                    params = { bid: event.extras.bid, uid:event.extras.uid };
                }
                else{
                    return;
                }
              }
              else if(topage=="Profile"){
                    if(event.extras.followid){
                          params = { uid:event.extras.followid,back: true };
                    }
                    else{
                          return;
                    }
              }
              Page.open(topage, true,params);
          }
                        
         
                    
          if(Device.PhoneGap.isOnScreen)
          {
                          MessageBox.confirm({
                                message: 'Do you want to read new message',
                                callback: function(button) {
                                    
                                changePage();
                                            
                                },
                                title:'New Message',
                                confirm_lb:'View'
                          });
          }
          else {
                       
              if(Device.PhoneGap.isResume){
                
                  changePage();
                          
              }else{
            	  Page.Explore.callPushNote =changePage;
              }
                          
          }
       }
       Device.PhoneGap.onNotification = false;
     }
     else {
        console.log("No incoming message");
     }
   };
    
   setTimeout(function() {
        Device.PhoneGap.isOnScreen = true;
   },800);
                          
   document.addEventListener("urbanairship.registration", onRegistration, false);
   document.addEventListener("urbanairship.push", handleIncomingPush, false);

   
   document.addEventListener("resume", function() {
                  
        document.addEventListener("urbanairship.registration", onRegistration, false);
        document.addEventListener("urbanairship.push", handleIncomingPush, false);
      
        setTimeout(function() {
        Device.PhoneGap.isOnScreen = true;
        },500);
                             
        Device.PhoneGap.isResume = true;
        
 
                             
        Device.PhoneGap.isReady = true;
        PushNotification.getIncoming(handleIncomingPush);

        
        
   }, false);

   document.addEventListener("pause", function() {
        Device.PhoneGap.isOnScreen = false;
        document.removeEventListener("urbanairship.registration",onRegistration, false);
        document.removeEventListener("urbanairship.push", handleIncomingPush, false);
         PushNotification.getIncoming(handleIncomingPush);
   }, false);
   
   PushNotification.registerForNotificationTypes(PushNotification.notificationType.badge |
                                                 PushNotification.notificationType.sound |
                                                 PushNotification.notificationType.alert);
   
   PushNotification.getIncoming(handleIncomingPush);


                          
                          
                          
}, false);


