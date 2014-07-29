<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html 
	xmlns="http://www.w3.org/1999/xhtml"
    xmlns:ui="http://java.sun.com/jsf/facelets"
    xmlns:h="http://java.sun.com/jsf/html"
    xmlns:t="http://myfaces.apache.org/tomahawk"
    xmlns:f="http://java.sun.com/jsf/core"
    xmlns:fb="http://ogp.me/ns/fb#">     
<head>
	<title>#{initParam['appName']}</title>
	
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	
    <meta name="author" content="InStory" />
	
	<script type="text/javascript">
		var Context = {
			root: "#{initParam['root']}",
			file: "#{initParam['file']}"
		};
	</script>
	
	<link rel="stylesheet" href="#{initParam['root']}/res/css/default.css" />
	<link rel="stylesheet" href="#{initParam['root']}/res/css/style.css" />
	<link rel="stylesheet" href="#{initParam['root']}/res/css/slick.css" type="text/css" />
	
	<script type="text/javascript" src="#{initParam['root']}/res/lib/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="#{initParam['root']}/res/lib/slick.min.js"></script>	
</head>	
	<body style="background-color: transparent;">
		<f:view>
			<div id="container">
				<div id="header">
					<div id="logo">
						<a href="#{initParam['root']}">
							<img src="res/images/logo.png" />
						</a>
					</div>
					<div id="nav">
						<div class="nav_panel">
							<ul class="menu_list">
								<li><a href="#{initParam['root']}">Home</a></li>
								<li><a href="#{initParam['root']}/about">About</a></li>
								<li><a href="https://www.facebook.com/pages/InStory">Facebook</a></li>
							</ul>
						</div>
					</div>
				</div>
				<ui:insert name="body"></ui:insert>
				<script type="text/javascript" src="#{initParam['root']}/res/home.js"></script>
				<!-- <div id="footer" style="height: 200px;"></div>  -->
			</div>
		</f:view>
	</body>
</html>