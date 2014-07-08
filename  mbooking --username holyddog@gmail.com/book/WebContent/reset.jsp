<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html 
	xmlns="http://www.w3.org/1999/xhtml"
    xmlns:ui="http://java.sun.com/jsf/facelets"
    xmlns:h="http://java.sun.com/jsf/html"
    xmlns:t="http://myfaces.apache.org/tomahawk"
    xmlns:f="http://java.sun.com/jsf/core"
    xmlns:fb="http://ogp.me/ns/fb#">     
<head>
	<title>Reset Password</title>
	
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	
	<link rel="stylesheet" href="#{initParam['root']}/res/css/default.css" />
	<link rel="stylesheet" href="#{initParam['root']}/res/css/style.css" />
	
	<script type="text/javascript" src="#{initParam['root']}/res/lib/jquery-1.10.2.min.js"></script>
</head>	
	<body>
		<f:view>	
			<f:subview id="successView" rendered="#{resetView.success}">Success</f:subview>
			<f:subview id="formView" rendered="#{!resetView.success}">
				<t:div rendered="#{!resetView.valid}">Invalid key</t:div>
				<t:div rendered="#{resetView.valid}">
					<div class="fill_dock box vertical">
					<div class="flex1 box vertical">
						<div class="flex1"></div>
						<div id="reset_message">
							<div class="title">Reset "IN Story" Password of</div> 
							<img src="#{initParam['file']}#{resetView.pic}" onerror="if (this.src != '#{initParam['root']}/res/images/user.jpg') this.src = '#{initParam['root']}/res/images/user.jpg';"></img>
							<div class="accountname">#{resetView.dname}</div>
						</div>
					</div>
					<form id="resetpass" method="post" action="data/reset">
						<div class="input_layout">
							<div class="label">
								<div class="fleft label">New Password</div>
								<div data-lbl="npwd" class="err_msg fright label"></div>
							</div>
							<input name="key" style="display:none" type="hidden" value=	"#{request.getParameter('key')}"/>
							<div class="input shadow_border">
								<input name="npwd" placeholder="At least 6 characters" type="password" />
							</div>
						</div>	
						<div class="input_layout">
							<div class="label">
								<div class="fleft label">Confirm Password</div>
								<div data-lbl="cpwd" class="err_msg fright label"></div>
							</div>
							<div class="input shadow_border">
								<input name="cpwd" placeholder="At least 6 characters" type="password" />
							</div>
						</div>
						<div class="input_layout">
							<button class="submit_btn disable" type="submit">Submit</button>
						</div>
					</form>
					<div class="flex2"></div>
					</div>
					<script type="text/javascript" src="#{initParam['root']}/res/reset.js"></script>
				</t:div>
			</f:subview>
		</f:view>
	</body>
</html>