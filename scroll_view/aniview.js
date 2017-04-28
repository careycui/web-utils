;(function($){
	"use strict";
	/**
	 * 存储页面上需要绑定事件的动画元素
	 *       element is aniview object
	 * @type {Array}
	 */
	var _collections = [],
		uniqueTimer  = void 0;
	/**
	 * 更新动画元素集合
	 * @param  {object} ele jquery object
	 * 
	 */
	var _updateCollections = function(ele){
		_collections.push(ele);
	};
	/**
	 * 私有方法
	 * 			判断元素是否进入视口
	 * @return {boolean} true/false
	 */
	var _enterView = function(ele,marginHeight){
		var viewScreenBottom = $(window).scrollTop()+$(window).height();//屏幕显示区底部距离
		var eleOffset = $(ele).offset(),
			eleTop = eleOffset.top+$(ele).scrollTop(),
			eleBottom = eleOffset.top+$(ele).scrollTop()+$(ele).height();
		
		return (eleTop < (viewScreenBottom+marginHeight))? true : false;
	};
	/**
	 * 滚动条监控事件
	 * 				只绑定一次,每次重新添加动画元素		
	 * @return
	 */
	var _scrolled = function(){
		//存在动画元素时绑定滚动事件
		$(window).on('scroll',function(){
			if(!!uniqueTimer){
				clearTimeout(uniqueTimer);
			}
			uniqueTimer = setTimeout(function(){
				for(var i=0;_collections&&(i<_collections.length);i++){
					(function(i){

						return function(){
							var collection = _collections[i],
							$ele = collection.elem,
							timer = $ele.data('timer'),
							ops = collection.ops;
							if(!timer.blocked && _enterView(collection.parentEle,ops.marginHeight)){
								if(!timer.timerId){

									timer.timerId = setTimeout(function(){
										//TODO 动画效果
										collection._animate();
									}, ops.delayTime);

									timer.blocked = true;
									$ele.data('timer',timer);
								}
							}
						};

					}(i))();
				}
				uniqueTimer = void 0;
			},160);
		});
	};

	_scrolled();

	function Aniview(options,ele){
		var that = this,
			 _default ={
					delayTime: 160,
					marginHeight: 0,
					animation:'default',//extend
					//if animation is 'extend'
					callback:function(){}
			},
			ops = $.extend(_default,options);

		that.ops = ops,
		that.elem = ele;
		that.init();
		that.renderAniWrap();
		that.initAnimate();
		//更新动画元素集合
		_updateCollections(that);
	}

	Aniview.prototype.init = function(){
		var that = this,
			$elem = that.elem;
		//动画元素添加动画标志
		var timer={
			blocked:false,
			timerId: void 0
		};	
		$elem.data('timer',timer);

	};
	Aniview.prototype.initAnimate = function(){
		var that = this,
			ops = that.ops,
			$elem = that.elem,
			timer = $elem.data('timer'),
			$parent = that.parentEle;

		if(_enterView($parent,ops.marginHeight)){
			that._animate();
			timer.blocked = true;
			$elem.data('timer',timer);
		}

	};
	Aniview.prototype.renderAniWrap = function(){
		var that = this,
			$elem = that.elem,
			ops = that.ops;
		$elem.wrap('<div class="av-container"></div>');
		if('default' == ops.animation){
			$elem.css('opacity',0);
		}
		that.parentEle = $elem.parent('.av-container');
	};
	Aniview.prototype._animate = function(){
		var that = this,
			ops = that.ops,
			$elem = that.elem,
			$parent = that.parentEle;
		if(ops.animation == 'default'){
			if($elem.is('[av-animation]') && !($parent.hasClass('av-visible'))) {
	            $elem.css('opacity', 1);
	            $parent.addClass('av-visible');
	            $elem.addClass('animated ' + $elem.attr('av-animation'));
	        }
		}else{
			ops.callback && ops.callback.call(that);
		}
	};
	$.fn.aniView = function(options){
		return this.each(function(){
			var aniViewEle = $.data(this,'aniview');
			if(!aniViewEle){
				var $ele = $(this);
				return $.data(this,'aniview',new Aniview(options,$ele));
			}
		});
	};
})(jQuery);