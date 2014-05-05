<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html 
	xmlns="http://www.w3.org/1999/xhtml"
    xmlns:ui="http://java.sun.com/jsf/facelets"
    xmlns:h="http://java.sun.com/jsf/html"
    xmlns:t="http://myfaces.apache.org/tomahawk"
    xmlns:f="http://java.sun.com/jsf/core">     
<head>
	<title>#{initParam['appName']}</title>
	
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	
	<script type="text/javascript">
		var Context = {
			root: "#{initParam['root']}",
			file: "#{initParam['file']}"
		};
	</script>
	
	<link rel="stylesheet" href="#{initParam['root']}/res/css/default.css" />
	<link rel="stylesheet" href="#{initParam['root']}/res/css/style.css" />
	<link rel="stylesheet" href="#{initParam['root']}/res/css/pages.css" />
	
	<script type="text/javascript" src="#{initParam['root']}/res/lib/jquery-1.10.2.min.js"></script>
</head>	
	<body>	
		<f:view>
			<f:subview id="book_view" rendered="#{bookView != null}">
				<script type="text/javascript">
				bid = window.location.search.split("?bid=")[1];
				function aftergetbook(bookData){
				var container = $('body');
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
							return "#{initParam['book_dev_files']}" + file.substring(0, file.lastIndexOf('.')) + suffix + file.substring(file.lastIndexOf('.'), file.length);
						}
					};
				
				
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
								 page =  $('<div class="page_nav fill_dock box vertical" style="z-index:500; pointer-events: none; visibility: hidden; -webkit-transform-origin: left center; left: 50%; -webkit-transform-style: preserve-3d;"></div>');					
								
								
							}
							else{	
							
							   page =  $('<div class="page_nav fill_dock box vertical" style="pointer-events: none; visibility: hidden; -webkit-transform-origin: left center; left: 50%; -webkit-transform-style: preserve-3d;"></div>');					
							}
							
							var frontpage='';
							var fpic=null;
							
							var backpage='';
							var pic=null;
							
				
							var cover_page = '<div class="tbar_bg trans cover_book"></div>'
								+'<div class="grad_overlay fill_dock hid_loading"></div>'
								+'<div class="tbar" style="pointer-events:none;">	'
								+'<a data-id="btn_b" class="btn" style="left: 0; pointer-events:all;"><span class="cancel"></span></a>'
								+'<div class="title"></div>'
								+'<a data-id="btn_e" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="edit"></span></a>	'
								+'<a data-id="btn_s" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="share"></span></a>	'
								+'<a data-id="btn_c" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="comment"></span></a> '
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
										
							var title_bar_left =$('<div class="tbar" style="pointer-events:none;"><div class="title"></div>'
								+'<a data-id="btn_b" class="btn" style="left: 0; pointer-events:all;"><span class="cancel"></span></a>'
								+'</div>');
							
							var title_bar_right =$('<div class="tbar" style="pointer-events:none;"><div class="title"></div>'
									+'<a data-id="btn_e" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="edit"></span></a>	'
									+'<a data-id="btn_s" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="share"></span></a>	'
									+'<a data-id="btn_c" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="comment"></span></a> '
									+'</div>');
							
							if( i != - 2){
											
								frontpage = $('<div class="frontside fill_dock box vertical" style="background-color: white; overflow: hidden; width:50%; position:absolute; -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');
								var foutframe = $('<div class="fill_dock box vertical" style="width:200%; position:absolute;"></div>');
								var finframe = $('<div class="fill_dock box vertical" style="position:absolute; left:-100%;"></div>');
								if( i > - 1){
									fpic = $('<div class="pic_box relative f_ev" style="pointer-events:all; background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: 100%; height: 100%;" src="' + Util.getImage(data[i].pic, 1) + '"/></div>');
									var fcaption = $('<div class="flex1 box f_ev" style="pointer-events:all; padding: 10px; -webkit-box-align: center;">' + data[i].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i+1) + ' of ' + data.length + '</div>');
									foutframe.append(title_bar_right).append(fpic).append(fcaption);
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
									pic = $('<div class="pic_box relative bk_ev" style="pointer-events:all; background-color: #ccc; overflow: hidden;"><img style="position: absolute; width: 100%; height: 100%;" src="' + Util.getImage(data[i+1].pic, 1) + '"/></div>');
									var caption = $('<div class ="flex1 box bk_ev" style="pointer-events:all; padding: 10px; -webkit-box-align: center;">' + data[i+1].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i + 2) + ' of ' + data.length + '</div>');
									outframe.append(title_bar_left).append(pic).append(caption);//.append($(btn_b_str));
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
							
							if(pic!=null){
							pic.find('img').data('height', pic.height());
							pic.css('height', pic.width());
							}
							if(fpic!=null){
							fpic.find('img').data('height', fpic.height());
							fpic.css('height', fpic.width());
							}
							
								if(i==-2){
									// set toolbar buttons
									var btnBack = container.find('[data-id=btn_b]'); 
									btnBack.tap(function() {
										Page.back();
									});
								}
								if(i==-1){
									var btnComment = container.find('[data-id=btn_c]');
									btnComment.tap(function() {
										Page.open('Comments', true, { bid: params.bid });
										
									});
									var btnShare = container.find('[data-id=btn_s]');
									btnShare.tap(function() {
										alert('share');
									});	
									var btnSetting = container.find('[data-id=btn_e]');
									btnSetting.tap(function() {
										Page.open('EditBook', true, { bid: params.bid });
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
								var bgImage = Util.getImage(bookData.pic, 1);
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
							container.find('.author_info img').attr('src', Util.getImage(bookData.author.pic, Config.FILE_SIZE.SQUARE));
						}
						container.find('.text_bar .fright').text(bookData.pcount + ' Page' + ((bookData.pcount > 1)? 's': ''));
						*/
									
						
						
				
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
							if(index!=data.length) {	
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
									if (!(index+2>data.length+1) )
										if(two_step_prev_nav)
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
								if((index-2>-1){{
									if(two_step_next_nav)
									two_step_next_nav.addClass('no_display');		
								}
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
							
//							console.log("cdx "+ cdx );
//							console.log("distance "+distance);
//							console.log("w  "+w);
							
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
							finish(count++);
						});
					}
					
				
				
				
				}
				$.ajax({
					url:"#{initParam['service']}"+'/getBookByUid.json',
					success: aftergetbook,
					error: function(xhr) {
						console.error('Internal Error: ' + xhr.responseText);
					},
					data: {bid:bid},
					cache:false,
					dataType: 'json'
				});
				
				</script>
			</f:subview>
			<f:subview id="no_book" rendered="#{bookView.book == null}">
				<div>No Book</div>
			</f:subview>
		</f:view>
	</body>
</html>