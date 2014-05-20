Page.AddPage = {
	url: 'pages/html/add_page.html',
	init: function(params, container) {
		var self = this;
		var bid = (params)? params.bid: undefined;
		var pid = (params)? params.pid: undefined;
		
		var boxPhoto = container.find('#box_photo')[0];
		if (pid) {
			container.find('.tbar .title').text('Edit Page');
			self.loadPage(container, pid);
		}
		else {
			boxPhoto.style.height = boxPhoto.offsetWidth + 'px';
		}
		
		var adjPhoto = container.find('#adj_photo');
		var btnAddPhoto = container.find('#add_photo');
		btnAddPhoto.tap(function() {
			Page.popDialog(function(img) {
				self.addPhoto(container, img);
			});
		});		
		
		var descText = container.find('#desc_text');
		container.find('#box_desc').tap(function() {
			Page.open('EditCaption', true, { text: descText.text() });
		});
		
		container.find('[data-id=btn_c]').tap(function() {
			Page.back();
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
				
				if (drag_img.className == 'noedit') {
					Service.Page.EditCaption(pid, desc_text.innerText, function() {
						Page.btnHideLoading(btnAccept[0]);
						Page.back();
					});
				}
				else {
					var pos = 0;
					var dir = $(drag_img).data('dir');
					if (dir == 0) {
						pos = -1 * parseInt(drag_img.style.webkitTransform.split('(')[1].split('px, ')[0]);
					}
					else if (dir == 1) {
						pos = -1 * parseInt(drag_img.style.webkitTransform.split('(')[1].split('px, ')[1]);
					}
					
					Service.Page.AddPage(drag_img.src, drag_img.parentNode.offsetWidth, pos, desc_text.innerText, bid, Account.userId, function(data) {
						Page.btnHideLoading(btnAccept[0]);
						
						Page.back(function(c, page) {
							page.addPage(c, data);
							
							// set cover
							if (data.seq == 1) {
								c.find('.book_size').css('background-image', 'url(' + Util.getImage(data.pic, 2) + ')');
							}
							
							var counter = c.find('.pcount span');
							counter.text(parseInt(counter.text()) + 1);
						});
					});					
				}				
			}
		});
		
		container.find('[data-id=btn_rem]').tap(function() {
			adjPhoto.find('img').remove();
			adjPhoto.hide();
			btnAddPhoto.show();
			
			self.checkAccept(container);
		});
	},
	
	checkAccept: function(container) {
		var btnAccept = container.find('[data-id=btn_a]'); 
		var img = container.find('#drag_img');
		if (img.length > 0 && img.attr('src')) {
			btnAccept.removeClass('disabled');
		}
		else {
			btnAccept.addClass('disabled');
		}
	},
	
	addPhoto: function(container, imgData, loaded) {
		var self = this;
		var adjPhoto = container.find('#adj_photo');
		var btnAddPhoto = container.find('#add_photo');
		
		btnAddPhoto.hide();
		adjPhoto.show();
		
		if (typeof imgData == 'string') {
			var img = 'data:image/jpg;base64,' + imgData;
			var imgObj = document.createElement('img');
			imgObj.setAttribute('id', 'drag_img');
			imgObj.src = img;
			adjPhoto.append(imgObj);
		}
		else {
			adjPhoto.append(imgData);
		}		
		
		if (!loaded) {
			self.editPhoto(container, loaded);
		}
		self.checkAccept(container);
	},
	
	loadPage: function(container, pid) {
		var self = this;
		var content = container.find('.content');
		var boxPhoto = container.find('#box_photo')[0];
		var boxDesc = container.find('#box_desc')[0];
				
		boxPhoto.style.display = 'none';
		boxDesc.style.display = 'none';
		Page.bodyShowLoading(content);
		
		Service.Page.GetPage(pid, function(data) {
			
			var img = $('<img id="drag_img" class="noedit" style="width: 100%; height: 100%;" src="' + Util.getImage(data.pic, 1) + '">');
			img.load(function() {
				Page.bodyHideLoading(content);
				boxPhoto.style.display = 'block';
				boxPhoto.style.height = boxPhoto.offsetWidth + 'px';
				boxDesc.style.display = '-webkit-box';
				
				if (data.caption) {
					self.updateDesc(container, data.caption);
				}
				self.addPhoto(container, img, true);	
				container.find('[data-id=btn_rem]').hide();		
			});
		});
	},
	
	updateDesc: function(container, text) {
		container.find('#desc_text').show().text(text);
		container.find('#desc_label').hide();
		this.checkAccept(container);
	},
	
	editPhoto: function(container, loaded) {
		var drag = container.find('#drag_img');
		
		var target = undefined;
		if (Device.isMobile()) {
			target = {
				x: function(e) {
					return e.originalEvent.touches[0].pageX;
				},
				y: function(e) {
					return e.originalEvent.touches[0].pageY;				
				}
			};
		}
		else {
			target = {
				x: function(e) {
					return e.pageX;
				},
				y: function(e) {
					return e.pageY;				
				}
			};			
		}
		
		var img_dir = 0; // horizontal = 0, vertical = 1
		var start = false;
		var pos = { x: 0, y: 0, sx: 0, sy: 0 };
		var max = 0;
		
		var afterLoad = function() {
			var iw = drag.width();
			var ih = drag.height();
			var pw = drag.parent().width();
			var ph = drag.parent().height();
			
			if (ih > iw) {
				img_dir = 1;
				drag.data('dir', 1);
				drag_img.style.width = drag.parent().height() + 'px';
			}
			else {
				drag.data('dir', 0);
				drag_img.style.height = drag.parent().height() + 'px';
			}
			iw = drag.width();
			ih = drag.height();
			
			switch (img_dir) {
				case 0: {
					drag_img.style.webkitTransform = 'translate3d(-' + ((iw / 2) - (pw / 2)) + 'px, 0px, 0px)';
					max = -1 * (pw - iw / 2);
					break;
				}
				case 1: {
					drag_img.style.webkitTransform = 'translate3d(0px, -' + ((ih / 2) - (ph / 2)) + 'px, 0px)';
					max = -1 * (ph - ih / 2);
					break;
				}
			}
		};
		
		if (!loaded) {
			drag.load(function() {
				afterLoad();
			});
		}
		else {
			afterLoad();
		}
		
		drag.bind('mousedown touchstart', function(e) {
			e.preventDefault();
			
			start = true;							
			
			switch (img_dir) {
				case 0: {
					pos.x = target.x(e);
					pos.sx = drag_img.style.webkitTransform.split('(')[1].split('px')[0];	
					break;
				}
				case 1: {
					pos.y = target.y(e);
					pos.sy = drag_img.style.webkitTransform.split('(')[1].split('px, ')[1];
					break;
				}
			}
			
			$(document).bind('mouseup touchend', function() {
				start = false;
			});
		});
		drag.bind('mousemove touchmove', function(e) {
			e.preventDefault();
			
			if (start) {				
				switch (img_dir) {
					case 0: {
						var sx = pos.x; 				
						var x = pos.x - target.x(e);				
						var posX = (pos.sx - x);
						var curX = drag_img.style.webkitTransform.split('(')[1].split('px')[0];
						
						if (sx < target.x(e)) { // drag right 
							if (posX <= 0) {
								drag_img.style.webkitTransform = 'translate3d(' + posX + 'px, 0px, 0px)';
							}
							else if (curX <= 0) {
								drag_img.style.webkitTransform = 'translate3d(' + 0 + 'px, 0px, 0px)';						
							}
						}
						else { // drag left 
							if (posX >= max) {
								drag_img.style.webkitTransform = 'translate3d(' + posX + 'px, 0px, 0px)';
							}
							else if (curX >= max) {
								drag_img.style.webkitTransform = 'translate3d(' + max + 'px, 0px, 0px)';						
							}					
						}	
						break;
					}
					case 1: {
						var sy = pos.y; 				
						var y = pos.y - target.y(e);				
						var posY = (pos.sy - y);
						var curY = drag_img.style.webkitTransform.split('(')[1].split('px, ')[1];
						
						if (sy < target.y(e)) { // drag down 
							if (posY <= 0) {
								drag_img.style.webkitTransform = 'translate3d(0px, ' + posY + 'px, 0px)';
							}
							else if (curY <= 0) {
								drag_img.style.webkitTransform = 'translate3d(0px, ' + 0 + 'px, 0px)';						
							}
						}
						else { // drag up 
							if (posY >= max) {
								drag_img.style.webkitTransform = 'translate3d(0px, ' + posY + 'px, 0px)';
							}
							else if (curY >= max) {
								drag_img.style.webkitTransform = 'translate3d(0px, ' + max + 'px, 0px)';						
							}					
						}
						break;
					}
				}
			}
		});
		drag.bind('mouseup touchend', function(e) {
			e.preventDefault();
			
			start = false;
		});
		
//		if (Device.isMobile()) {
//			drag.bind('touchstart', function(e) {
//				e.preventDefault();
//				
//				start = true;			
//				pos.x = e.originalEvent.touches[0].pageX;
//				pos.sx = drag.css('-webkit-transform').split(', ')[4];
//				
//				$(document).addEventListener('touchend', function() {
//					start = false;
//				});
//			});
//
//			drag.bind('touchmove', function(e) {
//				e.preventDefault();
//				
//				if (start) {				
//					var x = pos.x - e.originalEvent.touches[0].pageX;
//					drag_img.style.webkitTransform = 'translate3d(' + (pos.sx - x) + 'px, 0px, 0px)';
//				}
//			});			
//
//			drag.bind('touchend', function(e) {
//				e.preventDefault();
//				
//				start = false;
//			});
//		}
//		else {
//			
//		}
	}
};