(function($, factory){
	if (typeof define === 'function' && define.amd) {
	    if(define.amd){
		    define(['jQuery'], function(){
		    	return factory(jQuery);
		    });
	    }else{
	    	define(function(require, exports, module){
	    		var jq = require('jQuery');
	    		module.exports = factory(jq);
	    	});
	    }
	} else if (typeof module === 'object' && module.exports) {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory($);
	} else {
	    factory($);
		return $;
	}
})(jQuery,function($){
	"use strict";
	var flag = false,
		defaults = {
			sectionPanel: '.panel', //代表每屏
			scrollSpeed: 600, //滚动速度
			nav: false, //是否显示导航
			scrollbar: false, //是否显示滚动条
			keyAble: false //键盘方向键是否可以控制滚动
		};
	/**
	 * 全屏滚动构造方法
	 * @param {object} me 全屏滑动容器
	 * @param {object} options 插件配置
	 */
	function PageSlide(me, options){
		this.me = me;
		this.options = $.extend({}, options, defaults);
	}
	/**
	 * 插件初始化
	 * @return null
	 */
	PageSlide.prototype.init = function (){
		var that = this,
			ops = that.options,
			heights = [];//每个panel高度，滚动距离
	};
	$.extend({
		alert: function(){
			console.log('test test test');
		}
	});
});