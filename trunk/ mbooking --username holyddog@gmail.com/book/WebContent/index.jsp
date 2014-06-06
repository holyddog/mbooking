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
	<style type="text/css">

	</style>
	
	<script type="text/javascript" src="#{initParam['root']}/res/lib/jquery-1.10.2.min.js"></script>
</head>	
	<body>
		<f:view>	
			<div id="toolbar">
				<h1>IN STORY</h1>
				<div class="buttons">
					<!-- <a class="share" href="#"></a> -->
					<a class="download" href="#"></a>
				</div>
			</div>
			<div id="wrapper">
				<div id="content">
					<div id="story">
					<ui:repeat var="p" value="#{bookView.pages}">
						<div class="page">
							<div class="pic">
								<img src="#{initParam['file']}#{p.pic}" />
							</div>
							<div class="caption">
								<div class="message"><span>#{p.caption}</span></div>
								<div class="nav"><span>#{p.seq} of #{bookView.pageSize}</span></div>
							</div>
						</div>
					</ui:repeat>
					<div id="cover" class="page active"
							style="background-image: url(#{initParam['file']}#{bookView.coverPic})">
							<div class="header">
								<h1 class="title">#{bookView.book.title}</h1>
								<div class="desc">#{bookView.book.desc}</div>
								<div class="bline"></div>
								<div class="author">
									<div class="upic">
										<img src="#{initParam['file']}#{bookView.authorPic}" />
									</div>
									<h3 class="uname">#{bookView.book.author.dname}</h3>
								</div>
							</div>
							<div class="pcount">#{bookView.book.pcount}</div>
						</div>
						<a id="btn_prev" href="javascript:void(0);" class="change left"></a> <a id="btn_next" href="javascript:void(0);" class="change right"></a>
					</div>
				</div>
				<!-- 
				<div id="share">
					<ul class="share_list">
						<li><span class="label">SHARE THIS</span></li>
						<li><a class="link fb" href="#"></a></li>
						<li><a class="link tw" href="#"></a></li>
						<li><a class="link gp" href="#"></a></li>
					</ul>
				</div>
				 -->
				<div id="panel">
					<div class="download_panel">
						<h2>Download for Free</h2>
						<a class="link android" href="#">
							<span class="av">Available for</span>
							<span class="src">Android</span>
						</a>
						<a class="link ios" href="#">
							<span class="av">Available on the</span>
							<span class="src">App Store</span>
						</a>
					</div>
					<h2 class="share_title">Share This</h2>
					<ul class="share_list">
						<li><a class="link fb" href="#"></a></li>
						<li><a class="link tw" href="#"></a></li>
						<li><a class="link gp" href="#"></a></li>
					</ul>
				</div>
			</div>
		</f:view>
	<script type="text/javascript" src="#{initParam['root']}/res/story.js"></script>
	</body>
</html>