Config = { 
	PHONEGAP: false,
	DEBUG_MODE: true,
	DEFAULT_PAGE: 'Home',
	
	SLIDE_DELAY: 250,
	FADE_DELAY: 250,
	
	FILE_URL: 'http://' + window.location.hostname + '/res/book'
};

Service = {
	url: 'http://' + window.location.hostname + ':8080/book/data'
};

Account = {
	userId: 1
};

MessageBox = {
	confirm: function(config) {
		if (Config.PHONEGAP) {
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
		if (Config.PHONEGAP) {
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
		var page = $(this).data('page');
		
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
});

Container = {	
	getBody: function() {
		return $('#wrapper');
	},
	loadPage: function(container) {
		this.getBody().empty().append(container);
	},
	addPage: function(container) {
		this.getBody().append(container);
	}
};

Device = {
	isMobile: function() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf("windows") > -1) {
			return false;
		}
		return true;
	},
	screenWidth: $(window).innerWidth(),
	screenHeight: $(window).innerHeight()
};

Page = {	
	_stackPages: new Array(),
	_slideMenu: false,
	
	_tempBack: undefined,

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
	back: function(fn) {
		Page._tempBack = fn;
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
	showLoading: function() {
		var overlay = document.getElementById('overlay_loading');
		overlay.style.display = '-webkit-box';
		
		setTimeout(function() {			
			overlay.className = 'show';
			document.getElementById('loading_panel').className = 'show';
			
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
		document.getElementById('loading_panel').className = '';
	},
	
	bodyShowLoading: function(content) {
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
		img.src = 'images/circle_g.png';
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
					e.preventDefault();

					self.addClass('highlight');					
				});
				self.bind('mouseout', function(e) {
					e.preventDefault();
					
					if (self.hasClass('highlight')) {
						self.removeClass('highlight');
					}
				});
				self.bind('mouseup', function(e) {
					e.preventDefault();

					self.removeClass('highlight');					
					self.callback();
				});
			}
		});
	};
})(jQuery);

$(function(){
	$(window).hashchange(function() {
		Page.hideLoading();
		Page.bodyHideLoading();
		
		var hash = location.hash;	
		var arr = hash.split('?');
		var page = arr[0].substring(1);
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
		
		if (page != 'slide') {		
			var currentPage = Page[page];
			var checkPage = $.inArray(page, Page._stackPages);
			if (currentPage && checkPage == -1) {
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
						Page._stackPages.push(page);
						
						currentPage.init(params, container);
					});
				}	
				else {
					var container = $('<div data-page="' + page + '" class="page fill_dock active">');
					
					currentPage.init(params, container);
				}
			}
			else if (!slide && checkPage > -1) {
				var p = Page._stackPages.pop();
				var activeContainer = $('[data-page=' + Page._stackPages[Page._stackPages.length - 1] + ']');
				activeContainer.addClass('active');
				$('[data-page=' + p + ']').remove();	
				
				if (typeof Page._tempBack == 'function') {
					Page._tempBack(activeContainer);
					Page._tempBack = undefined;
				}
			}
			else if (checkPage == -1) {
				Page.open(Config.DEFAULT_PAGE);
				//Page.Error.init(404);
			}
		}
		else {			
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
	});
	$(window).hashchange();  
});