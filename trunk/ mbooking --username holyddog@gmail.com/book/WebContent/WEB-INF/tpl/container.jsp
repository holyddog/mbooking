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
			path: "#{initParam['context']}",
			domain: "#{initParam['domain']}",
			root: "#{initParam['root']}",
			images: "#{initParam['images']}"
		};
	</script>
	
	<link rel="stylesheet" href="#{initParam['root']}/res/css/default.css" />
	<link rel="stylesheet" href="#{initParam['root']}/res/css/style.css" />
	
	<script type="text/javascript" src="#{initParam['root']}/res/lib/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="#{initParam['root']}/res/lib/jquery.mousewheel.js"></script>
	
	<script type="text/javascript" src="#{initParam['root']}/res/lib/jquery.jscrollpane.js"></script>
	<script type="text/javascript" src="#{initParam['root']}/res/lib/jquery.form.js"></script>
	<script type="text/javascript" src="#{initParam['root']}/res/lib/jquery.elastic.js"></script>
</head>	
	<body>	
		<f:view>
			<div id="wrapper">
				<h1 id="title"><ui:insert name="title"></ui:insert></h1>
				<div id="content">
					<ui:insert name="view"></ui:insert>
				</div>
			</div>
		</f:view>
		<script type="text/javascript" src="#{initParam['root']}/res/js/app.js"></script>
		<script type="text/javascript">
			<ui:insert name="script"></ui:insert>
		</script>
	</body>
</html>