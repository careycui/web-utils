(function($, factory){
	if (typeof define === 'function') {
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
})(jQuery, function($){
	"use strict";

	var _aniView = void 0, //插件实例-单例
		_elements = [], //所有动画元素element
		_elements_entry = [], //进入视口的动画元素，配合nearest使用
		_viewPort = {}, //视口对象
		_container = void 0, //插件容器
		nearest = false, //是否采用就近模式，严格模式，同一时间只存在一个活动元素
		_loop = false,
		//默认配置
		defaults = {
			container:'', //容器
			delay: 200, //reset 方法执行延迟
			aniClass: '.ani', //动画元素
			loop: false, //元素动画效果是否可以重复展示，true可重复展示，flase只展示一次
			viewPercent: 0.2, //动画元素有效边界
			animateCallback: function(){}, //执行动画后的回调方法
			resetCallback: function(){} //执行reset后的回调方法
		};
	/**
	 * 获取插件容器页面位置
	 * @return {Object}
	 */
	function viewPortSize(){
		if(_container && _container[0].document !== window.document){
			var offset = _container.offset();
			return {
				top: _container.scrollTop() + offset.top,
				left: _container.scrollLeft() + offset.left
			};
		}else{
			return {
				top: _container.scrollTop(),
				left: _container[0].pageXOffset
			};
		}
	}
	function atTop(){
		var port = viewPortSize();
		return (port.top <= 10?true:false);
	}
	function atBottom(){
		var docHeight,
			height,
			port = viewPortSize();

		if(_container && _container[0].document !== window.document){
			docHeight = window.document.documentElement.offsetHeight;
			height = window.document.documentElement.clientHeight;
		}else{
			docHeight = _container[0].offsetHeight+_container[0].scrollTop;
			height = _container[0].clientHeight;
		}

		return ((port.top + height)>=(docHeight-10)?true:false);
	}
	/**
	 * 当可视窗口中存在多个动画元素时，并且nearest==true时，取离可视窗口底部最近的动画元素
	 *		一般用来做页面分区导航
	 * @param  {number} viewBottom 视口底部位置数据
	 * @param  {number}	eleTop 元素top数据
	 * @return {boolean}
	 */
	function _nearest(viewBottom, eleTop){
		var cur = Math.abs(eleTop - viewBottom),
			diff = 0,
			flag = true,
			tmp,
			tmpTop;

		for(var i=0;i<_elements.length;i++){
			if(_isEntryView(_elements[i], true)){
				tmp = $(_elements[i].ele);
				tmpTop = _getOffset(tmp[0]).top + tmp.height()*_elements[i].viewPercent
				diff = Math.abs(tmpTop - viewBottom);
				if(cur > diff){
					flag = false;
					break;
				}
			}
		}
		return flag;
	}
	function _getOffset(eleDom){
		var offsetTop = eleDom.offsetTop;
		var offsetLeft = eleDom.offsetLeft;

		while(eleDom.offsetParent){
			eleDom = eleDom.offsetParent;
			if(!isNaN(eleDom.offsetTop)){
				offsetTop += eleDom.offsetTop;
			}
			if(!isNaN(eleDom.offsetLeft)){
				offsetLeft += eleDom.offsetLeft;
			}
		}
		return {
			top: offsetTop,
			left: offsetLeft
		}
	}
	/**
	 * 判断元素是否进入到可视窗口，并确定是否需要计算符合最近的要求
	 * @param  {Object}	eleObj 动画元素对象
	 * @param  {Boolean} withoutNearest 是否需要计算符合最近要求
	 * @return {Boolean}
	 */
	function _isEntryView(eleObj, withoutNearest){
		var ele = $(eleObj.ele),
			viewPercent = eleObj.viewPercent,
			_viewer = viewPortSize(),
			// 视口边界
			viewTop = _viewer.top,
			viewLeft = _viewer.left,
			viewBottom = viewTop + _container.height(),
			viewRight = viewLeft + _container.width(),
			// 元素边界
			eleOffset = _getOffset(ele[0]),
			eleTop = eleOffset.top + ele.height()*viewPercent,
			eleLeft = eleOffset.left + ele.width()*viewPercent,
			eleBottom = eleOffset.top + (1 - viewPercent)*ele.height(),
			eleRight = eleOffset.left + (1 - viewPercent)*ele.width(),
			result = (eleTop <= viewBottom && eleBottom >= viewTop && eleLeft >= viewLeft && eleRight <= viewRight);

		if(!withoutNearest && result && nearest){
			if(atTop()){
				result = _nearest(viewTop, eleTop);
			}else if(atBottom()){
				result = _nearest(viewBottom, eleTop);
			}else{
				result = _nearest(viewBottom, eleTop);
			}
		}

		return result;
	};
	/**
	 * 是否重置动画元素
	 * @param  {Object}
	 * @return {Boolean}
	 */
	function _shouldReset(eleObj){
		return (!_isEntryView(eleObj) && eleObj.blocked && eleObj.active);
	};
	/**
	 * 是否激活动画元素
	 * @param  {Object}
	 * @return {Boolean}
	 */
	function _shouldActive(eleObj){
		return (_isEntryView(eleObj) && !eleObj.blocked && !eleObj.active);
	};
	/**
	 * 动画处理函数
	 * @return
	 */
	function _animate(){
		$.each(_elements, function(i, eleObj){

			if(eleObj){
				if(_shouldActive(eleObj)){
					_aniView.animate(eleObj, true);
				}else if(_loop && _shouldReset(eleObj)){
					_aniView.animate(eleObj, false);
				}
			}
		});
	};
	//scroll view 对象
	function AniView(config){
		var options = $.extend({}, defaults, config);

		this.options = options;
		_container = options.container || ($(window));
		_loop = options.loop;
		nearest = (options.nearest !== undefined?options.nearest:false);

		this.init();
		_container.on('scroll', function(){
			_animate();
		});
	}
	AniView.prototype.init = function(){
		var that = this,
			ops = that.options,
			aniClass = ops.aniClass;

		$(aniClass).each(function(i,ele){
			_elements.push({
				ele: ele,
				viewPercent: ops.viewPercent,
				active: false,
				blocked: false,
				animation: $(ele).data('viewAnimation'),
				callback: {
					starter: void 0,
					timer: void 0
				}
			});
		});
	};
	AniView.prototype.animate = function(eleObj,shouldActive){
		var that = this,
			ops = that.options,
			diff = 0;
		if(shouldActive){
			if(eleObj.blocked){
				return false;
			}
			eleObj.active = true;
			eleObj.blocked = true;

			$(eleObj.ele).addClass('active');
			if(eleObj.animation){
				$(eleObj.ele).addClass(eleObj.animation);
			}
			if(typeof ops.animateCallback == 'function'){
				ops.animateCallback(eleObj);
			}
		}else{
			if(!eleObj.blocked){
				return false;
			}
			eleObj.active = false;
			eleObj.blocked = false;

			if(eleObj.callback.timer){
				diff = new Date().getTime() - eleObj.callback.starter;
				clearTimeout(eleObj.callback.timer);
			}else{
				eleObj.callback.starter = new Date().getTime();
			}
			eleObj.callback.timer = setTimeout(function(){
				$(eleObj.ele).removeClass('active');
				if(eleObj.animation){
				$(eleObj.ele).removeClass(eleObj.animation);
			}
				if(typeof ops.resetCallback == 'function'){
					ops.resetCallback(eleObj);
				}
				eleObj.callback.timer = void 0;
			},Math.abs(ops.delay - diff));
		}
	};
	$.extend({
		aniView:function(config){
			if(!_aniView){
				_aniView = new AniView(config);
				_animate();
			}
		}
	});
});