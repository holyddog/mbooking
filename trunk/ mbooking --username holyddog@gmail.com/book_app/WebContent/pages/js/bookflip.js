Page.Book = {
	url: 'pages/html/book.html',
	init: function(params, container) {	
		var self = this;
		var content = container.find('.content');
		Page.bodyShowLoading(content);
		
		// set content data		
//		Service.Book.GetBook(params.bid, params.uid, function(data) {
//			Page.bodyHideLoading(content);
//			self.load(container, data);
//		});
		Service.Book.GetBook(5, 3, function(data) {
			Page.bodyHideLoading(content);
			self.load(container, data);
		});
	},
	
	load: function(container, bookData) {		
		var index = 0;
		var delay_flip =0 ;//ms
		// generate book pages
		var data = bookData.pages;
		if (data.length) {		
				for (var i = data.length - 1; i > -3; i--) {
						
//					var tran_str = 'transition: '+delay_flip+'ms ease-in-out; -webkit-transition: '+delay_flip+'ms ease-in-out;';
					var tran_str = '';
					var f_ev_str = 'f_ev';
					if(i==-2){	
						tran_str='';
						f_ev_str='';
					}
					
					var page;
					if(i==-1)
					{
						 page =  $('<div class="page_nav fill_dock box vertical" style="z-index:1000; pointer-events: none; visibility: hidden; -webkit-transform-origin: left center; left: 50%; -webkit-transform-style: preserve-3d;'
									+tran_str+'"></div>');					
						
						
					}
					else{	
					
					   page =  $('<div class="page_nav fill_dock box vertical" style="pointer-events: none; visibility: hidden; -webkit-transform-origin: left center; left: 50%; -webkit-transform-style: preserve-3d;'
								+tran_str+'"></div>');					
					}
					
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
						backpage = $('<div class="backside fill_dock box vertical" style="background-color: white; overflow: hidden; width:50%; position:absolute; -webkit-transform:  rotate3d(0, 1, 0, 180deg); -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');
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
						backpage = $('<div class="backside fill_dock box vertical" style="background-color: white; overflow: hidden; width:50%; position:absolute; -webkit-transform: rotate3d(0, 1, 0, 180deg); -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');	
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
						container.find('.page_nav').eq(data.length+1).css('-webkit-transform', 'rotate3d(0, 1, 0, -180deg)');
						index = data.length;
					
						// set background image
						var bgImage = /*Config.FILE_URL +*/ Util.getImage(bookData.pic, Config.FILE_SIZE.LARGE);
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
					container.find('.author_info img').attr('src', /*Config.FILE_URL + */Util.getImage(bookData.author.pic, Config.FILE_SIZE.SQUARE));
				}
				container.find('.text_bar .fright').text(bookData.pcount + ' Page' + ((bookData.pcount > 1)? 's': ''));
				
				
				
				
//				var zcount=0;
//				var lock_forward_touch =false;
//				var lock_backward_touch =false;
//				
//				container.find('.f_ev').tap(function() {
//					if(!lock_forward_touch&&!lock_backward_touch)
//					{	
//							if (index > 0) {
//								console.log(index);
//								zcount++;
//								
//								var next_nav  = container.find('.page_nav').eq(index-1);
//								next_nav[0].style.zIndex = zcount+2;
//								
//								var page_nav  = container.find('.page_nav').eq(index);
//								page_nav[0].style.zIndex = zcount+1;
//								page_nav.addClass('zindex_over');
//								
//								var prev_nav  = container.find('.page_nav').eq(index+1);
//								
//								prev_nav.removeClass('zindex_over');
//								prev_nav.className = "page_nav fill_dock box vertical";
//								
//								var two_step_next_nav  = container.find('.page_nav').eq(index-2);
//								if(two_step_next_nav)two_step_next_nav.removeClass('no_display');
//								
//								var two_step_prev_nav  = container.find('.page_nav').eq(index+2);
//								if((index+2<=data.length+1)&&two_step_prev_nav)two_step_prev_nav.addClass('no_display');
//								
//								
//								
//								lock_forward_touch = true;
//								page_nav.css('-webkit-transform', 'rotate3d(0, 1, 0, -180deg)');
//								
//						
//							
//								setTimeout(function() {
//									lock_forward_touch = false;	
//								}, delay_flip*.4);
//								
//								setTimeout(function() {
//									page_nav.removeClass('zindex_over');
//								}, delay_flip*.8);
//											
//								index--;
//							
//							}
//						
//						}
//					});
//				
//					container.find('.bk_ev').tap(function() {
//					
//					if(!lock_forward_touch&&!lock_backward_touch)
//					{
//						if(index<data.length) {	
//							
//							index++;
//							zcount--;
//							
//							
//							var next_nav  = container.find('.page_nav').eq(index-1);
//
//							next_nav[0].style.zIndex = '';
//						
//							var page_nav  = container.find('.page_nav').eq(index);
//							
//							page_nav.removeClass('zindex_over');
//								
//							var two_step_prev_nav  = container.find('.page_nav').eq(index+2);
//							if(two_step_prev_nav)two_step_prev_nav.removeClass('no_display');
//							
//							var two_step_next_nav  = container.find('.page_nav').eq(index-2);
//							if((index-2>=0)&&two_step_next_nav)two_step_next_nav.addClass('no_display');
//							
//							
//							lock_backward_touch = true;
//							
//							page_nav.css('-webkit-transform', 'rotate3d(0, 1, 0, 0deg)');
//
//						
//							setTimeout(function() {
//								lock_backward_touch = false;	
//								if(index==data.length) {	
//									page_nav[0].style.zIndex = '';		
//								}
//							}, delay_flip/2);
//							
//						
//				
//						}
//					}
//					
//				});
			
//				var zcount=0;
//				
//				var stop = true;
//				var ang_tmp = 0;
//				var w = $(window).width()/2;
//				var direct = 1; // 1 next 0 back
//				
//				var next_nav  = container.find('.page_nav').eq(index-1);
//				var page_nav  = container.find('.page_nav').eq(index);
//				var prev_nav  = container.find('.page_nav').eq(index+1);
//				
//				var startx = -1; 
//				var logpage = false;
//				
//				var timer = null;
				
//				function start(x){
//					
//					if(!logpage){
//					
//					startx = x;
//					console.log("start x:"+startx);
//					timer = setTimeout(function(){
//						console.log("after 500");
//					}, 500);
//					
////					var cdx = ((2*x)/w - 1);
////					var angle =Math.round(Math.acos(cdx)* (180 / Math.PI));
////					if(angle !=ang_tmp){
////						ang_tmp = angle;
////					}
////					
////					if(x>=w/2){
////						direct = 1;
////						if (index > 0) {
////						    console.log("index: " +index);			
////							zcount++;
////							page_nav  = container.find('.page_nav').eq(index);
////							page_nav[0].style.webkitTransition=  '';
////							page_nav[0].style.zIndex = zcount+1;
////							page_nav.addClass('zindex_over');
////							
////							prev_nav  = container.find('.page_nav').eq(index+1);
////							prev_nav.removeClass('zindex_over');
////							
////							stop = false;
////						}else{
////							stop = true;
////						}
////					}else{
////						direct = 0;
////						if(index<data.length) {	
////							index++;
////							zcount--;
////						
////							var next_nav  = container.find('.page_nav').eq(index-1);
////							next_nav[0].style.zIndex = '';
////					
////							var page_nav  = container.find('.page_nav').eq(index);
////							page_nav[0].style.webkitTransition=  '';
////							page_nav.removeClass('zindex_over');
////							
////							stop = false;
////						}else{
////							stop = true;
////						}
////						
////					}
//					}
//				}
//				
//				function move(x){
//					if(startx!=-1){	
//						distance = startx-x;
//						
//						if(distance>200){
//							clearTimeout (timer);
//							console.log("Goals");	
//						}
//						
//						
//					  
//					}  
////					if(!stop){
////						var cdx = ((2*x)/w - 1);
////						var angle =Math.round(Math.acos(cdx)* (180 / Math.PI));
////						if(angle !=ang_tmp){
////							ang_tmp = angle;
////							container.find('.page_nav').eq(index)[0].style.webkitTransform = "rotate3d(0, 1, 0,"+ang_tmp+"deg)";
////						}
////					}
//				}
//				
//				function end(){
//					startx=-1;
////					container.find('.page_nav').eq(index)[0].style.webkitTransition=  '200ms ease-in-out';
////					
////					if(ang_tmp>=90){
////						
////						if(!((direct==1&&index <= 0)||(direct==0&&index == data.length))){
////							container.find('.page_nav').eq(index)[0].style.webkitTransform = "rotate3d(0, 1, 0, 180deg)";
////						}
////						
////						if(direct==1&&index > 0){
////							page_nav.removeClass('zindex_over');
////
////							next_nav  = container.find('.page_nav').eq(index-1);
////							next_nav[0].style.zIndex = zcount+2;
////								
////							var two_step_next_nav  = container.find('.page_nav').eq(index-2);
////							if(two_step_next_nav)two_step_next_nav.removeClass('no_display');
////								
////							var two_step_prev_nav  = container.find('.page_nav').eq(index+2);
////							if((index+2<=data.length+1)&&two_step_prev_nav)two_step_prev_nav.addClass('no_display');
////							stop = false;
////							
////							index--;
////						}
////						else if(direct==0&&index!=data.length){
////							zcount++;
////							index--;						
////						}
////						
////					}else{
////					
////						
////						container.find('.page_nav').eq(index)[0].style.webkitTransform = "rotate3d(0, 1, 0, 0deg)";
////						
////						
////						if (direct==1&&index > 0) {
////							zcount--;
////							page_nav  = container.find('.page_nav').eq(index);
////							page_nav[0].style.zIndex = zcount+1;
////							page_nav.removeClass('zindex_over');
////							
////						}
////						else if(direct==0&&index!=data.length){	
////							var two_step_prev_nav  = container.find('.page_nav').eq(index+2);
////							if(two_step_prev_nav)two_step_prev_nav.removeClass('no_display');
////							var two_step_next_nav  = container.find('.page_nav').eq(index-2);
////							if((index-2>=0)&&two_step_next_nav)two_step_next_nav.addClass('no_display');
////						}
////						
////					}
////					
////					if(index==data.length) {	
////						page_nav[0].style.zIndex = '';		
////					}
////					 stop = true;
//				}
				
				
				
				
		
				var ang_tmp = 0;
				var window_width = $(window).width();
				var w = window_width;	
				var timer = null;
				var tempst_x = null; 
				var startx = null;
				var isdrag=false;
				var distance = 0;
				var state=0;//1:next, -1:back
				var zcount=0;
				var lockpage=false;
				var duration=400;//ms
				
				var locktimer = null;
				
				container.find('.page_nav').unbind('transitionend webkitTransitionEnd');
				container.find('.page_nav').bind('transitionend webkitTransitionEnd', function(){
					clearTimeout(locktimer);
					lockpage=false;
				});
				
				//
				var sndpage = false;
				
				function startnextpage(){

					if (index > 0) {
						prev_nav  = container.find('.page_nav').eq(index+1);
						prev_nav.removeClass('zindex_over');
						
						zcount++;
						page_nav  = container.find('.page_nav').eq(index);
						page_nav[0].style.webkitTransition=  '';
						page_nav[0].style.zIndex = zcount+1;
						page_nav.addClass('zindex_over');
						
					}
					
				}
				
				function startbackpage(){
					if(index<data.length) {	
						index++;
						zcount--;
					
						var next_nav  = container.find('.page_nav').eq(index-1);
						next_nav[0].style.zIndex = '';
				
						var page_nav  = container.find('.page_nav').eq(index);
						page_nav[0].style.webkitTransition=  '';
						
						if(isdrag){
							page_nav.removeClass('zindex_over');
						}else{
							setTimeout(function() {
								page_nav.removeClass('zindex_over');
							}, duration*1.5);
						}
					}
				}
				
				function endnextpage(){
					if (index > 0) {
							page_nav.removeClass('zindex_over');
	
							next_nav = container.find('.page_nav').eq(index - 1);
							next_nav[0].style.zIndex = zcount + 2;
	
							var two_step_next_nav = container.find('.page_nav').eq(index - 2);
							if (two_step_next_nav)
								two_step_next_nav.removeClass('no_display');
	
							var two_step_prev_nav = container.find('.page_nav').eq(index + 2);
							if ((index + 2 <= data.length + 1) && two_step_prev_nav)
								two_step_prev_nav.addClass('no_display');
							stop = false;
	
							index--;
						
					}
				}
				
				function cancelnextpage(){
					if (index > 0) {
						zcount--;
						page_nav = container.find('.page_nav').eq(index);
						page_nav[0].style.zIndex = zcount + 1;
						page_nav.removeClass('zindex_over');
					}
				}
				
				function endbackpage(){
					if(index!=data.length){
						var two_step_prev_nav  = container.find('.page_nav').eq(index+2);
						if(two_step_prev_nav)
							two_step_prev_nav.removeClass('no_display');
									
						var two_step_next_nav  = container.find('.page_nav').eq(index-2);
						if((index-2>=0)&&two_step_next_nav)
							two_step_next_nav.addClass('no_display');		
					}
				}				
			
				function cancelbackpage(){
					if(index!=data.length){
						zcount++;
						index--;						
					}
				}
				
				function dodrag(){
					var cdx = (1 - (2*distance)/w );
					
					if(state ==-1)
						cdx = cdx*-1;
					
//					console.log("cdx "+ cdx );
//					console.log("distance "+distance);
//					console.log("w  "+w);
					
					var angle =Math.round(Math.acos(cdx)* (180 / Math.PI));
					
					if(angle !=ang_tmp){
						ang_tmp = angle;
						container.find('.page_nav').eq(index)[0].style.webkitTransition=  '';
						
						if(ang_tmp>=160){
							container.find('.page_nav').eq(index)[0].style.webkitTransition=  '200ms ease-in-out';
							ang_tmp = 180;
						}
						
						if(ang_tmp<=20){
							container.find('.page_nav').eq(index)[0].style.webkitTransition=  '200ms ease-in-out';
							ang_tmp = 0;
						}
						
						container.find('.page_nav').eq(index)[0].style.webkitTransform = "rotate3d(0, 1, 0,"+ang_tmp+"deg)";
					}
				}
				
				function dochangepage(x){
					clearTimeout(locktimer);
					locktimer = setTimeout(function(){
						lockpage=false;
					}, duration+100);
					
					function flipnext(){
						lockpage=true;
						container.find('.page_nav').eq(index)[0].style.webkitTransition=  duration+'ms ease-in-out';
						container.find('.page_nav').eq(index).css('-webkit-transform', 'rotate3d(0, 1, 0, 180deg)');				
					}
					
					function flipback(){
						lockpage=true;
						container.find('.page_nav').eq(index)[0].style.webkitTransition=  duration+'ms ease-in-out';
						container.find('.page_nav').eq(index).css('-webkit-transform', 'rotate3d(0, 1, 0, 0deg)');
					}
					
					if(isdrag){
						console.log(index);
						if(state==1){
							if(tempst_x-x>0){
								if(index>0)
								flipnext();
								endnextpage();	
							}
							else if(tempst_x-x==0){
								if(ang_tmp>=90){
									if(index>0)
									flipnext();
									endnextpage();	
								}else{
									flipback();
									cancelnextpage();
								}
							}
							else{
								flipback();
								cancelnextpage();
							}
						}else if(state==-1){
							if(tempst_x-x>0){
								flipnext();
								cancelbackpage();	
							}
							else if(tempst_x-x==0){
								if(ang_tmp>=90){
									flipnext();
									cancelbackpage();	
								}else{
									if(!(index==data.length&&!sndpage))
									flipback();
									endbackpage();	
								}
							}
							else{
								if(!(index==data.length&&!sndpage))
								flipback();
								endbackpage();
							}
						}
					}else{
						if(state==1){
							if(index>0)
							flipnext();
							endnextpage();		
						}else if(state==-1){
							if(!(index==data.length&&!sndpage))
							flipback();
							endbackpage();
						}
					}
					tempst_x=null;
					distance = 0;
					state=0;
					ang_tmp=0;
				}
				
				///////////Timer////////////////////
				var maxdrag_pos_in_range = 10;
				function beginTimer(x){
					clearTimeout (timer);
					startx = x;
					tempst_x = x;
					isdrag =false;
					if(x<maxdrag_pos_in_range||x>($(window).width()-maxdrag_pos_in_range)){
						w = Math.ceil($(window).width()*.95);
					}else{
						w = Math.ceil(window_width*0.5);
					}
					
				}
				function betweenMoveTimer(x,maxdistance,time_ms){
					if(tempst_x!=null){
						
						if(state==0){
							if(tempst_x-x>0){
								state =1;
								startnextpage();
							}else{
								state =-1;
								if(index==data.length-1){
									sndpage =true;
								}else{
									sndpage =false;
								}
								startbackpage();
							}
						}
						
						if(timer==null){
								timer = setTimeout(function(){
									isdrag = true;
									tempst_x = x;
									clearTimeout (timer);
									timer = null;
							}, time_ms);
						}
						

						if((tempst_x-x>maxdistance||tempst_x-x<-maxdistance)&&!isdrag){
							
							clearTimeout (timer);	
							timer=null;
							tempst_x=null;	
							startx =null;
							isdrag =false;
							
							dochangepage();
							
						}else{
							distance = startx-x;
							if(state ==-1){
								distance = distance*-1;
							}
							
							if((!(index==data.length&&state ==-1&&!sndpage))&&!(index==0&&state ==1)){	
								console.log(index);
								dodrag();
							}
						}
					}  
				}
				function endTimer(){
					clearTimeout(timer);	
					
				}
				//////////////////////////////
			
				
				function start(x){
					state = 0;
					beginTimer(x);
				}
				
				function move(x){
					if(!lockpage){
						betweenMoveTimer(x,20,15);
					
					}
				}
				
				function end(x){
					if(!lockpage){
						endTimer();
						dochangepage(x);
					}
				}
	
				
				if (Device.isMobile()) {
					container.bind('touchstart', function(e) {
						e.preventDefault();
						var x = e.originalEvent.touches[0].pageX;
						start(x);
					});
					container.bind('touchmove', function(e) {
							//if(!stop){
								e.preventDefault();
								var x = e.originalEvent.touches[0].pageX;
								move(x);
							//}
					});
					container.bind('touchend', function(e) {
						e.preventDefault();
						var x = e.originalEvent.changedTouches[0].pageX;
						end(x);
					});
				}
				else {
					container.bind('mousedown', function(e) {
						if (e.button == 0) {
							e.preventDefault();
							var x = e.originalEvent.offsetX;
							start(x);
						}
					});
					container.bind('mousemove', function(e) {
							if(e.button == 0){
								//if(!stop&&e.button == 0){
								e.preventDefault();
								var x = e.originalEvent.offsetX;
								move(x);
							}
					});
					container.bind('mouseup', function(e) {
						if (e.button == 0) {
							e.preventDefault();
							var x = e.originalEvent.offsetX;
							end(x);
						}
					});
				}
				
				
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