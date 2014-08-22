Page.About = {
	url: 'pages/html/about.html',
	init: function(params, container) {
		var self = this;
		container.find('[data-id=btn_b]').tap(function() {
            Page.back();
        });
        container.find('[data-id=terms]').click(function() {
//			Page.open('TermsOfUse', true);
			window.open("http://www.instory.me/tos");
		});
        
        var vcurrent ="";
        var vlast = localStorage.getItem("ver");
        
        if(Config.OS_Int ==1)
            vcurrent = Config.IOS_VERSION;
        else
            vcurrent = Config.ANDROID_VERSION;
        
        if(vlast!=vcurrent){
            container.find('.lst_ver_lb').addClass('not_update');
        }
        
        container.find('.cur_ver_lb').html(vcurrent);
        container.find('.lst_ver_lb').html(vlast);
        
        container.find('[data-id=lst_ver]').click(function() {
            if(Device.isMobile()){
                if(Config.OS_Int ==1)
                    window.open("itms-apps://itunes.com/apps/instory/id864883607?Is=1&mt=8");
                else
                    window.open("market://details?id=me.instory");
            }
        });
    }
};