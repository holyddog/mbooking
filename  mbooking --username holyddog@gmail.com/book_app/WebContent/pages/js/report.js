Page.Report = {
	url: 'pages/html/report.html',
	init: function(params, container) {	
		
//		params.type	//1: story, 2: comment, 3:user
//		param.auid
//		param.auname
//		param.oid
//		param.comment
		
//		alert("type:"+params.type+" auid:"+params.auid+" auname:"+params.auname+" oid:"+params.oid+" comment:"+params.comment);
		
		var STORY_REPORT_TYPE = 1;
		var COMMENT_REPORT_TYPE = 2;
		var USER_REPORT_TYPE = 3;
		
		// set toolbar buttons
		container.find('[data-id=btn_b]').tap(function() {
            Page.back(function(c, page) {
                if(page.reverseIndex){
                    page.reverseIndex(c);
                }
              });
		});
		
		var sel = container.find('select[name=type]');
		var text = container.find('textarea[name=text]');
		var btnAccept = container.find('[data-id=btn_a]');
		
		if(params.type == COMMENT_REPORT_TYPE ){
			text.attr('placeholder',"Tell us, why you want to report this comment (optional)");
		}else if(params.type == USER_REPORT_TYPE){
			text.attr('placeholder',"Tell us, why you want to report this user (optional)");
		}
		
		sel.bind('change', function() {
			if (sel.val() > 0) {
				btnAccept.removeClass('disabled');
			}
			else {
				btnAccept.addClass('disabled');
			}
		});
		
		if(!params.auname)
			params.auname = null;
		
		if(!params.oid){
            if(params.bid)
                params.oid = params.bid;
            else
                params.oid = null;

		}
        
		if(!params.comment)
			params.comment= null;
		 
		
		btnAccept.tap(function() {
			if (!btnAccept.hasClass('disabled')) {
				Page.btnShowLoading(btnAccept[0]);
				
				if(params.type){
					Service.User.SubmitReportWithType(params.type, sel.val(),Account.userId,Account.userName,params.auid,params.auname,params.oid,text.val(),params.comment,
						function(){
							Page.btnHideLoading(btnAccept[0]);
                            Page.back(function(c, page) {
                                if(page.reverseIndex){
                                    page.reverseIndex(c);
                                }
                            });
							MessageBox.drop("Already send you report");
						}
					);
				}
				else{
                      Page.back(function(c, page) {
                        if(page.reverseIndex){
                            page.reverseIndex(c);
                        }
                      });
				}
				
			}
		});
	}
};