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

	var scrollAble = true, //是否可以开始切换
		hasScrolled = false, //是否已经执行过切换方法
		wheelAble = true, //滚轮是否可切换
		timeoutId = void 0,
		curIndex = 0, //当前屏索引
		nextIndex = void 0, //下一屏索引
		defaults = {
			sectionPanel: '.panel', //代表每屏
			scrollSpeed: 600, //滚动速度
			scrollHeight: $(window).height(), //滚动高度
			nav: false, //是否显示导航
			keyAble: false, //键盘方向键是否可以控制滚动
			beforeScroll: function(curIndex, nextIndex){},
			afterScroll: function(curIndex){},
			/**
			 * 渲染方法
			 * 1. outer 通过改变父容器滚动条位置，达到切换目的；
			 * 		此种情况下 scrollbar 配置有效
			 * 2. innner 通过改变组件位移达到切换目的;
			 * 		此种情况下可以自定义每屏切换效果
			 */
			renderType: 'outer', //渲染方法，两种：1. outer 通过改变父容器滚动条位置，达到切换目的；2. inner  通过改变组件位移达到切换目的
			// if renderType === 'outer'
			insertSection: '' ,//一般用于header，footer
			scrollbar: false, //是否显示滚动条
			// if renderType === 'inner'
			animateClass: ''
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

		this.animateScrollTo(curIndex);
	}
	/**
	 * 获取每屏元素
	 * @param  {jQuery Object} container 插件绑定的元素
	 * @param  {string} clazz     每屏的calss
	 * @param  {boolean} ifInsert 是否需要添加header，footer
	 * @return {Array}           获得的全部屏元素
	 */
	var getPanels = function(container, clazz, insertSection, ifInsert){
		var tmp = [],
			panels = [],
			i=0;

		container.find(clazz).each(function(i,ele){
			panels.push(ele);
		});
		if(ifInsert && insertSection){
			tmp = insertSection.split(',');
			if(tmp[0] && $(tmp[0]).length > 0){
				panels.splice(0,0,$(tmp[0])[0]);
			}
			if(tmp[1] && $(tmp[1]).length > 0){
				panels.push($(tmp[1])[0]);
			}
		}
		return panels;
	};
	/**
	 * 保存每个panel对应的配置
	 * @param {Array[dom]} panels     分屏数组
	 * @param {Number} containerH 屏高度，取值来自父容器
	 */
	var setPanelConfig = function(panels){
		var tmp = [],
			$panel,
			i = 0,
			top = 0;

		for(i; i < panels.length; i++){
			$panel = $(panels[i]);
			if(i > 0){
				top += -$(panels[i-1]).height();
			}
			tmp.push({
				height: $panel.height(), //屏高
				top: top //container top位置 
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
			panels = this.panels = getPanels(me, ops.sectionPanel, ops.insertSection, (ops.renderType == 'outer'?true:false));

		this.configs = setPanelConfig(panels);//设置存储数据

		curIndex = ops.curIndex || 0; //设置当前展示页页码
		nextIndex = ops.curIndex || 0; //声明下张显示页页码
	};
	/**
	 * 渲染组件所需的HTML片段，css样式
	 */
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

		var _render = {
			outer: function(){
				console.log('outer render');

			},
			inner: function(){
				$('html,body').css({
					height: '100%',
					overflow: 'hidden'
				});
				me.css({
					position: 'absolute',
					width: '100%',
					height: '100%'
				});

			}
		};

		_render[ops.renderType]();
	};
	/**
	 * 绑定事件
	 * 
	 */
	PageSlide.prototype.bindEvent = function(){
		var that = this,
			ops = that.options;

		var _scroll = {
			/**
			 * 鼠标按下时进行的处理
			 * 		1、当前页面不可切换，scrollAble = false
			 * 		2、handleScrolled是否已经执行，默认未执行
			 */
			handleMouseDown: function(){
				scrollAble = false; 
				hasScrolled = false;  
			},
			/**
			 * 鼠标松开时进行的处理
			 * 		1、当前页面可切换，scrollAble = true
			 */
			handleMouseUp: function(){
				scrollAble = true;
				if(hasScrolled){
					_scroll.calculateNearst();
				}
			},
			/**
			 * 滚动条滚动监听处理方法
			 * 		异步执行，1、未触发handleMouseUp,已经进入了切换方法，但是未执行切换
			 * 				  2、触发handleMouseUp,顺利进入切换方法并执行
			 */
			handleScroll: function(){
				if(timeoutId){
					clearTimeout(timeoutId);
				}
				timeoutId = setTimeout(function(){
					hasScrolled = true;
					if(scrollAble === false){
						return false;
					}
					scrollAble = false;
					_scroll.calculateNearst();
				},200);
			},
			/**
			 * 计算哪块区域显示更多，显示多的为要显示的屏
			 */
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
				nextIndex = index;
				that.animateScrollTo();
			},
			wheelHandler: function(e, delta){
				e.preventDefault();
				var index = curIndex;
				delta = delta || -e.originalEvent.detail / 3 || e.originalEvent.wheelDelta / 120;
				if(wheelAble === false){
					return false;
				}
				if(delta < 0){
					if (index >= that.panels.length - 1)return;
                	index++;
				}else if(delta > 0){
					if (index <= 0)return;
               		index--;
				}else{
					index = 0;
				}
				nextIndex = index;
				that.animateScrollTo();
			},
			init: function() {
				if(ops.renderType === 'outer'){
			        if (ops.scrollbar) {
			          $(window).off('mousedown mouseup scroll');
			          $(window).on('mousedown', _scroll.handleMouseDown);
			          $(window).on('mouseup', _scroll.handleMouseUp);
			          $(window).on('scroll', _scroll.handleScroll);
			        } else {
			          $("body").css({
			            "overflow": "hidden"
			          });
			        }
				}
		        $(document).off('DOMMouseScroll mousewheel');
		        $(document).on('DOMMouseScroll mousewheel', _scroll.wheelHandler);
		    }
		}
		_scroll.init();
	};
	PageSlide.prototype.beforeAnimate = function(){
		var that  = this,
			ops = that.options,
			panels = that.panels,
			configs = that.configs;

		scrollAble = false;
		wheelAble = false;
		$(panels[curIndex]).removeClass('ys-ani');

		if(typeof ops.beforeScroll === 'function'){
			ops.beforeScroll.call(that, curIndex, nextIndex);
		}
	};
	PageSlide.prototype.afterAnimate = function(){
		var that  = this,
			ops = that.options,
			panels = that.panels,
			configs = that.configs;

		wheelAble = true;
		curIndex = nextIndex;
		$(panels[curIndex]).addClass('ys-ani');
		if(typeof ops.afterScroll === 'function'){
			ops.afterScroll.call(that, curIndex);
		}
	};
	PageSlide.prototype.animateScrollTo = function(){
		var that = this,
			me = that.me,
			ops = that.options,
			panels = that.panels,
			configs = that.configs;

		var _move = {
			outer: function(){
				$('html,body').animate({
					scrollTop: configs[nextIndex].scrollTop
				}, ops.scrollSpeed, function(){
					that.afterAnimate();
				});
			},
			inner: function(){
				if(ops.animateClass){
					if(curIndex != nextIndex){
						$(panels[curIndex]).addClass('slide-out');
						$(panels[curIndex]).removeClass('slide-in');
					}
					$(panels[nextIndex]).addClass('slide-in');
					that.afterAnimate();
				}else{
					me.animate({
						top: configs[nextIndex].top
					}, ops.scrollSpeed, function(){
						that.afterAnimate();
					});
				}
			}
		};
		if(configs[nextIndex]){
			that.beforeAnimate();
			_move[ops.renderType]();
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