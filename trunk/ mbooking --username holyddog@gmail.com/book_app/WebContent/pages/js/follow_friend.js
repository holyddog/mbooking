Page.FollowFriend = {
	url: 'pages/html/follow_friend.html',
	init: function(params, container) {
		var self = this;
		container.find('[data-id=btn_n]').hide();
		// set toolbar buttons

        if(params.fromSignUp){
            container.find('[data-id=btn_b]').hide();
            container.find('.tbar .title').css('left','15px');
            container.find('.fbbtn').tap(function() {
                Page.FollowFriend.load(container,params);
            });
            
            container.find('.skipbtn').tap(function() {
                Page.open('Explore');
            });
        }else{
            if(Account.fbObject&&Account.fbObject!={}){
                container.find('.findfriend_box').hide();
                Page.bodyShowLoading(container.find('.content'), true);
                Page.FollowFriend.load(container,params);
            }else{
                container.find('.fbbtn').tap(
                    function() {
                        Page.FollowFriend.load(container,params);
                    });
            }
            container.find('.skipbtn').hide();
            container.find('[data-id=btn_b]').tap(function() {
                Page.back();
            });
		}
       
	},
	
	load: function(container,params) {
		var self = this;
        var list = container.find('.content');

		var findfriend_box = container.find('.findfriend_box');
        var fbbtn = container.find('.fbbtn');
//		                if(!Account.userId)
//                            Account.userId = 1;
//		alert(Account.userId);
        fbbtn.hide();
        findfriend_box.hide();
        Page.bodyShowLoading(list);
        
//        var while_load = setTimeout(function(){
//                                    fbbtn.show();
//                                    findfriend_box.show();
//                                    Page.bodyHideLoading(list, true);
//        },5500);
        
		Device.PhoneGap.getFacebookFreiends(
            function(fbdata) {
               // alert(fbdata.fbid);
//                clearTimeout(while_load);9999
                if(fbdata.fbid){
                                   
                    Service.User.FindFBFriend(Account.userId,fbdata.fbid,function(data){
                        if(data.length!=0){
                        	
                        	var freindDiv = document.createElement('div');
                    		freindDiv.className = 'friend_item box horizontal';
                    		freindDiv.style.backgroundColor= "#eee";
                    		
                    		var fnumberDiv = document.createElement('div');
                    		fnumberDiv.className = 'friendnum flex1 box';
                    		fnumberDiv.innerHTML = '<div class="num">'+data.length+'</div> Friends on In Story';
                    		
                    		var follbtn = document.createElement('div');
                			follbtn.className = 'follallbtn';
                			follbtn.innerHTML = "Follow All";
                			freindDiv.appendChild(fnumberDiv);
                			freindDiv.appendChild(follbtn);
                    		
                        	list.append(freindDiv);
                            var had_follall=true;
                                              
                            for (var i = 0; i < data.length; i++) {
                                var c = data[i];
                                list.append(self.createItem(c));
                                if(!data[i].isFollow){
                                    had_follall = false;
                                }
                            }

                            if(had_follall){
                                container.find('.follallbtn').hide();
                            }
                            
                            container.find('.follallbtn').bind('click',function(){
                                $(this).hide();
                               var foll="";
                               var notfoll_items = container.find('.follbtn').not('.following');
                               notfoll_items.each(function(){
                                    foll+=$(this).attr('data-id')+":";
                               });
                               Service.Book.FollowMulti(foll, Account.userId, function() {
//                                    alert('Succuess');
                                    notfoll_items.addClass('following');
                                    notfoll_items.html('Following');
                               });
                            });
                                              
                            list.find('.follbtn').bind('click', function() {
                                var item = $(this);
            //                    alert(item.attr('data-id'));
                                if(item.hasClass('following')){
                                    Service.Book.UnFollowAuthor(item.attr('data-id'), Account.userId, function() {
                                        item.removeClass('following');
                                        item.html('+ Follow');
                                        Account.following = data.following;
                                        localStorage.setItem("u", JSON.stringify(Account));
                                        container.find('.follallbtn').show();
                                    });
                                }else{
                                    Service.Book.FollowAuthor(item.attr('data-id'), Account.userId, function() {
                                        item.addClass('following');
                                        item.html('Following');
                                        Account.following = data.following;
                                        localStorage.setItem("u", JSON.stringify(Account));
                                        
                                        var count = 0;
                                        container.find('.following').each(function(){
                                            count++;
                                        });
                                        
                                        if(count==data.length){
                                            container.find('.follallbtn').hide();
                                        }
                                    
                                    });
                                }
                            });
                            
                            if(params.fromSignUp){
                                container.find('[data-id=btn_n]').show();
                                container.find('[data-id=btn_n]').tap(function() {
                                    Page.open('Explore');
                                });
                            }
                        }
                        else{
                            findfriend_box.show();
                            container.find('.nofbfrendlb').show();
                        }
                        Page.bodyHideLoading(list);
    //                    alert(JSON.stringify(data));
                    
                });
                }else{
                    Page.bodyHideLoading(list);
                    fbbtn.show();
                    findfriend_box.show();
                }
		});
	},
	
	createItem: function(user) {
//	var str= 	'<div class="friend_item box horizontal">'
//			+	'	<div class="uimage">'
//			+	'		<img src="temp/u1.jpg" />'
//			+	'	</div>'
//			+	'	<div class="msg flex1">'
//			+	'		<div class="name">'
//			+	'			sTeerapat Chan'
//			+	'		</div>'
//			+	'		<div class="fbname">@m7814</div>'
//			+	'	</div>'
//			+	'	<div class="follbtn">'
//			+	' 		Follow'	
//			+	'	</div>'
//			+	'</div>';

		var freindDiv = document.createElement('div');
		freindDiv.className = 'friend_item box horizontal';
		
		var uimage = document.createElement('div');
		uimage.className = 'uimage';
		var img = document.createElement('img');
		img.src = (user.pic)? Util.getImage(user.pic, 3): 'images/user.jpg';
		uimage.appendChild(img);
		
		var msg = document.createElement('div');
		msg.className = 'msg flex1';
		var name = document.createElement('div');
		name.className = 'name';
		name.innerHTML = user.dname;
		var fbname = document.createElement('div');
		fbname.className = 'fbname';
		fbname.innerHTML = user.fbobj.dname;
		msg.appendChild(name);
		msg.appendChild(fbname);
	
		var follbtn = document.createElement('div');
		
		var att=document.createAttribute("data-id");
		att.value=user.uid;
		if(!user.isFollow){
            follbtn.innerHTML = '+ Follow';
            follbtn.className = 'follbtn';
        }else{
            follbtn.innerHTML = 'Following';
            follbtn.className = 'follbtn following';
        }
        
		freindDiv.appendChild(uimage);
		freindDiv.appendChild(msg);
		freindDiv.appendChild(follbtn);
		follbtn.setAttributeNode(att);
		
		return freindDiv;			
	}
};