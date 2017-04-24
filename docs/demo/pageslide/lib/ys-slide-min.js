!function(e,n){if("function"==typeof define&&define.amd)define.amd?define(["jQuery"],function(){return n(jQuery)}):define(function(e,t,o){var i=e("jQuery");o.exports=n(i)});else{if("object"!=typeof module||!module.exports)return n(e),e;module.exports=n(e)}}(jQuery,function(e){"use strict";function n(n,t){this.me=n,this.options=e.extend({},f,t),this.init(),this.renderHtml(),this.bindEvent(),this.animateScrollTo(s)}var t=!0,o=!1,i=!0,a=void 0,s=0,l=void 0,r=[],c=(new Date).getTime(),u=void 0,f={sectionPanel:".panel",scrollSpeed:600,scrollHeight:e(window).height(),nav:!1,keyAble:!1,delay:0,beforeScroll:function(e,n){},afterScroll:function(e){},renderType:"outer",insertSection:"",scrollbar:!1,animateClass:void 0};e.easing.easeOutExpo=function(e,n,t,o,i){return n==i?t+o:o*(1-Math.pow(2,-10*n/i))+t};var d=function(){var e=document.createElement("div"),n={animation:"animationend",WebkitAnimation:"webkitAnimationEnd",MozAnimation:"mozAnimationEnd"},t=void 0;for(var o in n)if(void 0!==e.style[o]){t=n[o];break}return t||!1},h=function(n,t,o,i){var a=[],s=[];return n.find(t).each(function(e,n){s.push(n)}),i&&o&&(a=o.split(","),a[0]&&e(a[0]).length>0&&s.splice(0,0,e(a[0])[0]),a[1]&&e(a[1]).length>0&&s.push(e(a[1])[0])),s},p=function(n){var t,o=[],i=0,a=0;for(i;i<n.length;i++)t=e(n[i]),i>0&&(a+=-e(n[i-1]).height()),o.push({height:t.height(),top:a});return o};n.prototype.init=function(){var e=this,n=e.me,t=e.options,o=this.panels=h(n,t.sectionPanel,t.insertSection,"outer"==t.renderType);this.configs=p(o),s=0,l=t.curIndex||0,!(u=d())&&t.animateClass&&(e.options.animateClass=void 0)},n.prototype.renderHtml=function(){var n=this,t=n.me,o=n.options,i=n.panels,a=n.configs,s=0;for(s;s<i.length;s++)e(i[s]).height(a[s].height),a[s].scrollTop=e(i[s]).offset().top;({outer:function(){console.log("outer render")},inner:function(){e("html,body").css({height:"100%",overflow:"hidden"}),t.css({position:"absolute",width:"100%",height:"100%"}),o.animateClass&&t.find(o.sectionPanel).addClass(o.animateClass.clazz)}})[o.renderType]()};var m=function(e){function n(n){for(var t=0,o=e.slice(Math.max(e.length-n,1)),i=0;i<o.length;i++)t+=o[i];return Math.ceil(t/n)}return n(10)>=n(70)};n.prototype.bindEvent=function(){var n=this,f=n.options,d={handleMouseDown:function(){t=!1,o=!1},handleMouseUp:function(){t=!0,o&&d.calculateNearst()},handleScroll:function(){a&&clearTimeout(a),a=setTimeout(function(){if(o=!0,!1===t)return!1;t=!1,d.calculateNearst()},200)},calculateNearst:function(){var t,o=e(window).scrollTop(),i=(n.panels,n.configs),a=1,s=Math.abs(i[0].scrollTop-o),r=0;for(a;a<i.length;a++)(t=Math.abs(i[a].scrollTop-o))<s&&(s=t,r=a);l=r,n.animateScrollTo()},wheelHandler:function(e,t){e.preventDefault();var o=s,a=(new Date).getTime(),u=t||-e.originalEvent.detail||e.originalEvent.wheelDelta;if(t=Math.max(-1,Math.min(1,u)),r.length>149&&r.shift(),r.push(Math.abs(u)),a-c>200&&(r=[]),c=a,!1===i)return!1;if(t<0){if(o>=n.panels.length-1)return;o++}else if(t>0){if(o<=0)return;o--}else o=0;m(r)&&(l=o,n.animateScrollTo())},init:function(){"outer"===f.renderType&&(f.scrollbar?(e(window).off("mousedown mouseup scroll"),e(window).on("mousedown",d.handleMouseDown),e(window).on("mouseup",d.handleMouseUp),e(window).on("scroll",d.handleScroll)):e("body").css({overflow:"hidden"})),e(document).off("DOMMouseScroll mousewheel"),e(document).on("DOMMouseScroll mousewheel",d.wheelHandler)}};d.init();var h={init:function(){var t=0;for(t;t<n.panels.length;t++)e(n.panels[t]).on(u,function(){e(this).hasClass(f.animateClass.out)&&e(this).removeClass(f.animateClass.out),e(this).hasClass(f.animateClass.in)&&e(this).removeClass(f.animateClass.in)})}};f.animateClass&&h.init()},n.prototype.beforeAnimate=function(){var n=this,o=n.options,a=n.panels;n.configs;t=!1,i=!1,e(a[s]).addClass("ys-ani"),e(a[l]).addClass("ys-ani"),"function"==typeof o.beforeScroll&&o.beforeScroll.call(n,s,l)},n.prototype.afterAnimate=function(){var n=this,t=n.options,o=n.panels;n.configs;t.delay?setTimeout(function(){i=!0},t.delay):i=!0,s!=l&&(e(o[s]).removeClass("ys-ani"),s=l),"function"==typeof t.afterScroll&&t.afterScroll.call(n,s)},n.prototype.animateScrollTo=function(){var n=this,t=n.me,o=n.options,i=n.panels,a=n.configs,r={outer:function(){e("html,body").animate({scrollTop:a[l].scrollTop},o.scrollSpeed,"easeOutExpo"),e("html,body").promise().done(function(){n.afterAnimate()})},inner:function(){o.animateClass?s!=l?(e(i[s]).addClass(o.animateClass.out),e(i[l]).addClass(o.animateClass.in),setTimeout(function(){n.afterAnimate()},o.scrollSpeed-10)):n.afterAnimate():(t.animate({top:a[l].top},o.scrollSpeed,"easeOutExpo"),t.promise().done(function(){n.afterAnimate()}))}};a[l]&&(n.beforeAnimate(),r[o.renderType]())},e.fn.ysSlide=function(t,o){var i=this;return this.each(function(){var a=e.data(i,"ysSlide");a||(a=new n(e(i),t),e.data(i,"ysSlide",a)),"string"==typeof t&&"function"==typeof a[t]&&a[t].call(a,o)})}});