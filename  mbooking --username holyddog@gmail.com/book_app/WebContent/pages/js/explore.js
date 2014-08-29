Page.Explore = {
	url: 'pages/html/explore.html',
	init: function(params, container) {	
		clearInterval(Page.inv1);
		clearInterval(Page.inv2);
		
		var self = this;
		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
		var btnAdd = container.find('[data-id=btn_a]');
		btnAdd.tap(function() {
			Page.open('AddPage', true, { total: Account.bookCount });
		});
		var btnNotf = container.find('[data-id=btn_n]');
		btnNotf.tap(function() {
			btnNotf.find('.notf_count').removeClass('show');
			Page.open('Notifications', true);
		});	
		var btnSearch = container.find('[data-id=btn_s]');
		btnSearch.tap(function() {
			Page.open('Search', true);
		});
		
		if (true) {
			if (Account.exguide) {
				container.find('.book_con').css('pointer-events', 'none');
				var menu_btn = container.find('[data-id=btn_m]');
				menu_btn.unbind();
				menu_btn.tap(function() {
					$('.user_guide').fadeOut();
					Page.slideMenu();
					menu_btn.unbind();
					menu_btn.tap(function() {
						Page.slideMenu();
					});
				});
				$('.skip_btn').css('pointer-events', 'none');
				container.find('.content').tap(
					function() {
						container.find('.content').unbind();
						$('.book_con').css('pointer-events', '');
						$('.user_guide').fadeOut();
					}
				);
				Service.User.ViewGuide("exguide", Account.userId,
					function() {
						delete Account["exguide"];
						localStorage.setItem("u", JSON.stringify(Account));
					}
				);
			} else {
				$('.user_guide').hide();
			}
		}else {
			$('.user_guide').hide();
		}

		self.load(container.find('.content .flex1'));
		Page.createShortcutBar(container);
	},
	
	load: function(content, pwidth) {
		var self = this;
		
		Page.bodyShowLoading(content);
		
		Service.Search.Explore(Account.userId, function(data) {
			Page.bodyHideLoading(content);
			
			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				content.append(self.getCatGroup(d.title, d.desc, d.ref, d.type, d.books));				
			}	
			
			var panel = content.find('.cat_group');
			var panelWidth = panel[0].offsetWidth;
			if (!panelWidth && pwidth) {
				panelWidth = pwidth;
			}
			
			var ratio = 2;
			if (panelWidth >= 600) {
				ratio = 3;
			}
			
			if (ratio == 2) {
				var books = content.find('.book_con');
				for (var i = 0; i < books.length; i++) {
					books.eq(i).find('.book').eq(2).hide();
				}
			}
			
			var w = (panelWidth / ratio) - 15;
			var h = (w * 4) / 3;
			content.find('.book').css({
				width: w + 'px'
			});
			content.find('.book_size').css({
				width: w + 'px',
				height: h + 'px',
				margin: 0,
				float: 'none'
			}).click(function(e) {
				e.preventDefault();
				
				var bid = $(this).data('bid');
				var uid = $(this).data('uid');
				var key = $(this).data('key');
                     Page.open('Book', true, { bid: bid, uid: uid, key: key,back_reload:true });
			});
			panel.find('.panel').click(function(e) {
				e.preventDefault();
				
				var uid = $(this).data('uid');
				Page.open('Profile', true, { uid: uid, back: true });
			});
		});		
	},
	
	getCatGroup: function(title, tag, ref, type, books) {
		
//		<div class="cat_group flow_hidden">
//			<div class="flow_hidden">
//				<div class="fleft">
//					<h2 class="title">Reccomended for You</h2>
//					<div class="ref_tag"></div>
//				</div>
//				<div class="fright">
//					<a class="more">MORE</a>
//				</div>
//			</div>
//			<div class="book_con" style="padding: 5px;">				
//				<div class="book"><div class="b book_size" data-bid="70" data-key="PAVpcvw4YF" data-uid="1" style="margin: 0px; float: none; background-image: url(http://localhost/res/book/u1/b70/8EAsB61r_s.jpg); background-color: rgb(109, 202, 236);"><h2>Royal Thai Cuisine</h2><div class="social flow_hidden"><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/like.png);"></div><div class="text">2</div></div><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/comment.png);"></div><div class="text">0</div></div></div><div class="pcount">1</div></div><div data-uid="1" class="panel flow_hidden"><div class="fleft"><img class="image" src="http://localhost/res/book/u1/GuR0GCuG_sp.jpg" onerror="this.src = 'images/user.jpg';"></div><div class="author"><div class="text">Chanon Trising</div></div></div></div>
//				<div class="book"><div class="b book_size" data-bid="71" data-key="3pbTzr0XsG" data-uid="2" style="margin: 0px; float: none; background-image: url(http://localhost/res/book/u2/b71/i3VSbhxG_s.jpg); background-color: rgb(182, 219, 73);"><h2>Festival of Flowers</h2><div class="social flow_hidden"><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/like.png);"></div><div class="text">0</div></div><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/comment.png);"></div><div class="text">1</div></div></div><div class="pcount">1</div></div><div data-uid="2" class="panel flow_hidden"><div class="fleft"><img class="image" src="http://localhost/res/book/u2/dCU1u63X_sp.jpg" onerror="this.src = 'images/user.jpg';"></div><div class="author"><div class="text">Monkey D Luffy</div></div></div></div>
//				<div class="book"><div class="b book_size" data-bid="69" data-key="DvNTZtYQou" data-uid="1" style="margin: 0px; float: none; background-image: url(http://localhost/res/book/u1/b69/36L79R5j_s.jpg); background-color: rgb(207, 159, 231);"><h2>Day Trip to Koh Larn</h2><div class="social flow_hidden"><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/like.png);"></div><div class="text">1</div></div><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/comment.png);"></div><div class="text">0</div></div></div><div class="pcount">2</div></div><div data-uid="1" class="panel flow_hidden"><div class="fleft"><img class="image" src="http://localhost/res/book/u1/GuR0GCuG_sp.jpg" onerror="this.src = 'images/user.jpg';"></div><div class="author"><div class="text">Chanon Trising</div></div></div></div>
//			</div>
//		</div>
		
		var group = document.createElement('div');
		group.className = 'cat_group flow_hidden';
		
		var header = document.createElement('div');
		header.className = 'flow_hidden';
		
		var fleft = document.createElement('div');
		fleft.className = 'fleft label';
		
		var h2 = document.createElement('h2');
		h2.className = 'title ' + ((!tag)? 'notag': '');
		h2.innerText = title;
		fleft.appendChild(h2);
		
		if (tag) {
			var refTag = document.createElement('div');
			refTag.className = 'ref_tag';
			refTag.innerText = '#' + tag;
			fleft.appendChild(refTag);
		}
		
		var fright = document.createElement('div');
		fright.className = 'fright';
		
		var more = document.createElement('a');
		more.className = 'more type' + type;
		more.innerText = 'MORE';
		
		if (ref) {
			more.onclick = function() {
				Page.open(ref, true, { title: title, tag: tag, back: true });
			};
		}
		
		fright.appendChild(more);
		
		header.appendChild(fleft);
		header.appendChild(fright);
		
		var bookCon = document.createElement('div');
		bookCon.className = 'book_con';
		bookCon.style.padding = '5px';
		
		for (var i = 0; i < books.length; i++) {
			var b = books[i];
			
			var div = document.createElement('div');
			div.className = 'book';
			
			div.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount, b.key));
			div.appendChild(Page.Following.getAuthor(b.author.uid, b.author.dname, b.author.pic));
			
			bookCon.appendChild(div);
		}
		
