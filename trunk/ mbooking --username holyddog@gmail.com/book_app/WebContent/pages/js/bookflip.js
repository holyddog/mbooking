Page.Book = {
	url: 'pages/html/book.html',
	init: function(params, container) {	
		var self = this;
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		// set content data		
		Service.Book.GetBook(params.bid, params.uid, function(data) {
			Page.bodyHideLoading(content);
			self.load(container, data);
		});
	},
	
	load: function(container, bookData) {		
		var index = 0;
		var delay_flip =400 ;//ms
		// generate book pages
		var data = bookData.pages;
		if (data.length) {		
				for (var i = data.length - 1; i > -3; i--) {
						
					var tran_str = 'transition: '+delay_flip+'ms ease-in-out; -webkit-transition: '+delay_flip+'ms ease-in-out;';
					var f_ev_str = 'f_ev';
					if(i==-2){	
						tran_str='';
						f_ev_str='';
					}
					
					var page =  $('<div class="page_nav fill_dock box vertical" style="pointer-events: none; visibility: hidden; -webkit-transform-origin: left center; left: 50%; -webkit-transform-style: preserve-3d;'
								+tran_str+'"></div>');					
					
					var frontpage='';
					var fpic=null;
					
					var backpage='';
					var pic=null;
					
		
					var cover_page = '<div class="tbar_bg trans cover_book"></div>'
						+'<div class="grad_overlay fill_dock hid_loading"></div>'
						+'<div class="tbar">	'
						+'	<a data-id="btn_b" class="btn" style="left: 0; z-index: 1001;pointer-events:all;"><span class="back"></span></a>'
						+'	<div class="title" style="z-index: 100100;"></div>'
						+'	<a data-id="btn_c" class="btn" style="right: 0; pointer-events:all;"><span class="comment"></span></a>'
						+'	<a data-id="btn_s" class="btn" style="right: 0; display: none;pointer-events:all;"><span class="share"></span></a>	'
						+'</div>'
						+'<div class="content gray flex1 box vertical '+f_ev_str+'" style="pointer-events:all;">'
						+'	<div class="hid_loading">'
						+'		<h1 class="btitle"></h1>'
						+'		<div class="bdesc"></div>'
						+'		<div class="bline"></div>'
						+'		<div class="author_info box horizontal">'
						+'			<div class="pimage">'
						+'				<img src="images/user.jpg" />'
						+'			</div>'
						+'			<div class="box flex1" style="-webkit-box-align: center;">'
						+'					<h1 class="name"></h1>'
						+'			</div>'
						+'		</div>'
						+'		<div class="bottom_info">'
						+'			<div class="text_bar flow_hidden">'
						+'				<span class="fright">42 Pages</span>'
						+'			</div>'
						+'		</div>'
						+'	</div>'
						+'</div>	';
					
					var btn_b_str = '<a data-id="btn_b" class="btn" style="pointer-events:all; position:absolute; left: 0; top: 0; z-index: 1001;"><span class="back"></span></a>';
									
					
					if( i != - 2){
									
						frontpage = $('<div class="frontside fill_dock box vertical" style="background-color: white; overflow: hidden; width:50%; position:absolute; -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');
						var foutframe = $('<div class="fill_dock box vertical" style="width:200%; position:absolute;"></div>');
						var finframe = $('<div class="fill_dock box vertical" style="position:absolute; left:-100%;"></div>');
						if( i > - 1){
							fpic = $('<div class="pic_box flex1 relative f_ev" style="pointer-events:all; background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: 0px; height: 0px;" src="' + (Config.FILE_URL +(data[i].pic)) + '"></div>');
							var fcaption = $('<div class="f_ev" style="pointer-events:all; padding: 10px;">' + data[i].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i+1) + ' of ' + data.length + '</div>');
							foutframe.append(fpic).append(fcaption);
						}
						else if(i==-1){
							
							foutframe.append($(cover_page));
						
						}		
						finframe.append(foutframe);
						frontpage.append(finframe);
							
					}else{
						frontpage = $('<div class="frontside fill_dock box vertical" style="background-color: white; overflow: hidden; width:50%;height:100%; position:absolute; -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');					
					}	
				
					
					if(i!=data.length - 1){
						//back 2 pages
						backpage = $('<div class="backside fill_dock box vertical" style="background-color: white; overflow: hidden; width:50%; position:absolute; -webkit-transform: rotateY(180deg); -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');
						var outframe = $('<div class="fill_dock box vertical" style="width:200%; position:absolute;"></div>');
						
						if( i !=-2){
							pic = $('<div class="pic_box flex1 relative bk_ev" style="pointer-events:all; background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: 0px; height: 0px;" src="' + (Config.FILE_URL +(data[i+1].pic)) + '"></div>');
							var caption = $('<div class ="bk_ev" style="pointer-events:all; padding: 10px;">' + data[i+1].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i + 2) + ' of ' + data.length + '</div>');
							outframe.append(pic).append(caption).append($(btn_b_str));
						}else{
							outframe.append($(cover_page));
						}
						
						backpage.append(outframe);
					}else{
						backpage = $('<div class="backside fill_dock box vertical" style="background-color: white; overflow: hidden; width:50%; position:absolute; -webkit-transform: rotateY(180deg); -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');	
					}
					
					
					if(backpage!='')
					page.append(backpage);
					
					if(frontpage!='')
					page.append(frontpage);
					
					
					container.append(page);
					
					if(pic!=null)
					pic.find('img').data('height', pic.height());

					if(fpic!=null)
					fpic.find('img').data('height', fpic.height());
					
					
					if(i==-2){
						
						// set toolbar buttons
						var btnBack = container.find('[data-id=btn_b]'); 
						btnBack.tap(function() {
							Page.back();
						});
						var btnComment = container.find('[data-id=btn_c]');
						btnComment.tap(function() {
							Page.open('Comments', true, { bid: data.bid });
						});
						var btnShare = container.find('[data-id=btn_s]');
						btnShare.tap(function() {
							alert('share');
						});	
						
						
					}
					
					
				}
					
				var finish = function(count) {			
					
					if (count == (data.length)*2 -1) {
					
						for(var i= data.length-2;i>=0;i--){
							 page = container.find('.page_nav').eq(i);
							 if(page){
								 page.addClass('no_display');
							 }
						}
						
						container.find('.page_nav').css('display', '-webkit-box').css('visibility', 'visible');
						size = index;
						container.find('.page_nav').eq(data.length+1).css('-webkit-transform', 'rotateY(-180deg)');
						index = data.length;
					
						// set background image
						var bgImage = Config.FILE_URL + Util.getImage(bookData.pic, Config.FILE_SIZE.LARGE);
						var img = $('<img class="book_bg absolute fade_out show" src="' + bgImage + '" />');
						img.load(function() {

							$(container.find('.cover_book')[0]).parent().prepend(img);
							
							var h = $(window).innerHeight();
							var w = $(window).innerWidth();
							
							img.height(h);
							img.css('left', -1 * (img.width() / 2 - w / 2) + 'px');	
						});	
						
						var img2 = $('<img class="book_bg absolute fade_out show" src="' + bgImage + '" />');
						img2.load(function() {

							$(container.find('.cover_book')[1]).parent().prepend(img2);
							
							var h = $(window).innerHeight();
							var w = $(window).innerWidth();
							
							img2.height(h);
							img2.css('left', -1 * (img2.width() / 2 - w / 2) + 'px');	
						});	
						
						var content = container.find('.content');
						// show panel
						content.removeClass('gray').addClass('no_color');
						container.find('.hid_loading').removeClass('hid_loading');
					}
				};
				
				container.find('.btitle').text(bookData.title);
				container.find('.bdesc').text(bookData.desc);
				container.find('.author_info .name').text(bookData.author.dname);
				if (bookData.author.pic) {
					container.find('.author_info img').attr('src', Config.FILE_URL + Util.getImage(bookData.author.pic, Config.FILE_SIZE.SQUARE));
				}
				container.find('.text_bar .fright').text(bookData.pcount + ' Page' + ((bookData.pcount > 1)? 's': ''));
				
				var zcount=0;
				var lock_forward_touch =false;
				var lock_backward_touch =false;
				
				container.find('.f_ev').tap(function() {
					if(!lock_forward_touch&&!lock_backward_touch)
					{	
							if (index > 0) {
								console.log(index);
								zcount++;
								
								var next_nav  = container.find('.page_nav').eq(index-1);
								next_nav[0].style.zIndex = zcount+2;
								
								var page_nav  = container.find('.page_nav').eq(index);
								page_nav[0].style.zIndex = zcount+1;
								page_nav.addClass('zindex_over');
								
								var prev_nav  = container.find('.page_nav').eq(index+1);
								
								prev_nav.removeClass('zindex_over');
								prev_nav.className = "page_nav fill_dock box vertical";
								
								var two_step_next_nav  = container.find('.page_nav').eq(index-2);
								if(two_step_next_nav)two_step_next_nav.removeClass('no_display');
								
								var two_step_prev_nav  = container.find('.page_nav').eq(index+2);
								if((index+2<=data.length+1)&&two_step_prev_nav)two_step_prev_nav.addClass('no_display');
								
								
								
								lock_forward_touch = true;
								page_nav.css('-webkit-transform', 'rotateY(-180deg)');
								
						
							
								setTimeout(function() {
									lock_forward_touch = false;	
								}, delay_flip*.4);
								
								setTimeout(function() {
									page_nav.removeClass('zindex_over');
								}, delay_flip*.8);
											
								index--;
							
							}
						
						}
					});
				
					container.find('.bk_ev').tap(function() {
					
					if(!lock_forward_touch&&!lock_backward_touch)
					{
						if(index<data.length) {	
							
							index++;
							zcount--;
							
							
							var next_nav  = container.find('.page_nav').eq(index-1);

							next_nav[0].style.zIndex = '';
						
							var page_nav  = container.find('.page_nav').eq(index);
							
							page_nav.removeClass('zindex_over');
								
							var two_step_prev_nav  = container.find('.page_nav').eq(index+2);
							if(two_step_prev_nav)two_step_prev_nav.removeClass('no_display');
							
							var two_step_next_nav  = container.find('.page_nav').eq(index-2);
							if((index-2>=0)&&two_step_next_nav)two_step_next_nav.addClass('no_display');
							
							
							lock_backward_touch = true;
							
							page_nav.css('-webkit-transform', 'rotateY(0deg)');

						
							setTimeout(function() {
								lock_backward_touch = false;	
								if(index==data.length) {	
									page_nav[0].style.zIndex = '';		
								}
							}, delay_flip/2);
							
						
				
						}
					}
					
				});
				
				var count = 0;
				container.find('.page_nav .pic_box img').load(function() {
					var img = $(this);
					var pic = img.parent();
					
					var pw = pic.width();
					var ph = pic.height();
					
					if (ph >= pw) {
						img.css({
							height: ph + 'px',
							width: 'auto'
						});
						img.css({
							left: -1 * (img.width() / 2 - pw / 2) + 'px'
						});
					}
					else {
						img.css({
							width: pw + 'px',
							height: 'auto'
						});
						img.css({
							top: -1 * (img.height() / 2 - ph / 2) + 'px'
						});				
					}
					finish(count++);
				});
			}
			
		
		
		
	}
};