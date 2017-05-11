### imgSlide 轮播插件  
PC前端轮播插件。提供了核心的轮播方法，控制轮播跳转的方法。减少对相关样式规定，保证一定程度自由化。  
### 自定义配置  
```javascript
var defaults = {
    slider: '.slide-item', // 轮播对象
    timeCyc: 2000, //轮播间隔时间
    animation: 'slide', //轮播方式
    switchSpeed: 600, //轮播切换时间
    easing: '', //动画速度曲线，需引入jquery easing 扩展库
    beforeSwitch: function(){},
    afterSitch: function(){}
};
```  
### 方法调用  
1. 直接跳转到指定轮播项。index 指定轮播项索引
```javascript
$(selector).imgSlide('goTo', index);
```
2. 切换到下一项
```javascript
$(selector).imgSlide('next');
```
3. 切换到上一项
```javascript
$(selector).imgSlide('pre');
```  
### Demo  
1. [HTML元素](https://careycui.github.io/web-utils/demo/img_slide/index.html)
2. [image图片](https://careycui.github.io/web-utils/demo/img_slide/image.html)
3. [自定义导航](https://careycui.github.io/web-utils/demo/img_slide/custom_nav.html)
4. [自定义箭头导航](https://careycui.github.io/web-utils/demo/img_slide/custom_arrow.html)
5. [轮播效果](https://careycui.github.io/web-utils/demo/img_slide/slide_ani.html)
6. [自定义轮播效果](https://careycui.github.io/web-utils/demo/img_slide/custom_slide.html)
