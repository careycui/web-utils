!function(e,t){if("function"==typeof define&&define.amd)define.amd?define(["jQuery"],function(){return t(jQuery)}):define(function(e,n,i){var o=e("jQuery");i.exports=t(o)});else{if("object"!=typeof module||!module.exports)return t(e),e;module.exports=t(e)}}(jQuery,function(e){"use strict";function t(){if(s&&s[0].document!==window.document){var e=s.offset();return{top:s.scrollTop()+e.top,left:s.scrollLeft()+e.left}}return{top:s.scrollTop(),left:s[0].pageXOffset}}function n(t,n){for(var o,f,r=Math.abs(n-t),a=0,c=!0,s=0;s<u.length;s++)if(i(u[s],!0)&&(o=e(u[s].ele),f=o.offset().top+o.height()*u[s].viewPercent,a=Math.abs(f-t),r>a)){c=!1;break}return c}function i(i,o){var f=e(i.ele),r=i.viewPercent,a=t(),c=a.top,u=a.left,d=c+s.height(),v=u+s.width(),p=f.offset().top+f.height()*r,h=f.offset().left+f.width()*r,m=p+(1-r)*f.height(),w=h+(1-r)*f.width(),b=p<=d&&m>=c&&h>=u&&w<=v;return!o&&b&&l&&(b=n(d,p)),b}function o(e){return!i(e)&&e.blocked&&e.active}function f(e){return i(e)&&!e.blocked&&!e.active}function r(){e.each(u,function(e,t){t&&(f(t)?c.animate(t,!0):o(t)&&c.animate(t,!1))})}function a(t){var n=e.extend({},d,t);this.options=n,s=n.container||e(window),l=void 0!==n.nearest&&n.nearest,this.init(),s.on("scroll",function(){r()})}var c=void 0,u=[],s=void 0,l=!1,d={container:"",aniClass:".ani",viewPercent:.2,beforeAnimate:function(){},afterAnimate:function(){}};a.prototype.init=function(){var t=this,n=t.options,i=n.aniClass;e(i).each(function(t,i){u.push({ele:i,viewPercent:n.viewPercent,active:!1,blocked:!1,animation:e(i).data("viewAnimation"),timer:void 0})})},a.prototype.animate=function(t,n){var i=this,o=i.options;if(n){if(t.blocked)return!1;"function"==typeof o.beforeAnimate&&o.beforeAnimate(t),t.active=!0,t.blocked=!0,e(t.ele).addClass("active")}else e(t.ele).removeClass("active"),t.active=!1,t.blocked=!1,"function"==typeof o.afterAnimate&&o.afterAnimate(t)},e.extend({aniView:function(e){c||(c=new a(e),r())}})});