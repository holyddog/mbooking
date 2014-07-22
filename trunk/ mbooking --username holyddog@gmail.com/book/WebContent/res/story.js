var screenChange = function() {
	var content = $('#content');
	var panel = $('#panel');
	var story = $('#story');
	
	content.height($(window).innerHeight() - 50);
	
	var ch = content.height();
	var sw = Math.ceil((ch * 6.5) / 10);
	
	story.css({
		'width': sw,
		'height': ch
	});
	
	if ($(window).innerWidth() <= (panel.width() + sw + 30)) {
		panel.hide();
		content.css({
			'margin-right': '0px',
			'margin-left': '0px'
		});
	}
	else {
		panel.show();
		content.css({
			'margin-right': panel.width() + 'px'
		});
	}
	
	$('.page .pic').height(sw);
	$('.page .caption').height(ch - sw - 36);
};

var btnNext = $('#btn_next');
var btnPrev = $('#btn_prev');
var isMobile = false;

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//if (true) {
	var content = $('#content');
	var panel = $('#panel');
	var story = $('#story');
	
	btnNext.css({
		'top': '0px',
		'width': '50%',
		'height': '100%',
		'right': '0'
	});
	btnPrev.css({
		'top': '0px',
		'width': '50%',
		'height': '100%',
		'left': '0'
	});
	
	content.height($(window).innerHeight());
	content.css({
		'padding': '0px',
		'margin-right': '0px',
		'margin-left': '0px'
	});
	
	var ch = content.height();
	var sw = $(window).innerWidth();
	story.css({
		'margin': '0',
		'width': sw,
		'height': ch
	});
	$('.page .pic').height(sw);
	$('.page .caption').height(ch - sw - 36);
	panel.hide();
	
	isMobile = true;
}
else {
	$(window).resize(function() {
		screenChange();
	});
	$(window).trigger('resize');
}

var st = $("#story");
st.owlCarousel({
	singleItem: true,
	pagination: false,
	rewindNav: false,
	navigation: true,
	navigationText: ['', '']
});
st.find('.owl-item').css({
	height: st.height() + 'px'
});

if (isMobile) {
	$('.owl-controls').hide();
}

//var index = $('#cover').index();
//var pages = $('.page');
//
//var displayButton = function() {	
//	if (index == $('#cover').index()) {
//		btnPrev.hide();
//	}	
//	else if (index == 0) {
//		btnNext.hide();
//	}
//	else {
//		btnPrev.show();
//		btnNext.show();		
//	}
//};
//var changePage = function(dir) {
//	if (index + dir < 0 || index + dir >= pages.length) {
//		return;
//	}
//	
//	index = index + dir;
//	pages.removeClass('active');
//	pages.eq(index).addClass('active');
//	displayButton();
//};
//displayButton();
//btnNext.bind('click', function() {
//	changePage(-1);
//});
//btnPrev.bind('click', function() {
//	changePage(1);	
//});

var shareUrl = window.location.href; 
var text = 'In Story';
$('.link.fb').bind('click', function() {
//	https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fflipagram.com%2Ff%2Fmq3lbliZV6&t=#flipagram created using @flipagram
	var url = 'http://www.facebook.com/sharer/sharer.php?u=' + shareUrl;
	window.open(url, 'facebook_share', 'height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
});
$('.link.tw').bind('click', function() {
//	https://twitter.com/intent/tweet?text=Test%20%23flipagram%20created%20using%20%40flipagram%20%E2%99%AB%20Music%3A%20Satoko%20Yamano%20-%20Doraemon%20no%20Uta&url=https%3A%2F%2Fflipagram.com%2Ff%2Fmq3lbliZV6
	var url = 'https://twitter.com/intent/tweet?text=' + $('#cover').find(".title").text() + '&url=' + shareUrl;
	window.open(url, 'twitter_share', 'height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
});
$('.link.gp').bind('click', function() {
//	https://plus.google.com/share?hl=en-US&url=https%3A%2F%2Fflipagram.com%2Ff%2Fmq3lbliZV6
	var url = 'https://plus.google.com/share?hl=en-US&url=' + shareUrl;
	window.open(url, 'gplus_share', 'height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
});