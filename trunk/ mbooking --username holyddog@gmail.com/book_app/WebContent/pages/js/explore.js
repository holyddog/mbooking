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
		container.find('[data-id=btn_r]').tap(function() {
			self.load($('#page_Explore').find('.content'));
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
		
		if (/*window.navigator.onLine*/true) {
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
		
		Page.createShortcutBar(container);
		self.load(container.find('.content'));
		
	
	},
	
	load: function(content, pwidth) {
		Page.bodyShowLoading(content);

		var panel = content.find('.book_con');
		panel.empty();
		
		Service.Book.GetPublishBooks(0, 100, function(data) {
			Page.bodyHideLoading(content);
			
			for (var i = 0; i < data.length; i++) {
				var b = data[i];
				
				var div = document.createElement('div');
				div.className = 'book';
				
				div.appendChild(Page.Profile.getBook(b.bid, b.title, b.pic, b.pcount, b.author, b.lcount, b.ccount, b.key));
				div.appendChild(Page.Following.getAuthor(b.author.uid, b.author.dname, b.author.pic));
				
				panel.append(div);
			}
			
			var panelWidth = panel[0].offsetWidth;
			if (!panelWidth && pwidth) {
				panelWidth = pwidth;
			}
			
			var ratio = 2;
			if (panelWidth >= 600) {
				ratio = 3;
			}
			
			var w = (panelWidth / ratio) - 15;
			var h = (w * 4) / 3;
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
				Page.open('Book', true, { bid: bid, uid: uid, key: key });
			});
			panel.find('.panel').click(function(e) {
				e.preventDefault();
				
				var uid = $(this).data('uid');
				Page.open('Profile', true, { uid: uid, back: true });
			});
			
			if (Device.PhoneGap.isReady && Page.Explore.callPushNote && Page.Explore.callPushNote != {}) {
				Page.Explore.callPushNote();
				Page.Explore.callPushNote = {};
			}
		},
        function(){
                Page.bodyHideLoading($('#page_Explore').find('.content'));
        },
        function(){
                Page.Explore.load($('#page_Explore').find('.content'));
        },
        function(){
                Page.bodyShowLoading($('#page_Explore').find('.content'));
        }                             
                                     
        );

	},
	callPushNote:{}
};