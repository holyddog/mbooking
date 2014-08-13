Page.AddPage = {
	url: 'pages/html/add_page.html',
	init: function(params, container) {
		var self = this;
		var bid = (params)? params.bid: undefined;
		var pid = (params)? params.pid: undefined;
		
		var boxPhoto = container.find('#box_photo')[0];
		if (pid) {
			container.find('.tbar .title').text('Edit Page');
			self.loadPage(container, pid, params.count);
		}
		else {
			boxPhoto.style.height = boxPhoto.offsetWidth + 'px';
			if (params.count) {
				container.find('.pline .pnum').text((params.count + 1) + ' of ' + params.count);				
			}
		}
		
		var adjPhoto = container.find('#adj_photo');
		var btnAddPhoto = container.find('#add_photo');
		btnAddPhoto.tap(function() {
			Page.popDialog(function(img) {
				self.addPhoto(container, img);
			});
		});		
		
		var link = container.find('.ref_link');
		link.tap(function() {
			Page.open('EditRef', true, { text: link.data('raw') });
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
				
				var pos = 0;
				var dir = $(drag_img).data('dir');
				if (dir == 0) {
					pos = -1 * parseInt(drag_img.style.webkitTransform.split('(')[1].split('px, ')[0]);
				}
				else if (dir == 1) {
					pos = -1 * parseInt(drag_img.style.webkitTransform.split('(')[1].split('px, ')[1]);
				}
				
				var edit = false;
				var pic = drag_img.src;
				if (pid) {
					edit = true;
//					pic = pic.substring(pic.lastIndexOf('/') + 1, pic.length);
					pic = pic.replace(Config.FILE_URL,'');
				}
				
				Service.Page.AddPage(pid, pic, drag_img.parentNode.offsetWidth, pos, desc_text.innerText, link.data('raw'), bid, Account.userId, function(data) {
					Page.btnHideLoading(btnAccept[0]);
					if((((document.URL).split('#')[1]).split("?")[0])=="AddPage"){
						Page.back(function(c, page) {						
							if (!edit) {	
								page.addPage(c, data);					
								// set cover
								if (data.seq == 1) {
									c.find('.book_size').css('background-image', 'url(' + Util.getImage(data.pic, 2) + ')');
									
									if (Account.draftBooks) {
										var books = Account.draftBooks;
										for (var i = 0; i < books.length; i++) {
											if (bid == books[i].bid) {
												Account.draftBooks[i].pic = data.pic;
												break;
											}
										}
										localStorage.setItem('u', JSON.stringify(Account));
									}
								}
								
								var counter = c.find('.pcount span');
								counter.text(parseInt(counter.text()) + 1);
							}
							else {
								c.find('[data-pid=' + pid + ']').css({
									'background-image': 'url(' + Util.getImage(data.pic, 2) + '?' + new Date().getTime() + ')'
								});
							}
						});
					}
				});		
				
//				if (drag_img.className == 'noedit') {
//					Service.Page.EditCaption(pid, desc_text.innerText, function() {
//						Page.btnHideLoading(btnAccept[0]);
//						Page.back();
//					});
//				}
//				else {
//								
//				}				
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
	
	addPhoto: function(container, imgData, loaded, pos) {
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
		
		self.editPhoto(container, loaded, pos);
		self.checkAccept(container);
	},
	
	loadPage: function(container, pid, pcount) {
		var self = this;
		var content = container.find('.content');
		var boxPhoto = container.find('#box_photo')[0];
		var boxDesc = container.find('#box_desc')[0];
				
		boxPhoto.style.display = 'none';
		boxDesc.style.display = 'none';
		Page.bodyShowLoading(content);
		
		Service.Page.GetPage(pid, function(data) {
			
			var img = $('<img id="drag_img" src="' + Util.getImage(data.pic) + '">');
			img.load(function() {
				Page.bodyHideLoading(content);
				boxPhoto.style.display = 'block';
				boxPhoto.style.height = boxPhoto.offsetWidth + 'px';
				boxDesc.style.display = '-webkit-box';
				
				container.find('.pline .pnum').text(data.seq + ' of ' + pcount);
				self.updateRef(container, data.ref);
//				img.css({
//					'-webkit-transform': 'translate3d(0px, 0px, 0px)'
//				});
				
				if (data.caption) {
					self.updateDesc(container, data.caption);
				}
				
				var pos = undefined;
				if (data.pos && data.pos.length == 2) {
					var x = Math.round((data.pos[0] * boxPhoto.offsetWidth) / 640);
					var y = Math.round((data.pos[1] * boxPhoto.offsetWidth) / 640);
					pos = [x, y];
				}
				
				self.addPhoto(container, img, true, pos);
//				container.find('[data-id=btn_rem]').hide();		
			});
		});
	},
	
	updateDesc: function(container, text) {
		container.find('#desc_text').show().text(text);
		container.find('#desc_label').hide();
		this.checkAccept(container);
	},
	
	updateRef: function(container, ref) {
		var oref = container.find('.ref');
		oref.find('.ext_url').remove();
		if (ref) {
			container.find('.ref_link').hide().data('raw', ref);
			
			if (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\?\=\&\+\.-]*)*\/?$/ig.test(ref)) {
				var url = ref.split(/\s+/g)[0];
				var newUrl = url.replace(/^(https?:\/\/)?(www.)?/ig, '');
				if (newUrl.indexOf('/') > -1) {
					newUrl = newUrl.substring(0, newUrl.indexOf('/'));
				}
				oref.append('<div class="ext_url"><a target="_blank" class="block" href="' + url + '">' + newUrl + '</a><span class="mask_icon"></span></div>');
			}
			else {
				oref.append('<div class="ext_url"><div class="label" style="width:' + (oref.width() - 50) + 'px;">' + ref + '</div><span class="mask_icon"></span></div>');				
			}
			oref.find('.mask_icon').tap(function() {
				Page.open('EditRef', true, { text: ref });
			});
		}
		else {
			container.find('.ref_link').show().data('raw', null);
		}
	},
	
	editPhoto: function(container, loaded, crop) {
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
					max = -1 * ((iw / 2) - (pw / 2));
					break;
				}
				case 1: {
					drag_img.style.webkitTransform = 'translate3d(0px, -' + ((ih / 2) - (ph / 2)) + 'px, 0px)';
					max = -1 * (ph - ih / 2);
					max = -1 * ((ih / 2) - (ph / 2));
					break;
				}
			}
			if (crop && crop.length == 2) {
				if (typeof crop[1] == 'number' && crop[1] == 0) {
					drag_img.style.webkitTransform = 'translate3d(-' + crop[0] + 'px, 0px, 0px)';				
				}
				else if (typeof crop[0] == 'number' && crop[0] == 0) {
					drag_img.style.webkitTransform = 'translate3d(0px, -' + crop[1] + 'px, 0px)';					
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
							if (posX >= max * 2) {
								drag_img.style.webkitTransform = 'translate3d(' + posX + 'px, 0px, 0px)';
							}
							else if (curX >= max * 2) {
								drag_img.style.webkitTransform = 'translate3d(' + max * 2 + 'px, 0px, 0px)';						
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
							if (posY >= max * 2) {
								drag_img.style.webkitTransform = 'translate3d(0px, ' + posY + 'px, 0px)';
							}
							else if (curY <= max * 2) {
								drag_img.style.webkitTransform = 'translate3d(0px, ' + max * 2 + 'px, 0px)';						
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