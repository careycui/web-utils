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
	console.log('img slide');
});