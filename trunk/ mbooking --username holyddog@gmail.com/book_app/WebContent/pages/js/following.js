Page.Following = {
	url: 'pages/html/following.html',
	init: function(params, container) {			
		clearInterval(Page.inv1);
		clearInterval(Page.inv2);
		
		var self = this;
		
		var tab1 = container.find('#foll_tab1');
		var tab2 = container.find('#foll_tab2');
		
		// set toolbar buttons
		container.find('[data-id=btn_m]').tap(function() {
			Page.slideMenu();
		});	
		container.find('[data-id=btn_r]').tap(function() {
			if (tab2.is(':visible')) {
				self.load(container);				
			}
			else {	
				self.loadActivity(container);
			}
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
		
		if(/*window.navigator.onLine*/true){
		$('.user_guide').css('pointer-events','all');
			if(Account.fguide){
				$('.user_guide').tap(
					function(){
						$('.user_guide').fadeOut();
					}
				);
				Service.User.ViewGuide("fguide", Account.userId,
					function(){
						delete Account["fguide"];
						localStorage.setItem("u", JSON.stringify(Account));
					}
				);
			}else{
				$('.user_guide').hide();
			}
		}
		else{
			$('.user_guide').hide();
		}
		
		var tabs = container.find('.tab');
		tabs.tap(function() {
			var t = $(this);
			var index = t.index();
			
			tabs.removeClass('active');
			t.addClass('active');
			
			tab1.hide();
			tab2.hide();
			
			var tab = container.find('#' + t.data('link'));
			tab.show();
			
			if (index == 0) {
			}
			else {
				if (container.find('.book_con').find('.b').length == 0) {
					self.load(container);					
				}
			}
		});

		self.loadActivity(container);
		Page.createShortcutBar(container);
	},
	
	getBook: function(data) {
//		<div class="box horizontal border">
//			<div class="bpic">
//				<img src="http://192.168.0.113/res/book/u1/b63/6o7t9D2U_s.jpg">
//			</div>
//			<div class="blabel flex1">Unde deleniti incidunt qui magnis</div>
//		</div>
		var box = document.createElement('box');
		box.className = 'box horizontal border';
		box.dataset.bid = data.bid;
		box.dataset.uid = data.uid;
		
		var bpic = document.createElement('div');
		bpic.className = 'bpic';
		var img = document.createElement('img');
		
		if(data.pic){
			img.src = Util.getImage(data.pic, 2);
			img.setAttribute("onerror", "this.src = 'images/user.jpg';");
		}
		else
			img.src = 'images/user.jpg';
		
		bpic.appendChild(img);
		
		var blabel = document.createElement('div');
		blabel.className = 'blabel flex1';
		blabel.innerText = data.title;
		
		box.appendChild(bpic);
		box.appendChild(blabel);
		
		return box;
	},
	
	getUser: function(data) {
//		<div class="box horizontal border">
//			<div class="upic">
//				<img src="http://192.168.0.113/res/book/u2/3eY4e0ee_sp.jpg">
//			</div>
//			<div class="uref flex1">
//				<div class="ulabel">Monkey D Luffy</div>
//				<div class="uname">@luffy</div>
//			</div>
//		</div>
		var box = document.createElement('box');
		box.className = 'box horizontal border';
		box.dataset.uid = data.uid;
		
		var upic = document.createElement('div');
		upic.className = 'upic';
		var img = document.createElement('img');
		
		if(upic){
			img.src = Util.getImage(data.pic, 3);
			img.setAttribute("onerror", "this.src = 'images/user.jpg';");
		}
		else
			img.src = 'images/user.jpg';
		
		upic.appendChild(img);
		
		var uref = document.createElement('div');
		uref.className = 'uref flex1';
		var ulabel = document.createElement('div');
		ulabel.className = 'ulabel';
		ulabel.innerText = data.dname;
		var uname = document.createElement('div');
		uname.className = 'uname';
		uname.innerText = '@' + data.uname;
		uref.appendChild(ulabel);
		uref.appendChild(uname);
		
		box.appendChild(upic);
		box.appendChild(uref);
		
		return box;
	},
	
	getAuthor: function(uid, name, pic) {
//		<div class="panel flow_hidden" data-uid="1">
//			<div class="fleft">
//				<img class="image" src="images/user.jpg">
//			</div>
//			<div class="author">
//				<div class="text">Holy D Dog</div>
//			</div>
//		</div>
		
		var adiv = document.createElement('div');
		adiv.dataset.uid = uid;
		adiv.className = 'panel flow_hidden';
		
		var fdiv = document.createElement('div');
		fdiv.className = 'fleft';
		
		var img = document.createElement('img');
		img.className = 'image';
		if (pic) {
			img.src = Util.getImage(pic, 3);
			img.setAttribute("onerror", "this.src = 'images/user.jpg';");
		}
		else {
			img.src = 'images/user.jpg';
		}
		fdiv.appendChild(img);
		adiv.appendChild(fdiv);
		
		var au = document.createElement('div');
		au.className = 'author';
		
		var text = document.createElement('div');
		text.className = 'text';
		text.innerText = name;
		
		au.appendChild(text);
		
		adiv.appendChild(au);
		
		return adiv;
	},
	
	
	
	load: function(container) {		
		var self = this;
		clearInterval(Page.inv1);
		Page.bodyHideNoItem(container.find('#foll_tab2'));
		var content = container.find('.content');
		var panel = container.find('.book_con');
		panel.empty();
		Page.bodyShowLoading(content);
		Service.Book.GetFollowBooksByUID(Account.userId, 0, Config.LIMIT_ITEM, function(data) {
			Page.bodyHideLoading(content);
			self.loadItems(data, container, panel);
			
			if (data.length >= Config.LIMIT_ITEM) {
				self.runInterval_1(container, panel, container.find('#foll_tab2'));
			}else if(data.error||data.length==0){
				Page.bodyHideLoading(content);
				Page.bodyNoItem(container.find('#foll_tab2'),"No Story Found");
			}
		},
		function(error){
			if(error.responseText=="" && error.status == 200){
				Page.bodyHideLoading(content);
				Page.bodyNoItem(container.find('#foll_tab2'),"No Story Found");
			}
		});
	},
	
	loadActivity: function(container) {
		var self = this;
		Page.bodyHideNoItem(container.find('#foll_tab1'));
		var content = container.find('.content');
		var panel = container.find('.act_con');
		panel.empty();
		
		Page.bodyShowLoading(content);
		Service.Book.GetFollowActivity(Account.userId, 0, Config.LIMIT_ITEM,
		function(data) {
			Page.bodyHideLoading(content);
			self.loadActivityItems(data, container, panel);
			
			if (data.length >= Config.LIMIT_ITEM) {
				self.runInterval_2(container, panel, container.find('#foll_tab1'));
			}
		},
		function(error){
			if(error.responseText=="" && error.status == 200){
				Page.bodyHideLoading(content);
				Page.bodyNoItem(container.find('#foll_tab1'),"No Activity Found");
			}
		});
	},
	
	getActivity: function(type, user, message, adate, book, who, comment) {
//		<div class="apanel box horizontal">
//			<div class="uimage">
//				<img src="http://192.168.0.113/res/book/u1/ghjlq4BX_sp.jpg" />
//			</div>
//			<div class="ubox flex1">
//				<div class="uinfo"><b>Chanon Trising</b> liked a story</div>
//				<div class="time">9 mins ago</div>
//				<div class="ref"></div>
//			</div>
//		</div>
		var self = this;
		
		var panel = document.createElement('div');
		panel.className = 'apanel box horizontal';
		
		var uimage = document.createElement('div');
		uimage.className = 'uimage';
		uimage.dataset.uid = user.uid;
		var img = document.createElement('img');
		
		if(user.pic){
			img.src = Util.getImage(user.pic, 3);
			img.setAttribute("onerror", "this.src = 'images/user.jpg';");
		}
		else
			img.src = 'images/user.jpg';
		
		uimage.appendChild(img);
				
		var ubox = document.createElement('div');
		ubox.className = 'ubox flex1';
		var uinfo = document.createElement('div');
		uinfo.className = 'uinfo';
		uinfo.innerHTML = message;
		uinfo.dataset.uid = user.uid;
		
		var time = document.createElement('div');
		time.className = 'time';
		time.innerText = adate;
		var ref = document.createElement('div');
		ref.className = 'ref';
		
		if (type > 0 && type < 5) {
			var b = book;
			if (b) {
				ref.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount, b.key));				
			}
			else {
				var del = document.createElement('span');
				del.style.fontSize = '80%';
				del.style.color = '#555';
				del.innerText = 'story deleted';
				ref.appendChild(del);
			}
		}
		else if (type == 5) {
			ref.appendChild(self.getUser(who));
		}
		else if (type == 6) {
			ref.appendChild(self.getBook(book));
		}
		
		ubox.appendChild(uinfo);
		ubox.appendChild(time);
		
		if (type == 6) {
			var com = document.createElement('div');
			com.className = 'comment';
			com.innerText = comment;
			ubox.appendChild(com);
		}
		
		ubox.appendChild(ref);
		
		
		panel.appendChild(uimage);
		panel.appendChild(ubox);
		
		return panel;
	},
	
	runInterval_1: function(container, panel, content) {		
		var self = this;
		var start = container.find('.book_size').length;
		var more = content.find('.load_more');
		Page.inv1 = setInterval(function() {
			if (!more.is(':visible') && content[0].scrollHeight - content[0].scrollTop <= content[0].offsetHeight) {
				more.show();
				Page.bodyShowLoading(more);
				
				Service.Book.GetFollowBooksByUID(Account.userId, start, Config.LIMIT_ITEM, function(data) {
					self.loadItems(data, container, panel);
					start += data.length;
					more.hide();
					Page.bodyHideLoading(more);
					
					if (data.length < Config.LIMIT_ITEM) {
						clearInterval(Page.inv1);
					}
				});
			}
		}, 1);
	},
	
	runInterval_2: function(container, panel, content) {		
		var self = this;
		var start = container.find('.apanel').length;
		var more = content.find('.load_more');
		Page.inv2 = setInterval(function() {
			if (!more.is(':visible') && content[0].scrollHeight - content[0].scrollTop <= content[0].offsetHeight) {
				more.show();
				Page.bodyShowLoading(more);
				
				Service.Book.GetFollowActivity(Account.userId, start, Config.LIMIT_ITEM, function(data) {
					self.loadActivityItems(data, container, panel);
					start += data.length;
					more.hide();
					Page.bodyHideLoading(more);
					
					if (data.length < Config.LIMIT_ITEM) {
						clearInterval(Page.inv2);
					}
				});
			}
		}, 1);
	},
	
	loadItems: function(data, container, panel) {
		var self = this;
		
		for (var i = 0; i < data.length; i++) {
			var b = data[i];
			
			var div = document.createElement('div');
			div.className = 'book';
			
			div.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount, b.key));
			div.appendChild(self.getAuthor(b.author.uid, b.author.dname, b.author.pic));
			
			panel.append(div);
		}
		self.resize(container, panel);		
	},
	
	loadActivityItems: function(data, container, panel) {
		var self = this;
		
		for (var i = 0; i < data.length; i++) {
			var a = data[i];
			
//			var div = document.createElement('div');
//			div.className = 'book';
//			
//			div.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount));
//			div.appendChild(self.getAuthor(b.author.uid, b.author.dname, b.author.pic));
//			
			panel.append(self.getActivity(a.type, a.user, a.message, a.dateStr, a.book, a.who, a.comment));
		}
		
		container.find('.uimage, .uinfo').click(function() {
			var target = $(this);
			Page.open('Profile', true, { uid: target.data('uid'), back: true });
		});
		container.find('.box.border').click(function() {
			var target = $(this);
			if (target.data('bid')) {
				Page.open('Book', true, { bid: target.data('bid'), uid: target.data('uid'), uid: target.data('key') });				
			}
			else {
				Page.open('Profile', true, { uid: target.data('uid'), back: true });
			}
		});

		self.resize(container, panel);	
	},
	
	loaded: false,
	bookSize: {},
	
	resize: function(container, panel) {
		if (!this.loaded) {
			var ratio = 2;
			if (panel[0].offsetWidth >= 600) {
				ratio = 3;
			}
			
			this.bookSize.w = (panel[0].offsetWidth / ratio) - 15;
			this.bookSize.h = (this.bookSize.w * 4) / 3;
			this.loaded = true;
		}		

		container.find('.book').css({
			width: this.bookSize.w + 'px'
		});
		container.find('.book_size').css({
			width: this.bookSize.w + 'px',
			height: this.bookSize.h + 'px',
			margin: 0,
			float: 'none'
		}).click(function() {
			var bid = $(this).data('bid');
			var uid = $(this).data('uid');
			var key = $(this).data('key');
			Page.open('Book', true, { bid: bid, uid: uid, key: key });
		});
		panel.find('.panel').click(function() {
			var uid = $(this).data('uid');
			Page.open('Profile', true, { uid: uid, back: true });
		});
	}
};