<ui:composition xmlns="http://www.w3.org/1999/xhtml"
	xmlns:ui="http://java.sun.com/jsf/facelets"
   	xmlns:h="http://java.sun.com/jsf/html"
   	xmlns:f="http://java.sun.com/jsf/core"
    xmlns:t="http://myfaces.apache.org/tomahawk"
   	template="/WEB-INF/tpl/container.jsp">
   	<ui:define name="body">
		<div id="bg_blue"></div>
		<div id="body">
			<div id="mockup"></div>
			<div id="carousel">
				<div style="background-image: url(res/images/1.jpg);"></div>
				<div style="background-image: url(res/images/2.jpg);"></div>
				<div style="background-image: url(res/images/3.jpg);"></div>
				<div style="background-image: url(res/images/4.jpg);"></div>
			</div>
			<div class="about">
				<h1 class="qtitle">Your Story Never End</h1>
				<div class="hline"></div>
				<p class="para">Capture your memories and create your stories using your photos, text and share to your friends</p>
				<div class="lpanel">
					<a class="dlink android" href="https://play.google.com/store/apps/details?id=me.instory" style="float: left; margin-right: 10px;">
						<span class="av">Available for</span>
						<span class="src">Android</span>
					</a>
					<a class="dlink ios" href="https://itunes.apple.com/th/app/instory/id864883607?mt=8" style="float: left;">
						<span class="av">Available on the</span>
						<span class="src">App Store</span>
					</a>
				</div>
				<div class="fb_contact">
					<div class="fb_panel">
						<span>Follow &amp; Update News</span>
						<a class="icon" href="https://www.facebook.com/pages/InStory"></a>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="#{initParam['root']}/res/home.js"></script>
	</ui:define>
</ui:composition>