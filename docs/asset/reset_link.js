(function(){
	var links = document.getElementsByTagName('a');
	var i = 0;
	for(i;i<links.length;i++){
		links[i].setAttribute('target', '_blank');
	}
})();
