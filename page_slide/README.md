## ysSlide 全屏切换插件  
PC端全屏切换的jQuery插件。  
## 功能概述  
可实现PC端单页全屏滚动效果，可自定义部分参数，提供了回调接口。  
```javascript
defaults = {
	sectionPanel: '.panel', //每屏calss
	scrollSpeed: 600, //滚动速度,当renderType == inner，并且设置了自定义的animateClass，则此值表示整个动画完成的时间
	scrollHeight: $(window).height(), //滚动高度
	nav: false, //是否显示导航
	keyAble: false, //键盘方向键是否可以控制滚动
	delay: 0, //切换的延迟时间,设置可让每屏独立动画播放完成后再切换
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
	animateClass: void 0
};
```
## 快速使用  
#### 引入jquery、ys-slide.js文件
#### HTML  
```
<div class="ysslide" id="ysslide">
	<div class="panel" style="background-color: green;">
		<div class="ani" data-ani="bounceIn"></div>
		first
	</div>
	<div class="panel" style="background-color: #f0f;">
		<div class="ani" data-ani="rotateInDownLeft"></div>
		second
	</div>
	<div class="panel" style="background-color: green;">
		<div class="ani" data-ani="slideInLeft"></div>
		third
	</div>
	<div class="panel" style="background-color: blue;">
		<div class="ani" data-ani="zoomIn"></div>
		fourth
	</div>
	<div class="panel" style="background-color: #f0f;">
		<div class="ani" data-ani="rubberband"></div>
		fifth
	</div>
</div>
```
#### CSS
```
.panel{
	position: relative;
}
```
#### javascript  
```javascript
$('.panel').height($(window).height());
$('#ysslide').ysSlide({});
```  
## Demo  
1. [基本使用](https://careycui.github.io/web-utils/demo/page_slide/index.html)
2. [回调函数](https://careycui.github.io/web-utils/demo/page_slide/callback.html)
3. [自定义导航条](https://careycui.github.io/web-utils/demo/page_slide/custom_nav.html)
4. [自定义切换动画](https://careycui.github.io/web-utils/demo/page_slide/custom_tran.html)  
5. [插入Header Footer](https://careycui.github.io/web-utils/demo/page_slide/header_footer.html)  
6. [显示滚动条](https://careycui.github.io/web-utils/demo/page_slide/scroll.html)