//		bookCon.appendChild($('<div class="book"><div class="b book_size" data-bid="70" data-key="PAVpcvw4YF" data-uid="1" style="margin: 0px; float: none; background-image: url(http://localhost/res/book/u1/b70/8EAsB61r_s.jpg); background-color: rgb(109, 202, 236);"><h2>Royal Thai Cuisine</h2><div class="social flow_hidden"><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/like.png);"></div><div class="text">2</div></div><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/comment.png);"></div><div class="text">0</div></div></div><div class="pcount">1</div></div><div data-uid="1" class="panel flow_hidden"><div class="fleft"><img class="image" src="http://localhost/res/book/u1/GuR0GCuG_sp.jpg""></div><div class="author"><div class="text">Chanon Trising</div></div></div></div>')[0]);
//		bookCon.appendChild($('<div class="book"><div class="b book_size" data-bid="71" data-key="3pbTzr0XsG" data-uid="2" style="margin: 0px; float: none; background-image: url(http://localhost/res/book/u2/b71/i3VSbhxG_s.jpg); background-color: rgb(182, 219, 73);"><h2>Festival of Flowers</h2><div class="social flow_hidden"><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/like.png);"></div><div class="text">0</div></div><div class="clabel"><div class="icon mask_icon" style="-webkit-mask: url(http://localhost/book_app/icons/comment.png);"></div><div class="text">1</div></div></div><div class="pcount">1</div></div><div data-uid="2" class="panel flow_hidden"><div class="fleft"><img class="image" src="http://localhost/res/book/u2/dCU1u63X_sp.jpg""></div><div class="author"><div class="text">Monkey D Luffy</div></div></div></div>')[0]);
		
		group.appendChild(header);
		group.appendChild(bookCon);
		
		return group;
	},
	callPushNote:{}
};