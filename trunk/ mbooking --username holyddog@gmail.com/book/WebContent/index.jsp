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
</head>	
	<body>
		<f:view>
		</f:view>
	</body>
</html>