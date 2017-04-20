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

	var scrollAble = true,
		timeoutId = void 0,
		defaults = {
			sectionPanel: '.panel', //代表每屏
			scrollSpeed: 1000, //滚动速度
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
		this.options = $.extend({}, defaults, options);

		this.init();
		this.renderHtml();
		this.bindEvent();

	}
	/**
	 * 获取每屏元素
	 * @param  {jQuery Object} container 插件绑定的元素
	 * @param  {string} clazz     每屏的calss
	 * @return {Array}           获得的全部屏元素
	 */
	var getPanels = function(container,clazz){
		var panels = container.find(clazz);
		if(panels.length < 1){
			panels = [];
		}
		return panels;
	};
	/**
	 * 保存每个panel对应的配置
	 * @param {Array[dom]} panels     分屏数组
	 * @param {Number} containerH 平高度，取值来自父容器
	 */
	var setPanelConfig = function(panels, containerH){
		var tmp = [],
			$panel,
			i = 0;

		for(i; i < panels.length; i++){
			$panel = $(panels[i]);
			tmp.push({
				height: $panel.height()
			});	
		}
		return tmp;
	};
	/**
	 * 插件初始化
	 */
	PageSlide.prototype.init = function (){
		var that = this,
			me = that.me,
			ops = that.options,
			panels = this.panels = getPanels(me,ops.sectionPanel);

		this.configs = setPanelConfig(panels);//设置存储数据

		this.curIndex = ops.curIndex || 0; //设置当前展示页页码
		this.nextIndex = void 0; //声明下张显示页页码
		this.ifMoving = false; //初始化声明是否可以触发切换
	};
	PageSlide.prototype.renderHtml = function(){
		var that = this,
			me = that.me,
			ops = that.options,
			panels = that.panels,
			configs = that.configs,
			i = 0;

		for(i; i < panels.length; i++){
			$(panels[i]).height(configs[i].height);
			configs[i].scrollTop = $(panels[i]).offset().top;
		}

		me.css({
			overflow: 'hidden'
		});

	};
	PageSlide.prototype.bindEvent = function(){
		var that = this;

		var _scroll = {
			/**
			 * 鼠标按下时进行的处理
			 * 		1、当前页面不可滚动，scrollAble = false
			 */
			handleMouseDown: function(){
				scrollAble = false;
			},
			/**
			 * 鼠标松开时进行的处理
			 * 		2、当前页面可滚动，scrollAble = true
			 */
			handleMouseUp: function(){
				scrollAble = true;
			},
			/**
			 * 滚动条滚动监听处理方法
			 */
			handleScroll: function(){
				if(timeoutId){
					clearTimeout(timeoutId);
				}
				timeoutId = setTimeout(function(){
					if(scrollAble === false){
						return false;
					}
					scrollAble = false;
					_scroll.calculateNearst();
				},160);

			},
			calculateNearst: function(){
				var scrollTop = $(window).scrollTop(),
					panels = that.panels,
					configs = that.configs,
					i = 1,
					pre = Math.abs(configs[0].scrollTop - scrollTop),
					diff,
					index = 0;
				for(i;i < configs.length; i++){
					diff = Math.abs(configs[i].scrollTop - scrollTop);
					if(diff < pre){
						pre = diff;
						index = i;
					}
				}
				that.animateScrollTo(index);
			},
			wheelHandler: function(e, delta){
				e.preventDefault();
				delta = delta || -e.originalEvent.detail / 3 || e.originalEvent.wheelDelta / 120;
				if(timeoutId){
					clearTimeout(timeoutId);
				}
				timeoutId = setTimeout(function(){
					if(delta < 0){
						if (that.curIndex >= that.panels.length - 1)return;
	                	that.curIndex++;
					}else if(delta > 0){
						if (that.curIndex <= 0)return;
	               		that.curIndex--;
					}else{
						that.curIndex = 0;
					}
					that.animateScrollTo(that.curIndex);
				},160);
			},
			init: function() {
		        if (that.options.scrollbar) {
		          $(window).off('mousedown mouseup scroll');
		          $(window).on('mousedown', _scroll.handleMouseDown);
		          $(window).on('mouseup', _scroll.handleMouseUp);
		          $(window).on('scroll', _scroll.handleScroll);
		        } else {
		          $("body").css({
		            "overflow": "hidden"
		          });
		        }
		        $(document).off('DOMMouseScroll mousewheel');
		        $(document).on('DOMMouseScroll mousewheel', _scroll.wheelHandler);
		    }
		}
		_scroll.init();
	};
	PageSlide.prototype.animateScrollTo = function(index){
		var that  = this,
			ops = that.options,
			configs = that.configs;
		if(configs[index]){
			$('html,body').animate({
				scrollTop: configs[index].scrollTop
			}, ops.scrollSpeed);
		}
	};

	$.fn.ysSlide = function(options, param) {
		var that = this;
	    return this.each(function() {
	      var slide = $.data(that, 'ysSlide');

	      //初始化相关
	      if (!slide) {
	        //参数设置
	        slide = new PageSlide($(that), options);
	        $.data(that, 'ysSlide', slide);
	      }

	      // 调用方法
	      if (typeof options === "string" && typeof slide[options] == "function") {
	        // 执行插件的方法
	        slide[options].call(slide, param);
	      }

	    });
	  };
});