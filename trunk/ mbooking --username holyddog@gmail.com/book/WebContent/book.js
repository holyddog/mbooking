$(document).ready(function() {	
	
	var SERVICE = "http://119.59.122.38/book/data" ;
	var FILE = "http://119.59.122.38/book_dev_files" ;
	
	Device = {
			isMobile: function() {
				if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
					return true;
				}
				return false;
			}
	};
	var FILE_SIZE = {
			COVER: 1,
			SMALL: 2,
			PROFILE: 3
		};
	Util = {
			getImage: function(file, size) {
				if (!file) {
					return '';
				}
				var suffix = '';
				switch (size) {
					case FILE_SIZE.COVER: {
						suffix = '_c';
						break;
					}
					case FILE_SIZE.SMALL: {
						suffix = '_s';
						break;
					}
					case FILE_SIZE.PROFILE: {
						suffix = '_sp';
						break;
					}
					default: {
						suffix = '';
						break;
					}
				}
				return FILE + file.substring(0, file.lastIndexOf('.')) + suffix + file.substring(file.lastIndexOf('.'), file.length);
			}
		};
	
	bid = window.location.search.split("?bid=")[1];
		 
	 $('body').css("height",$(window).height+" px");
	 $('body').css("width","100%");
	 
	function aftergetbook(bookData){
		 var container;
		 var bwidth;
		 var bheight;
		 var mar_top;
		 if(Device.isMobile()){
			 container = $('body');
			 bwidth = $(window).width();
			 bheight = $(window).height();
			 mar_top = 0;
		 }else{
			 bwidth = 640;
			 bheight = 900;
			 mar_top =((screen.height-950)*(1/8));
			 $('body').css("background","black");
			 $('body').append($('<div data-id="book_container" style="width:'+bwidth+'px; height:'+bheight+'px; margin:auto; margin-top:'+mar_top+'px;"></div>'));
		 
			 container = $('body').find('[data-id=book_container]');
		 }
		 
		var index = 0;
		// generate book pages
		var data = bookData.pages;
		if (data.length) {		
				for (var i = data.length - 1; i > -3; i--) {
					var f_ev_str = 'f_ev';
					if(i==-2){	
						
						f_ev_str='';
					}
					
					var page;
					if(i==-1)
					{
						 page =  $('<div class="page_nav box vertical" style="position:absolute; width:'+(bwidth/2)+'px;height:'+bheight+'px;top:'+mar_top+'px;  z-index:500; pointer-events: none; visibility: hidden; -webkit-transform-origin: left center; left: 50%; -webkit-transform-style: preserve-3d;"></div>');					
						
						
					}
					else{	
					
					   page =  $('<div class="page_nav  box vertical" style="position:absolute; width:'+(bwidth/2)+'px;height:'+bheight+'px;top:'+mar_top+'px;pointer-events: none; visibility: hidden; -webkit-transform-origin: left center; left: 50%; -webkit-transform-style: preserve-3d;"></div>');					
					}
					
					var frontpage='';
					var fpic=null;
					
					var backpage='';
					var pic=null;
					
		
					var cover_page = 
						'<div class="bg trans cover_book"></div>'
						+'<div class="grad_overlay hid_loading" style=" width:'+(bwidth)+'px;height:'+bheight+'px;position:absolute"></div>'
						+'<div class="content gray box vertical '+f_ev_str+'" style=" width:'+(bwidth)+'px;height:'+bheight+'px;pointer-events:all;overflow: hidden;">'
						+'	<div class="hid_loading">'
						+'		<h1 class="btitle"></h1>'
						+'		<div class="bdesc"></div>'
						+'		<div class="bline"></div>'
						+'		<div class="author_info box horizontal">'
						+'			<div class="pimage">'
						+'				<img src="res/images/user.jpg" />'
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
									
						frontpage = $('<div class="frontside  box vertical" style="position:absolute; width:'+(bwidth/2)+'px;height:'+bheight+'px; background-color: white; overflow: hidden;  -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');
						var foutframe = $('<div class=" box vertical" style="position:absolute; width:'+(bwidth*2)+'px;height:'+bheight+'px;"></div>');
						var finframe = $('<div class=" box vertical" style="position:absolute; width:'+bwidth+'px;height:'+bheight+'px; left:-100%;"></div>');
						if( i > - 1){
							fpic = $('<div class="pic_box relative f_ev" style="pointer-events:all; background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: '+bwidth+'px; height: '+bwidth+'px;" src="' + Util.getImage(data[i].pic, 1) + '"></div>');
							var fcaption = $('<div class="box f_ev" style="width:'+(bwidth-20)+'px;height:'+(bheight-bwidth-20)+'px; pointer-events:all; padding: 10px; -webkit-box-align: center;">' + data[i].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i+1) + ' of ' + data.length + '</div>');
							foutframe.append(fpic).append(fcaption);
						}
						else if(i==-1){
							
							foutframe.append($(cover_page));
						
						}		
						finframe.append(foutframe);
						frontpage.append(finframe);
							
					}else{
						frontpage = $('<div class="frontside  box vertical" style="background-color: white; overflow: hidden; position:absolute; width:'+(bwidth)+'px;height:'+bheight+'px; -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');					
					}	
				
					
					if(i!=data.length - 1){
						//back 2 pages
						backpage = $('<div class="backside  box vertical" style="position:absolute; width:'+(bwidth/2)+'px;height:'+bheight+'px;background-color: white; overflow: hidden;  -webkit-transform:  rotate3d(0, 1, 0, 180deg); -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');
						var outframe = $('<div class=" box vertical" style="position:absolute; width:'+(bwidth*2)+'px;height:'+bheight+'px;"></div>');
						
						if( i !=-2){
							pic = $('<div class="pic_box relative bk_ev" style="pointer-events:all; background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: '+bwidth+'px; height: '+bwidth+'px;" src="' + Util.getImage(data[i+1].pic, 1) + '"></div>');
							var caption = $('<div class ="box bk_ev" style="width:'+(bwidth-20)+'px;height:'+(bheight-bwidth-20)+'px; pointer-events:all; padding: 10px; -webkit-box-align: center;">' + data[i+1].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i + 2) + ' of ' + data.length + '</div>');
							outframe.append(pic).append(caption);//.append($(btn_b_str));
						}else{
							outframe.append($(cover_page));
						}
						
						backpage.append(outframe);
					}else{
						backpage = $('<div class="backside  box vertical" style="background-color: white; overflow: hidden; position:absolute; width:'+bwidth+'px;height:'+bheight+'px; -webkit-transform: rotate3d(0, 1, 0, 180deg); -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');	
					}
					
					
					if(backpage!='')
					page.append(backpage);
					
					if(frontpage!='')
					page.append(frontpage);
					
					
					container.append(page);
					
					if(pic!=null){
					pic.find('img').data('height', bwidth);
					pic.css('height',bwidth);
					}
					if(fpic!=null){
					fpic.find('img').data('height', bwidth);
					fpic.css('height', bwidth);
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
						var bgImage = Util.getImage(bookData.pic, 1);
						var img = $('<img class="book_bg absolute fade_out show" src="' + bgImage + '" />');
						img.load(function() {

							$(container.find('.cover_book')[0]).parent().prepend(img);
							
							var h = bheight;
							var w = bwidth;
							
							img.height(h);
							img.css('left', -1 * (img.width() / 2 - w / 2) + 'px');	
						});	
						
						var img2 = $('<img class="book_bg absolute fade_out show" src="' + bgImage + '" />');
						img2.load(function() {

							$(container.find('.cover_book')[1]).parent().prepend(img2);
							
							var h = bheight;
							var w = bwidth;
							
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
				
		
				var ang_tmp = 0;
				var window_width = bwidth;
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
						var page_nav  = container.find('.page_nav').eq(index);
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
					if(x<maxdrag_pos_in_range||x>(bwidth-maxdrag_pos_in_range)){
						w = Math.ceil(window_width*.95);
					}else{
						w = Math.ceil(window_width*0.5);
					}
					
				}
				function betweenMoveTimer(x,maxdistance,time_ms){
					if(tempst_x!=null){
						
						if(state==0){
							if(tempst_x-x>=0){
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
					container.bind('mouseout', function(e) {
						if (e.button == 0) {
							e.preventDefault();
							var x = e.originalEvent.offsetX;

							if(x<=0||x>=bwidth)
							end(x);
						}
					});
				}
				
				
				var count = 0;
				container.find('.page_nav .pic_box img').load(function() {
					finish(count++);
				});
				
				 if(!Device.isMobile()){
					 $('body').append('<div data-id="next_btn" style="width: 100px;height: 100px;background: #CCC;font-size: 39px;position: absolute;text-align: center;line-height: 100px;opacity: 0.6; z-index: 1500;right: '+(15)+'px; bottom: '+(bheight-100)/2+'px;-webkit-border-radius: 50px;" >></div>');
					 $('body').append('<div data-id="prev_btn" style="width: 100px;height: 100px;background: #CCC;font-size: 39px;position: absolute;text-align: center;line-height: 100px;opacity: 0.6; z-index: 1500;left: '+(15)+'px; bottom: '+(bheight-100)/2+'px;-webkit-border-radius: 50px;" ><</div>');
					
					 $('body').find('[data-id=next_btn]').bind("click",function(){
						 startnextpage();
						 state =1;
						 dochangepage();
					 });
					 $('body').find('[data-id=prev_btn]').bind("click",function(){
						 startbackpage();
						 state =-1;	
						 dochangepage();
						 if(index==data.length){
								lockpage=true;
								container.find('.page_nav').eq(index)[0].style.webkitTransition=  duration+'ms ease-in-out';
								container.find('.page_nav').eq(index).css('-webkit-transform', 'rotate3d(0, 1, 0, 0deg)');	 
						 }
					 });
				 }
				 
				 
			}
		
		
	}
				$.ajax({
					url:SERVICE+'/getBookByUid.json',
					success: aftergetbook,
					error: function(xhr) {
						console.error('Internal Error: ' + xhr.responseText);
					},
					data: {bid:bid},
					cache:false,
					dataType: 'json'
				});
});