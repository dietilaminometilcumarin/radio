jQuery(document).ready(
(function(t){var e,a;
function n(t,e,a){
	return(new Array(a+1).join(e)+t).slice(-a)}t(".sf-menu").superfish(),e=t("#wpadminbar").length?t(window).height()-32:t(window).height(),t("#slides_wrapper").height(e),(a=t("#slides")).length>0&&a.superslides({play:7e3,animation:"fade",pagination:!0,inherit_height_from:"#slides_wrapper"}),t(".scroll-to").bind("click",(function(e){t("html, body").animate({scrollTop:t(t(this).attr("href")).offset().top},{duration:1200,easing:"easeInOutExpo"}),e.preventDefault()})),(a=t(".audio1 audio")).length>0&&(a.mediaelementplayer({features:["prevtrack","playpause","nexttrack","progress","current","volume","playlistfeature"],success:function(e){e.addEventListener("playing",(
	function(){
		//var a=t('input[data-url="'+e.currentSrc+'"]'),	n=a.attr("data-title"),i=a.attr("data-artist");
		var z = e.currentSrc.substring(e.currentSrc.lastIndexOf('/') + 1);
		var a=t('input[data-url="'+z+'"]'),	n=a.attr("data-title"),i=a.attr("data-artist");
		
		//alert(z);
	t(".mushometitle").html(n),t(".mushomeartist").html(i)}),!1)}}),t(".audio1 .mejs-prevtrack-button").addClass("mejs-cust1-button"),t(".audio1 .mejs-nexttrack-button").addClass("mejs-cust2-button")),(a=t(".audio2 audio")).length>0&&a.mediaelementplayer({features:["playpause","progress"],success:function(e){e.addEventListener("loadedmetadata",(function(){var a=Math.floor(e.duration/60),i=parseInt(e.duration)-60*a,r=n(a,"0",2)+"."+n(i,"0",2);t(this).parent().parent().parent().parent().parent().parent().find("span.duration").html(r)}))}}),(a=t(".audio3 audio")).length>0&&a.mediaelementplayer({features:["playpause"]}),(a=t(".audio4 audio")).length>0&&a.mediaelementplayer({features:["playpause","progress"]}),(a=t(".accordion")).length>0&&a.accordion({active:0,heightStyle:"content"}),(a=t(".animated-number")).length>0&&a.appear((function(){var e=t(this),a=e.text(),n=e.data("duration"),i=e.data("animation-delay");i||(i=0),e.text("0"),setTimeout((function(){e.animate({num:a},{duration:n,step:function(t){this.innerHTML=t.toFixed(0)}})}),i)})),(a=t(".owl-carousel-testimonials")).length>0&&a.owlCarousel({items:1,loop:!0,margin:30})}));