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
})(jQuery, function($){
	"use strict";

	var _aniView = void 0,
		_elements = [],
		_elements_entry = [],
		_viewPort = {},
		_container = void 0,
		nearest = false,
		defaults = {
			container:'',
			aniClass: '.ani',
			viewPercent: 0.2,
			beforeAnimate: function(){},
			afterAnimate: function(){}
		};

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
	function _nearest(viewBottom, eleTop){
		var cur = Math.abs(eleTop - viewBottom),
			diff = 0,
			flag = true;
		for(var i=0;i<_elements.length;i++){
			if(_isEntryView(_elements[i], true)){
				diff = Math.abs($(_elements[i].ele).offset().top - viewBottom);
				if(cur > diff){
					flag = false;
					break;
				}
			}
		}
		return flag;
	}
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
			eleTop = ele.offset().top,
			eleLeft = ele.offset().left,
			eleBottom = eleTop + ele.height()*viewPercent,
			eleRight = eleLeft + ele.width()*viewPercent,
			result = (eleTop <= viewBottom && eleBottom >= viewTop && eleLeft >= viewLeft && eleRight <= viewRight);
		
		if(!withoutNearest && result && nearest){
			result = _nearest(viewBottom, eleTop);
		}

		return result;
	};
	function _shouldReset(eleObj){
		return (!_isEntryView(eleObj) && eleObj.blocked && eleObj.active);
	};
	function _shouldActive(eleObj){
		return (_isEntryView(eleObj) && !eleObj.blocked && !eleObj.active);
	};
	function _animate(){
		$.each(_elements, function(i, eleObj){
			if(eleObj){
				if(_shouldActive(eleObj)){
					_aniView.animate(eleObj, true);	
				}else if(_shouldReset(eleObj)){
					_aniView.animate(eleObj, false);
				}	
			}
		});
	};
	function AniView(config){
		var options = $.extend({}, defaults, config);

		this.options = options;
		_container = options.container || ($(window));
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
				timer: void 0
			});
		});
	};
	AniView.prototype.animate = function(eleObj,shouldActive){
		var that = this,
			ops = that.options;
		if(shouldActive){
			if(eleObj.blocked){
				return false;
			}
			if(typeof ops.beforeAnimate == 'function'){
				ops.beforeAnimate(eleObj);
			}
			eleObj.active = true;
			eleObj.blocked = true;
			$(eleObj.ele).addClass('active');
		}else{
			$(eleObj.ele).removeClass('active');
			eleObj.active = false;
			eleObj.blocked = false;
			if(typeof ops.afterAnimate == 'function'){
				ops.afterAnimate(eleObj);
			}
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