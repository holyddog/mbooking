Page.AllBooks = {
	url: 'pages/html/all_books.html',
	init: function(params, container) {		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		container.find('[data-id=btn_e]').tap(function() {
			alert('edit');
		});
		container.find('[data-id=btn_a]').tap(function() {			
			Page.open('AddPage', true);
		});
		
		// set content link
		container.find('[data-id=link_book]').tap(function() {
			Page.open('Book', true);
		});
		
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		var uid = params.uid;
		Service.Book.GetBooksByUid(uid, function(data) {
			Page.bodyHideLoading(content);
			
			var list = container.find('.book_list');
			var bcWidth = list.width();
			var bw = bcWidth / 2;
			var bh = (bw * 4) / 3;
			for (var i = 0; i < data.length; i++) {
				var b = data[i];
				var pic = Config.FILE_URL + Util.getImage(b.pic, Config.FILE_SIZE.COVER);
				
				var li = document.createElement('li');
				li.className = 'book_con';
				
				var divB = document.createElement('div');
				divB.className = 'b shadow_border';
				
				var divCover = document.createElement('div');
				divCover.dataset.bid = b.bid;
				divCover.className = 'cover';
				divCover.style.backgroundImage = 'url(' + pic + ')';
				
				var h3 = document.createElement('h3');
				h3.className = 'title';
				h3.innerText = b.title;
				
				var divPanel = document.createElement('div');
				divPanel.className = 'panel flow_hidden';
				
				var divLeft = document.createElement('div');
				divLeft.className = 'fleft';
				
				var img = document.createElement('img');
				img.className = 'image';
				img.src = 'images/user.jpg';
				
				var divAuthor = document.createElement('div');
				divAuthor.className = 'author';
				
				var divText = document.createElement('div');
				divText.className = 'text';
				divText.innerText = 'Holy D Dog';
				
				divAuthor.appendChild(divText);
				divLeft.appendChild(img);
				
				divPanel.appendChild(divLeft);
				divPanel.appendChild(divAuthor);				
				divCover.appendChild(h3);
				
				divB.appendChild(divCover);
//				divB.appendChild(divPanel);
				
				li.appendChild(divB);
				
				list.append(li);
			}
			
			
//			<li class="book_con">
//				<div class="b shadow_border">
//					<div class="cover" style="background-image: url(temp/cv1.jpg);">
//						<h3 class="title">Laoreet, dui volutpat eiusmod recusandae</h3>
//					</div>	
//					<div class="panel flow_hidden">	
//						<div class="fleft">
//							<img class="image" src="images/user.jpg" />
//						</div>
//						<div class="author">				
//						  <div class="text">Natus mi wisi</div>
//						</div>
//					</div>					
//				</div>
//			</li>
			
			container.find('.book_con').width(bw);
			container.find('.book_con .cover').height(bh);
			container.find('li .cover').tap(function() {
				Page.open('Book', true, { bid: $(this).data('bid'), uid: uid });
			}, true);
		});
	}
};