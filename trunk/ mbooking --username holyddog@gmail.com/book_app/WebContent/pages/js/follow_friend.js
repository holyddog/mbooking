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
        Page.bodyShowLoading(list, true);
        
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
                            for (var i = 0; i < data.length; i++) {
                                var c = data[i];
                                list.append(self.createItem(c));
                            }

                            list.find('.follbtn').bind('click', function() {
                                var item = $(this);
            //                    alert(item.attr('data-id'));
                                if(item.hasClass('following')){
                                    Service.Book.UnFollowAuthor(item.attr('data-id'), Account.userId, function() {
                                        item.removeClass('following');
                                        item.html('Follow');
                                    });
                                }else{
                                    Service.Book.FollowAuthor(item.attr('data-id'), Account.userId, function() {
                                        item.addClass('following');
                                        item.html('Following');
                                    });
                                }
                            });
                            
                            if(params.fromSignUp){
                                container.find('[data-id=btn_n]').show();
                                container.find('[data-id=btn_n]').tap(function() {
                                    Page.open('Profile');
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

		var notfDiv = document.createElement('div');
		notfDiv.className = 'friend_item box horizontal';
		
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
            follbtn.innerHTML = 'Follow';
            follbtn.className = 'follbtn';
        }else{
            follbtn.innerHTML = 'Following';
            follbtn.className = 'follbtn following';
        }
        
		notfDiv.appendChild(uimage);
		notfDiv.appendChild(msg);
		notfDiv.appendChild(follbtn);
		follbtn.setAttributeNode(att);
		
		return notfDiv;			
	}
};