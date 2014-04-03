Page.PublishBook = {
	url: 'pages/html/publish_book.html',
	init: function(params, container) {
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
			Page.back();
		});
		var btnAccept = container.find('[data-id=btn_a]');
		btnAccept.tap(function() {
		});
		
		// set content data
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		Service.Book.GetBook(params.bid, Account.userId, function(data) { 
			Page.bodyHideLoading(content);
			
			var panelDiv = document.createElement('div');
			panelDiv.className = 'book_panel shadow_border';
			
			var titleH2 = document.createElement('h2');
			titleH2.className = 'title';
			titleH2.innerText = data.title;
			panelDiv.appendChild(titleH2);
			
			var boxDiv = document.createElement('div');
			boxDiv.className = 'box horizontal';			
			var imageDiv = document.createElement('div');
			imageDiv.className = 'bimage';
			var img = document.createElement('img');
			img.src = Util.getImage(Config.FILE_URL + data.pic, Config.FILE_SIZE.COVER);
			imageDiv.appendChild(img);
			boxDiv.appendChild(imageDiv);
			
			var infoDiv = document.createElement('div');
			infoDiv.className = 'binfo flex1';
			var descDiv = document.createElement('div');
			descDiv.className = 'desc';
			descDiv.innerText = data.desc;
			var countDiv = document.createElement('div');
			countDiv.className = 'pcount';
			countDiv.innerText = data.pcount + ' Pages';
			infoDiv.appendChild(descDiv);
			infoDiv.appendChild(countDiv);
			boxDiv.appendChild(infoDiv);
			
			panelDiv.appendChild(boxDiv);
			content.append(panelDiv);
			
//			<div class="book_panel shadow_border">		
//				<h2 class="title"></h2>
//				<div class="box horizontal">
//					<div class="bimage">
//						<img src="">
//					</div>
//					<div class="binfo flex1">
//						<div class="desc"></div>
//						<div class="pcount">34 Pages</div>
//					</div>
//				</div>
//			</div>
			
//			container.find('.book_panel').data('bid', data.bid);
//			container.find('.book_panel .title').text(data.title);
//			container.find('.book_panel .desc').text(data.desc);
		});		
	}
};