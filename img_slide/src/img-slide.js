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
		timeCyc: 2000, //轮播间隔时间
		animation: 'slide', //轮播方式
		switchSpeed: 600, //轮播切换时间
		easing: '', //动画速度曲线
		beforeSwitch: function(){},
		afterSitch: function(){}
	};
	/**
	 * 轮播组件类
	 * 		设定轮播容器
	 * 		执行初始化动作
	 * 		开启轮播	
	 * @param {[Object]} ele jquery object 轮播容器
	 * @param {[Object]} config 相关配置
	 */
	function ImgSlide(ele, config){
		this.$container = ele;
		this.options = $.extend({}, defaults, config);

		this.init();
		this.openInterval();
	}
	/**
	 * 获取每个轮播项动画的单独配置
	 * @param  {object} ani
	 */
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
	/**
	 * 轮播初始化设置
	 * 		设置不同轮播方式所需的初始化状态
	 * @param  {Object} slide 轮播项
	 * @param  {string} type  轮播方式
	 * @param  {boolean} init  该项是否是初始显示
	 */
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
	//初始化轮播数据
	ImgSlide.prototype.init = function(){
		var that = this,
			$container = that.$container,
			ops = that.options,
			slides = [];

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
		that.slideLength = slides.length; //轮播项数量
		that.direction = 1; //当前轮播方向，只有在‘slide’下有效
		that.intervalId = void 0; 
		that.offset = $container.width(); //位移距离
		that.index = 0; //当前轮播索引
		that.nextIndex = 0; //下一个轮播索引
		that.slides = slides; //轮播对象
		that.isMoving = false; //是否正在切换
	};
	//轮播前一屏方法
	ImgSlide.prototype.pre = function(){
		var that = this;

		that.stopInterval();
		that.direction = -1;
		that.moveTo();
		that.openInterval();
	};
	//轮播下一屏方法
	ImgSlide.prototype.next = function(){
		var that = this;

		that.stopInterval();
		that.direction = 1;
		that.moveTo();
		that.openInterval();
	};
	//跳转到轮播某屏方法
	ImgSlide.prototype.goTo = function(index){
		var that = this,
			slideLength = that.slideLength;
		if(index > (that.slideLength-1) || index < 0){
			return;
		}
		that.stopInterval();
		that.nextIndex = index;
		if(index >= that.index){
			that.direction = 1;
		}else{
			that.direction = -1;
		}
		that.moveTo(true);
		that.openInterval();
	};
	//计算下一屏方法
	ImgSlide.prototype.calculateNext = function(){
		var that = this,
			ops = that.options,
			slideLength = that.slideLength,
			direction = that.direction,
			next;
		next = that.index + direction*1;
		if(next < slideLength && next > -1){
			that.nextIndex = next;
		}else{
			if(next < 0){
				that.nextIndex = slideLength - 1;
			}else{
				that.nextIndex = 0;
			}	
		}
	};
	//下一屏移动方法
	ImgSlide.prototype.moveTo = function(fast){
		var that = this,
			ops = that.options;
		if(that.isMoving){
			return;
		}
		that.isMoving = true;
		!fast && that.calculateNext();
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
			curSlide = slides[that.index],
			nextSlide = slides[that.nextIndex];
		if(that.index != that.nextIndex){
			$(nextSlide.ele).css({
				visibility: 'visible'
			});
			$(curSlide.ele).animate({
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
				that.isMoving = false;
			});

			that.index = that.nextIndex;
		}
	};
	ImgSlide.prototype.slide = function(){
		var that = this,
			ops = that.options,
			easing = ops.easing,
			slides = that.slides,
			curSlide = slides[that.index],
			nextSlide = slides[that.nextIndex],
			direction = that.direction;

		if(that.index != that.nextIndex){
			$(nextSlide.ele).css({
				position: 'absolute',
				left: direction*that.offset,
				top: 0,
				visibility: 'visible'
			});
			$(curSlide.ele).animate({
				left: -1*that.offset*direction,
				visibility: 'visible'
			}, ops.switchSpeed,easing,function(){
				$(curSlide.ele).css({
					visibility: 'hidden',
					left: 'auto'
				})
			});
			$(nextSlide.ele).animate({
				left: 0
			}, ops.switchSpeed, easing, function(){
				that.isMoving = false;
			});

			that.index = that.nextIndex;
		}
	};
	ImgSlide.prototype.openInterval = function(){
		var that = this,
			ops = that .options;

		if(that.intervalId){
			return;
		}
		that.intervalId = setInterval(function(){
			that.direction = 1;
			that.moveTo();
		},ops.timeCyc);
	};
	ImgSlide.prototype.stopInterval = function(){
		var that = this,
			ops = that.options;

		window.clearInterval(that.intervalId);
		that.intervalId = void 0;
	};
	//外部可调用方法
 	var public_method = ['moveTo','pre','next','goTo'];
	$.fn.imgSlide = function(config, param){
		return this.each(function() {
            var slider = $.data(this, 'slider');
            if (!slider) {
                return $.data(this, 'slider', new ImgSlide($(this), config));
            }
            if (typeof config === "string" && (public_method.join(',').indexOf(config) > -1) && typeof slider[config] == "function") {
                slider[config](param);
            }
        });
	};	
});