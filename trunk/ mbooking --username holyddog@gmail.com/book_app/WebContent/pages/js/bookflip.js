Page.Book = {
url: 'pages/html/blank.html',
init: function(params, container) {
    var self = this;
    Page.bodyShowLoading(container);
   
    if(/*window.navigator.onLine*/true){
		if(Account.bguide){
			$('.user_guide').tap(
				function(){
					$('.user_guide').fadeOut();
				}
			);
			Service.User.ViewGuide("bguide", Account.userId,
				function(){
					delete Account["bguide"];
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
    
    var closebefore_btn = container.find('[data-id=btn_cb]');
   
    closebefore_btn.find('span').attr('class', params.preview?"back":"cancel");
    
    closebefore_btn.tap(
			function(){
				Page.back();
			}
	);
    
    Service.Book.GetBookData(params.bid, params.uid, Account.userId, function(data) {
          self.load(container, data,params);
    });
    
    
},
LIMIT_PAGE:1,
reverseIndex:function(container){
	container.css('display','');
},
load: function(container, bookData,params) {
	var uid = (params && params.uid)? params.uid: Account.userId;
	var canEdit = true;
	if (uid != Account.userId||params.preview) {
		canEdit = false;
	}
	container.css('-webkit-transition','background-color 500ms linear');	
	container.css('transition','background-color 500ms linear');	

	container.css('background','#EEEEEE');
    var window_width = $(window).width();
	var index = 0;
    var data = bookData.pages;
    data.push({});
    if (data.length) {
        for (var i = data.length - 1; i > -3; i--) {
            var f_ev_str = 'f_ev';
            if(i==-2){
                f_ev_str='';
            }
            
            var page;
            if(i==-1)
            {
                page =  $('<div class="page_nav fill_dock box vertical" style="z-index:1; pointer-events: none; visibility: hidden; -webkit-transform-origin: left center; left: 50%; -webkit-transform-style: preserve-3d;" -webkit-transform: rotate3d(0, 1, 0, -1deg)></div>'); 
            }
            else{
                page =  $('<div class="page_nav fill_dock box vertical" style="pointer-events: none; visibility: hidden; -webkit-transform-origin: left center; left: 50%; -webkit-transform-style: preserve-3d; -webkit-transform: rotate3d(0, 1, 0, -1deg)"></div>');
            }
            
            var frontpage='';
            var fpic=null;
            
            var backpage='';
            var pic=null;
            
            var tbar_btn = '';
            
            var tbar_btn_back = '';
            
            if(!params.preview){
                tbar_btn =  '<a data-id="btn_l" class="btn" style="position: relative; float: right; pointer-events:all;"><span style="background-color: #fff;" class="like"></span></a>'
                	+'<a data-id="btn_f" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="star"style="background-color:#fff;"></span></a>'
                    +'<a data-id="btn_c" class="btn" style="position: relative; float: right; pointer-events:all;"><span style="background-color: #fff;" class="comment"></span></a>'
                    +'<a data-id="btn_s" class="btn" style="position: relative; float: right; pointer-events:all;"><span style="background-color: #fff;" class="share"></span></a> ';
                
                tbar_btn_bp =  '<a data-id="btn_l" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="like"style="background-color:#FBFBFB;"></span></a>'
                	+'<a data-id="btn_f" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="star"style="background-color:#FBFBFB;"></span></a>'
                    +'<a data-id="btn_c" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="comment"style="background-color:#FBFBFB;"></span></a>'
                    +'<a data-id="btn_s" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="share"style="background-color:#FBFBFB;"></span></a> ';
            
            }
            else{
            	tbar_btn_bp='<div class="tbar" style="height: 0px; pointer-events:none; "><div class="title"></div></div>';
            }
           
            
            var cover_page = '<div class="tbar_bg cover_book"></div>'
                +'<div class="grad_overlay fill_dock hid_loading"></div>'
                +'<div class="tbar" style="height: 0px; pointer-events:none; z-index:1001">	'
                +'<a data-id="btn_b" class="btn" style="left: 0; pointer-events:all;"><span style="z-index: 100; background-color: #fff;" class="'+((params.preview)?"back":"cancel")+'"></span></a>'
                +'<div class="title"></div>'
                +tbar_btn
                +'</div>'
                +'<div class="content gray flex1 box vertical '+f_ev_str+'" style="pointer-events:all;">'
                +'	<div class="first_cover hid_loading">'
                +'      <div class="box horizontal">'
    			+'          <h1 class="btitle flex1"></h1>'
    			+       (canEdit?'<div class="edit_book mask_icon" style="pointer-events:all;"></div>':'')
                +'      </div>'
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
                +'				<div class="clabel fleft">'
                +'					<div class="icon mask_icon like"></div>'
                +'					<div class="lcount text">0</div>'
                +'				</div>'
                +'				<div class="clabel fleft">'
                +'					<div class="icon mask_icon comment"></div>'
                +'					<div class="ccount text">0</div>'
                +'				</div>'
                +'				<span class="fright pcount">0</span>'
                +'			</div>'
                +'		</div>'
                +'	</div>'
                +'</div>	';
            
            var back_page =
                '<div class="tbar" style="background: #131313;pointer-events:none;">	'
                +'<a data-id="btn_b" class="btn" style="left: 0; pointer-events:all;"><span class="'+((params.preview)?"back":"cancel")+'"style="background-color:#FBFBFB;"></span></a>'
                +'<div class="title"></div>'
                +tbar_btn_bp
                +'</div>'
                +'<div class=" flex1 box vertical '+f_ev_str+'" style="background:#131313; pointer-events:all;">'
                +'	<div class="flex1" style=" background: url('+"'images/thank1.jpg'"+'); background-position: center; background-size: 100% auto; background-repeat: no-repeat;"></div>'
                +'		<div class="bottom_info">'
                +'			<div class="text_bar flow_hidden" style="text-align: center;padding: 30px;">'
                +'				<span style="font-family:'+"'Roboto'"+ ';">Credit by : '+bookData.author.dname+'</span>'
                +'			</div>'
                +'		</div>'
                +'</div>	';
            
          
            
            var title_bar_left =$('<div class="tbar" style="height: 0px; pointer-events:none; z-index:1001"><div class="title"></div>'
                    +'<a data-id="btn_b" class="btn" style="left: 0; pointer-events:all;"><span style="background-color: #fff;" class="'+((params.preview)?"back":"cancel")+'"></span></a>'
                    +((!params.preview)?'<a data-id="btn_s" class="btn" style="position: relative; float: right; pointer-events:all;margin-right:150px;"><span style="background-color: #fff;" class="share"></span></a> ':'')
                    +'</div>');
            
            var title_bar_right =$('<div class="tbar" style="height: 0px; pointer-events:none; z-index:1001"><div class="title"></div>'
                    +'<a data-id="btn_l" class="btn" style="position: relative; float: right; pointer-events:all;"><span style="background-color: #fff;" class="like"></span></a>'
                    +'<a data-id="btn_f" class="btn" style="position: relative; float: right; pointer-events:all;"><span class="star"style="background-color:#fff;"></span></a>'
                    +'<a data-id="btn_c" class="btn" style="position: relative; float: right; pointer-events:all;"><span style="background-color: #fff;" class="comment"></span></a>'
                    +((!params.preview)?'<a data-id="btn_s" class="btn" style="position: relative; float: right; pointer-events:all;margin-right:150px;"><span style="background-color: #fff;" class="share"></span></a> ':'')
                    +'</div>');
         
            var shadowf =  $('<div class="fill_dock" data-id="page_shadow" style="opacity:0; background:black; z-index:1"></div>');
            var shadowb =  $('<div class="fill_dock" data-id="page_shadow" style="opacity:0; background:black; z-index:1"></div>');
            
            if (params.preview) {
                title_bar_right=$('<div class="tbar" style="height: 0px; pointer-events:none; "><div class="title"></div></div>');

            }
            
            function refToStr(ref){
				if (ref) {
					if (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(.*)$/ig.test(ref)) {
						var url = ref.split(/\s+/g)[0];
						var newUrl = url.replace(/^(https?:\/\/)?(www.)?/ig, '');
						if (newUrl.indexOf('/') > -1) {
							newUrl = newUrl.substring(0, newUrl.indexOf('/'));
						}
						return '<div class="ext_url"><a target="_blank" class="block" href="' + url + '">' + newUrl + '</a></div>';
					}
					else {
						return ref;
					}
				}else{
					return '';
				}	
			}
            
            if( i != - 2){
                
                frontpage = $('<div class="frontside fill_dock box vertical" style="background-color: white; overflow: hidden; width:50%; position:absolute; -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');
                var foutframe = $('<div class="fill_dock box vertical" style="width:200%; position:absolute;"></div>');
                var finframe = $('<div class="fill_dock box vertical" style="position:absolute; left:-100%;"></div>');
                if( i > - 1&&i<data.length-1){
               	fpic = $('<div class="pic_box relative f_ev" data-id="pic_box'+(i)+'"  style="background-color: #EEEEEE; overflow: hidden;width: '+window_width+'px; height: '+window_width+'px;"><img  data-id="'+i+'" style="visibility:hidden;opacity:0;transition:opacity 0.25s linear; position: absolute; width: 100%; height: 100%;"></div>');
//                    var fcaption = $('<div class="flex1 box f_ev center_middle"  data-id="txt'+(i)+'"  style="visibility:hidden;opacity:0;transition:opacity 0.25s linear; padding: 10px; -webkit-box-align: center;text-alig">' + data[i].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i+1) + ' of ' + (data.length-1) + '</div>');
                    
               	
               	var fcaption = $(
               			'<div class="flex1 box f_ev center_middle"  data-id="txt'+(i)+'"  style="visibility:hidden;opacity:0;transition:opacity 0.25s linear; padding: 10px; -webkit-box-align: center;">' 
               			+ data[i].caption 
               			+ '</div>'
               			+'<div class="pline box horizontal" style="pointer-events:all;"><div class="ref flex1">' + (refToStr(data[i].ref)) + '</div>'
               			+'<div class="pnum" style="text-align: right;padding-left: 10px;">' 
               			+ (i+1) + ' of ' + (data.length-1) 
               			+ '</div>'
               			+ '</div>');
               	
               	
               		foutframe.append(shadowf).append(title_bar_right).append(fpic).append(fcaption);
                }
                else if(i==-1){
                    
                    foutframe.append(shadowf).append($(cover_page));
                    
                }         
                else if(i==data.length-1){
                	 foutframe.append(shadowf).append($(back_page));
                }
            
                finframe.append(foutframe);
                frontpage.append(finframe);
                
            }
            
         
                //back 2 pages
                backpage = $('<div class="backside fill_dock box vertical" style="background-color: white; overflow: hidden; width:50%; position:absolute; -webkit-transform:  rotate3d(0, 1, 0, 180deg); -webkit-backface-visibility:hidden;-webkit-transform-style: preserve-3d;"></div>');
                var outframe = $('<div class="fill_dock box vertical" style="width:200%; position:absolute;"></div>');
                
                if( i !=-2&&i<data.length-2){
                	pic = $('<div class="pic_box relative bk_ev"  data-id="pic_box'+(i+1)+'" style=" background-color: #EEEEEE; overflow: hidden; width: '+window_width+'px; height: '+window_width+'px;"><img  data-id="'+(i+1)+'" style="visibility:hidden;opacity:0;transition:opacity 0.25s linear; position: absolute; width: 100%; height: 100%;"></div>');
                  
//                	var caption = $('<div class ="flex1 box bk_ev center_middle" data-id="txt'+(i+1)+'" style="visibility:hidden;opacity:0;transition:opacity 0.25s linear; padding: 10px; -webkit-box-align: center;">' + data[i+1].caption + '</div><div style="line-height: 15px; padding: 0 10px 10px; font-size: 80%; text-align: right;">' + (i + 2) + ' of ' + (data.length-1) + '</div>');
                    
                	var caption = $(
                   			'<div class="flex1 box f_ev center_middle"  data-id="txt'+(i+1)+'"  style="visibility:hidden;opacity:0;transition:opacity 0.25s linear; padding: 10px; -webkit-box-align: center;">' 
                   			+ data[i+1].caption 
                   			+ '</div>'
                   			+'<div class="pline box horizontal" style="pointer-events:all;"><div class="ref flex1">' + (refToStr(data[i+1].ref)) + '</div>'
                   			+'<div class="pnum" style="text-align: right;padding-left: 10px;">' 
                   			+ (i+2) + ' of ' + (data.length-1) 
                   			+ '</div>'
                   			+ '</div>');
                	
                	outframe.append(shadowb).append(title_bar_left).append(pic).append(caption);//.append($(btn_b_str));
                }
                else if(i==data.length-2){
                	outframe.append(shadowb).append($(back_page));
                }
                else if( i ==-2){
                    outframe.append(shadowb).append($(cover_page));
                }
                backpage.append(outframe);
            
            
            
            
            if(backpage!='')
                page.append(backpage);
            
            if(frontpage!='')
                page.append(frontpage);
            
            
            container.append(page);
            
        }
   
        
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
        /*Settings Btn*/   
        
        // set toolbar buttons
            var btnBack = $('[data-id=btn_b]');
        
            btnBack.tap(function() {
                        Page.back();
                        });

            var btnComment = $('[data-id=btn_c]');
            btnComment.tap(function() {
                           Page.open('Comments', true, { bid: params.bid });
                           container.css('display','none');
            });
            var btnShare = $('[data-id=btn_s]');
            btnShare.tap(function(success) {
                         
//            	Page.open('Share', true, { bid: params.bid });
//                container.css('display','none');
                 var url = Config.WEB_BOOK_URL + '/b/' + params.key;
                 if (Device.PhoneGap.isReady) {
                    window.plugins.socialsharing.share(null, null, null, url);
                 }
                 else {
                    window.open(url,'_blank','location=yes');
                 }
            });
        
        	var btnLike = $('[data-id=btn_l]');
        	
        	if (bookData.liked) {
				btnLike.addClass('liked');				
			}
        	
    		btnLike.tap(function() {
    			if (!btnLike.hasClass('liked')) {
    				btnLike.addClass('liked');			
    				Service.Book.LikeBook(params.bid, Account.userId, true, function(data) {
    					var likes = parseInt(container.find('.text_bar .lcount').html())+1;
    					container.find('.text_bar .lcount').text(likes);
    				});				
    			}
    			else {
    				btnLike.removeClass('liked');			
    				Service.Book.LikeBook(params.bid, Account.userId, false, function(data) {
    					
    					var likes = parseInt(container.find('.text_bar .lcount').html())-1;
    					container.find('.text_bar .lcount').text(likes);
    				});				
    			}
    		});
            
    		var btnFav = container.find('[data-id=btn_f]');
    		if (bookData.faved) {
				btnFav.addClass('stared');
			}
    		btnFav.tap(function() {
    			if (!btnFav.hasClass('stared')) {
    				btnFav.addClass('stared');			
    				Service.Book.FavBook(params.bid, Account.userId, true, function(data) {});				
    			}
    			else {
    				btnFav.removeClass('stared');			
    				Service.Book.FavBook(params.bid, Account.userId, false, function(data) {});				
    			}
    		});
    		
        
        var btnSetting = container.find('.edit_book');
        btnSetting.tap(function() {
                       Page.open('EditBook', true, { bid: params.bid,frombookpage:true });
                       container.css('display','none');
                       });

        $('.pline .ref').tap(function() {
                             var ref = ($(this).find('.ext_url').children()).attr('href');
                             if(ref)
                             window.open(ref,'_blank','location=yes');
                             });

        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
        var os=Config.OS;
		
        var ang_tmp = 0;
        var w = window_width;
        var timer = null;
        var tempst_x = null;
        var startx = null;
        var isdrag=false;
        var distance = 0;
        var state=0;//1:next, -1:back
        var zcount=0;
        var lockpage=false;
        var duration=250;//ms

      var maxdis		= 20;
      var maxdis_time = 10;
                var locktimer = null;
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

        function dodrag(x){
        	var angle=null;
        	var page_nav = container.find('.page_nav').eq(index);
        	if(distance>=0&&distance<=w){
        		var cdx = (1 - (2*distance)/w );
	            
        		if(state ==-1)
	                cdx = cdx*-1;
	            
	            angle =Math.floor(Math.acos(cdx)* (180 / Math.PI))*-1;
	            
	            	
	            if(angle !=ang_tmp){       	
	            	ang_tmp = angle;
	            	page_nav[0].style.webkitTransition=  '';
	                
	                if(ang_tmp<=-170){
	                	page_nav[0].style.webkitTransition=  '200ms ease-in-out';
	                    ang_tmp = -180;
	                    lockpage=false;
	                }
	                
	                if(ang_tmp>=-10){
//	                	console.log("ang_tmp!!	 "+ang_tmp);
	                	page_nav[0].style.webkitTransition=  '200ms ease-in-out';
	                    ang_tmp = -1;
	                    lockpage=false;
	               }
//	                
	                page_nav[0].style.webkitTransform = "perspective(100em) rotate3d(0, 1, 0,"+ang_tmp+"deg)";
	            }
        	}else{
        		
        		
        		    if((ang_tmp<=-90)){
		            	page_nav[0].style.webkitTransition=  '200ms ease-in-out';
		                ang_tmp = -180;
		                page_nav[0].style.webkitTransform = "perspective(100em) rotate3d(0, 1, 0,"+ang_tmp+"deg)";
		                lockpage=false;
		            }
		            
	                else{
//	                	console.log(ang_tmp);	
		            	page_nav[0].style.webkitTransition=  '200ms ease-in-out';
		            	ang_tmp = -1;
		            	page_nav[0].style.webkitTransform = "perspective(100em) rotate3d(0, 0, 0,"+ang_tmp+"deg)";
		            	startx = x;
		            	lockpage=false;
		            }
        		    if((state==1&&ang_tmp<=-90)||(state==-1&&ang_tmp>-90)){
        		        startx = x+w;
     	            }else if((state==-1&&ang_tmp<=-90)||(state==1&&ang_tmp>-90)){
     	               startx = x;
        	        }
        		

        	}
        	
        }
        
        function dochangepage(x){
            clearTimeout(locktimer);
            locktimer = setTimeout(function(){
                                   lockpage=false;
                                   }, duration+25);
            
        	var page_nav = container.find('.page_nav').eq(index);

            function flipnext(){
                lockpage=true;
                page_nav[0].style.webkitTransition=  duration+'ms ease-in-out';
                page_nav[0].style.webkitTransform = "perspective(100em) rotate3d(0, 1, 0, -180deg)";    
            }
            
            function flipback(){
                lockpage=true;
                page_nav[0].style.webkitTransition=  duration+'ms ease-in-out';
                page_nav[0].style.webkitTransform = "perspective(100em) rotate3d(0, 1, 0, -1deg)";
            }
            
            if(isdrag){
                if(state==1){
                    if(x-tempst_x>0){
                    	if(index>0){
                    		flipnext();
                    	}
                    		endnextpage();	
                    }
                    else if(x-tempst_x==0){
                        if(ang_tmp<=-90){
                            if(index>0){
                            	flipnext();
                            }
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
                    if(x-tempst_x>0){
                        flipnext();
                        cancelbackpage();	
                    }
                    else if(x-tempst_x==0){
                        if(ang_tmp<=-90){
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
                	//Test
                	setTimeout(function(){
                	if(index>0)
                        flipnext();
                    	endnextpage();		
                    },10);
                
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
//            startx = x;
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
                
                
                if((tempst_x-x>maxdistance||tempst_x-x<-maxdistance)){
                	clearTimeout (timer);	
                    timer=null;
                	isdrag =false;
                	dochangepage();  
                    tempst_x=null;	
                    startx =null;
                    
                   	
                }else{
                    distance = startx-x;
                    if(state ==-1){
                        distance = distance*-1;
                    }
                    
                    if((!(index==data.length&&state ==-1&&!sndpage))&&!(index==0&&state ==1)){	
                       if(os!='Android')
                    	dodrag(x);
                    }
                }
            }  
        }
        function endTimer(){
            clearTimeout(timer);	
            
        }
        //////////////////////////////
        
        
        function start(x){
        	 if(!lockpage){
	            state = 0;
	            startx = x;
	            beginTimer(x);
        	 }
        }
        
        function move(x){
            if(!lockpage){
                betweenMoveTimer(x,maxdis,maxdis_time);
            }
        }
        
        function end(x){
            if(!lockpage){
                endTimer();
            	dochangepage(x);
            }
        }
        
        function bindSwipe(){
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
                           var x = e.originalEvent.pageX;
                           start(x);
                           }
                           });
        	container.bind('mousemove', function(e) {
                           if(e.button == 0){
                           //if(!stop&&e.button == 0){
                           e.preventDefault();
                           var x = e.originalEvent.pageX;
                           move(x);
                           }
                           });
        	container.bind('mouseup', function(e) {
                           if (e.button == 0) {
                           e.preventDefault();
                           var x = e.originalEvent.pageX;
                           end(x);
                           }
                           });
        }
       }
      function loadcover(callback){  
	      var bgImage = Util.getImage(bookData.pic, 1);
	      var img = $('<img class="book_bg absolute fade_out show" src="' + bgImage + '" />');  
	      var img2 = $('<img class="book_bg absolute fade_out show" src="' + bgImage + '" />');
	      img.load(function() {

	    	  	   $(container.find('.cover_book')[0]).parent().prepend(img);
	               $(container.find('.cover_book')[1]).parent().prepend(img2);
	                            
	               var h = $(window).innerHeight();
	               var w = window_width;
	               
	               img.height(h);
	               img2.height(h);
	               img.css('left', -1 * (img.width() / 2 - w / 2) + 'px');
	               img2.css('left', -1 * (img.width() / 2 - w / 2) + 'px'); 
	               callback();
	      });
	   
	      
	  }
      
      

      function firstLoad(){
    		Page.bodyHideLoading(container);
    		container.find('[data-id=btn_cb]').hide();
			var content = container.find('.content');
			// show panel
			content.removeClass('gray').addClass('no_color');
			container.find('.hid_loading').removeClass('hid_loading');

			for ( var i = data.length - 2; i >= 0; i--) {
				page = container.find('.page_nav').eq(i);
				if (page) {
					page.addClass('no_display');
				}
			}

			container.find('.page_nav').css('display','-webkit-box').css('visibility', 'visible');
			size = index;
			container.find('.page_nav').eq(data.length + 1)[0].style.webkitTransform = "rotate3d(0, 1, 0, -180deg)";
			index = data.length;

			container.find('.btitle').text(bookData.title);
			container.find('.bdesc').text(bookData.desc);
			container.find('.author_info .name').text(bookData.author.dname);
			if (bookData.author.pic) {
				container.find('.author_info img').attr('src', /* Config.FILE_URL + */Util.getImage(bookData.author.pic, 3));
			}
			container.find('.text_bar .fright').text(bookData.pcount);
			if (bookData.lcount) content.find('.text_bar .lcount').text(bookData.lcount);
			if (bookData.ccount) content.find('.text_bar .ccount').text(bookData.ccount);
			
			
			bindSwipe();
      }
      var count = 0;
      function loadpagepic(){
    	  var pic =   container.find('[data-id='+count+']');
    	  pic.attr("src", Util.getImage(data[count].pic, 1));
    	  $(pic[0]).load(function() {
    		  Page.bodyHideLoading($(container.find('[data-id=pic_box'+count+']')[0]));
    		  Page.bodyHideLoading($(container.find('[data-id=pic_box'+count+']')[1]));
    		  
    		  pic.css("visibility",'');
    		  pic.css("opacity",'1');
    		  container.find('[data-id=txt'+count+']').css("visibility",'');
    		  container.find('[data-id=txt'+count+']').css("opacity",'1');
				 if (count < data.length-1) {	
					count++;
						
						loadpagepic();	

					
					if (count == 1) {
						firstLoad();
					}
				}
    	  });
    	  
    	  
      }
      
      loadcover(function(){
//    	  Page.bodyShowLoading();
    	  container.find('.pic_box').each(function( index ) {
    		  Page.bodyShowLoading($(container.find('.pic_box')[index]));
    		});
    	  loadpagepic();
     });
      
      
      
      
    }
}
};