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
		switchSpeed: 600,
		easing: '',
		beforeSwitch: function(){},
		afterSitch: function(){}
	};

	function ImgSlide(ele, config){
		this.$container = ele;
		this.options = $.extend({}, defaults, config);

		this.init();
		this.openInterval();
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
	function _slideHandle(slide, type, init){
		var _handle = {
			slide:function(){
				if(init){
					slide.css({
						position:'absolute',
						visibility: 'visible',
						left: 0,
						top: 0
					});
				}else{
					slide.css({
						visibility: 'hidden',
						zIndex: 0,
					});
				}
			},
			fade:function(){
				slide.css({
					position: 'absolute',
					visibility: 'hidden',
					left: 0,
					top: 0,
					opacity: 0,
					zIndex: 0
				});
				if(init){
					slide.css({
						visibility: 'visible',
						opacity: 1,
						zIndex: 1
					});
				}
			}
		};
		switch(type){
			case 'slide':
				_handle.slide();
				break;
			case 'fade':
				_handle.fade();
				break;
			default:
				_handle.slide();
		}
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
			_slideHandle($ele, ops.animation, (i==0?true:false));
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
		that.slideLength = slides.length;
		that.intervalId = void 0;
		that.offset = $container.width();
		that.index = 0;
		that.nextIndex = 0;
		that.slides = slides;
		that.navs = navs;
	};
	ImgSlide.prototype.moveTo = function(){
		var that = this,
			ops = that.options;
		if(typeof ops.beforeSwitch == 'function'){
			ops.beforeSwitch.call(that);
		}
		if(that[ops.animation] && typeof that[ops.animation] == 'function'){
			that[ops.animation]();
		}else{
			that['slide']();
		}
		if(typeof ops.afterSwitch == 'function'){
			ops.afterSwitch.call(that);
		}
	};
	ImgSlide.prototype.fade = function(){
		var that = this,
			ops = that.options,
			easing = ops.easing,
			slides = that.slides,
			navs = that.navs,
			curSlide = slides[that.index],
			nextSlide = slides[that.nextIndex];
		if(that.index != that.nextIndex){
			$(nextSlide.ele).css({
				visibility: 'visible'
			});
			$(curSlide.ele).animate({
				// visibility: 'visible',
				opacity: 0
			}, ops.switchSpeed,easing,function(){
				$(curSlide.ele).css({
					visibility: 'hidden',
					zIndex: 0
				})
			});
			$(nextSlide.ele).animate({
				opacity: 1
			}, ops.switchSpeed, easing, function(){
				$(nextSlide.ele).css({
					zIndex: 1
				});
			});

			that.index = that.nextIndex;
		}
	};
	ImgSlide.prototype.slide = function(){
		var that = this,
			ops = that.options,
			easing = ops.easing,
			slides = that.slides,
			navs = that.navs,
			curSlide = slides[that.index],
			nextSlide = slides[that.nextIndex];

		if(that.index != that.nextIndex){
			$(nextSlide.ele).css({
				position: 'absolute',
				left: that.offset,
				top: 0,
				visibility: 'visible'
			});
			$(curSlide.ele).animate({
				left: -1*that.offset,
				visibility: 'visible'
			}, ops.switchSpeed,easing,function(){
				$(curSlide.ele).css({
					visibility: 'hidden',
					left: 'auto'
				})
			});
			$(nextSlide.ele).animate({
				left: 0
			}, ops.switchSpeed, easing);

			that.index = that.nextIndex;
		}
	};
	ImgSlide.prototype.openInterval = function(){
		var that = this,
			ops = that.options,
			slideLength = that.slideLength;

		if(that.intervalId){
			return;
		}
		that.intervalId = setInterval(function(){
			var next = that.index + 1;
			if(next < slideLength){
				that.nextIndex = next;
			}else{
				that.nextIndex = 0;
			}
			that.moveTo();
		},ops.timeCyc);
	};
	//外部可调用方法
 	var public_method = ['moveTo'];
	$.fn.imgSlide = function(config, param){
		return this.each(function() {
            var slider = $.data(this, 'slider');
            if (!slider) {
                return $.data(this, 'slider', new ImgSlide($(this), config));
            }
            if (typeof config === "string" && (public_method.join(',').indexOf(config) > -1) && typeof slide[config] == "function") {
                slider[config].apply(slider, param);
            }
        });
	};	
});