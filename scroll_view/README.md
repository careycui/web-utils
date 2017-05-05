## Scroll View 可视窗口随动动画插件  
PC端元素进入可视窗口，即可展示动画效果  
## 功能概述  
当滚动条滚动时，随着元素进入可视窗口，则展示定义好的动画效果。插件提供了回调方法，以便添加扩展。  
```javascript
defaults = {
    container:'', //容器
    delay: 200, //reset 方法执行延迟
    aniClass: '.ani', //动画元素
    loop: false, //元素动画效果是否可以重复展示，true可重复展示，flase只展示一次
    viewPercent: 0.2, //动画元素有效边界
    animateCallback: function(){}, //执行动画后的回调方法
    resetCallback: function(){} //执行reset后的回调方法
}
```
## 快速使用  
加载**aniview**插件后，调用aniview入口方法。  
```javascript
<div class="ani"></div>
<div class="ani"></div>
<div class="ani"></div>
<div class="ani"></div>
...
$.aniView();
```
## Demo
1. [基本使用](https://careycui.github.io/web-utils/demo/scroll_view/index.html)
2. [子节点使用](https://careycui.github.io/web-utils/demo/scroll_view/inner.html)
3. [添加随动导航](https://careycui.github.io/web-utils/demo/scroll_view/nav.html)
4. [结合自定义CSS3](https://careycui.github.io/web-utils/demo/scroll_view/custom.html)
5. [元素动画重复展示](https://careycui.github.io/web-utils/demo/scroll_view/loop.html)