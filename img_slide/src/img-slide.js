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
		timeCyc: 2000,
		animation: 'slide',
		beforeswitch: function(){},
		afterSitch: function(){}
	};

	function ImgSlide(ele, config){

	}
	//外部可调用方法
 	var public_method = ['moveTo'];
	$.fn.imgSlide = function(config, param){
		return this.each(function() {
            var slider = $.data(this, 'slider');
            if (!slider) {
                return $.data(this, 'slider', new ImgSlider(this, config));
            }
            if (typeof config === "string" && (public_method.join(',').indexOf(config) > -1) && typeof slide[config] == "function") {
                slider[config].apply(slider, param);
            }
        });
	};	
});