(function($,factory){
	if(typeof define === 'function'){
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
	}else if (typeof module === 'object' && module.exports) {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory($);
	}else{
		factory($);
		return $;
	}
})(jQuery,function($){
	'use strict';
	var defaults = {
		slider: '.slide-item', // 轮播对象
		nav: '', //导航对象容器
		navItem: '.nav-item',//每个导航对象
		timeCyc: 2000,
		animation: 'slide',
		beforeswitch: function(){},
		afterSitch: function(){}
	};

	function ImgSlide(ele, config){
		this.$container = ele;
		this.options = $.extend({}, defaults, config);

		this.init();
	}
	function _getAni(ani){
		var tmp = [],
			result = {};
		if( ani && Object.prototype.toString.call(ani) === '[object String]'){
			tmp = ani.split(',');
			if(tmp.length > 1){
				result.ina = tmp[0];
				result.out = tmp[1];
			}else if(tmp.length == 1){
				result.ina = tmp[0];
				result.out = tmp[0];
			}else{
				result.ina = false;
				result.out = false;
			}
		}else{
			result.ina = false;
			result.out = false;
		}
		return result;
	}
	function _slideHandle(slide){
		slide.css({
			visibility: 'hidden',
			zIndex: 0,
		});
	}
	ImgSlide.prototype.init = function(){
		var that = this,
			$container = that.$container,
			ops = that.options,
			slides = [],
			navs = [];

		$container.find(ops.slider).each(function(i,ele){
			var $ele = $(ele),
				ani = _getAni($ele.data('slideAni'));
			_slideHandle($ele);
			slides.push({
				ele: ele,
				ina: ani.ina,
				out: ani.out
			});
		});

		if(ops.nav){
			that.$nav = $(ops.nav);
			that.$nav.find(ops.navItem).each(function(i,el){
				var $el = $(el);
				navs.push({
					ele: el,
					active: false
				});
			});
		}
		that.index = 0;
		that.nextIndex = 1;
		that.slides = slides;
		that.navs = navs;
	};
	ImgSlide.prototype.moveTo = function(){
		var that = this,
			ops = that.options;

		if(that[ops.animation] && typeof that[ops.animation] == 'function'){
			that[ops.animation]();
		}else{
			that['slide']();
		}
	};
	ImgSlide.prototype.slide = function(){
		var that = this,
			ops = that.options,
			slides = that.slides,
			navs = that.navs;

		
	}
	//外部可调用方法
 	var public_method = ['moveTo'];
	$.fn.imgSlide = function(config, param){
		return this.each(function() {
            var slider = $.data(this, 'slider');
            if (!slider) {
                return $.data(this, 'slider', new ImgSlider($(this), config));
            }
            if (typeof config === "string" && (public_method.join(',').indexOf(config) > -1) && typeof slide[config] == "function") {
                slider[config].apply(slider, param);
            }
        });
	};	
});