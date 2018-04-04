## viewport概念
移动端浏览器通常都在一个比屏幕更宽的虚拟窗口中渲染页面，这个虚拟窗口就是viewport，目的是正常展示没有做移动端适配的网页，可以让他们完整的展现给用户。我们有时用移动设备访问桌面版网页就会看到一个横向滚动条，这里可显示区域的宽度就是viewport的宽度。

## css中的像素和设备像素的区别
在桌面网页开发时，css中的1px就是设备上的1px；然而css中的1px仅仅是一个抽象的值，不代表实际像素为多少；而在移动设备中，不同设备的像素密度是不一样的，css中的1px可能并不等于真实设备的一个像素值。用户缩放也会改变css中的1px代表多少设备像素。这个比例就是devicePixelRatio
```
物理像素/独立像素 = devicePixelRatio
```

我们可以在浏览器中进行缩放，在控制台中打印`window.devicePixelRatio`来查看`devicePixelRatio`的大小。其中的独立像素可以理解为css中的px。

## 视口基础
一个典型的针对移动端优化的站点包含类似下面的内容：
```
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```
以下为viewport的几个属性，这些属性可以混合来使用，多个属性同时使用要用逗号隔开。这里我们展开一个概念，叫做**ideal viewport**，指的是理想情况下的viewport，不需要用户缩放和横向滚动条就能正常查看网页的所有内容，并且能够看清所有文字，无论这个文字在css中定义为多小，显示出来时可以看清的。

属性 | 描述
---|---
`width`|控制视口的宽度，可以指定数字；或设置`device-width`来指定
`height`| 控制视口的高度，这个属性不太重要，很少使用
`initial-scale`| 控制页面最初加载时的在在`idealviewport`下缩放等级，通常设为1，可以是小数
`maximum-scale`| 允许用户的最大缩放值，为一个数字，可以带小数
`minimum-scale`| 允许用户的最小缩放值，为一个数字，可以带小数
`user-scalable`| 是否允许用户进行缩放，值为"no"或"yes", no 代表不允许，yes代表允许
## viewport进阶
### 1.width和initial-scale
当设置了`width`和`initial-scale`时，浏览器会自动选择数值最大的进行适配。如设置：
```
<meta name="viewport" content="width=400, initial-scale=1">
```
浏览器会选择数值大的进行适配，如果当前窗口ideal viewport宽度为300，`initial-scale`值为1，取得是width为400的值；如果当前窗口的ideal viewport为480，则取480。

事实上，`width=device-width`和`initial-scale=1`都代表应用`ideal viewport`，但在ipad、iphone等移动设备和IE上，横竖屏不分，默认都取竖屏的宽度，兼容性最好的写法就是
```
<meta name="viewport" content="width=device-width, initial-scale=1">
```
### 2.动态改变属性
#### a. document.write()
```js
document.write('<meta name="viewport" content="width=device-width,initial-scale=1">')
```
#### b.setAttribute
```js
var mvp = document.getElementById('testViewport');
mvp.setAttribute('content','width=480');
```
## 参考资料
1. [MDN -- 在移动浏览器中使用viewport元标签控制布局](https://developer.mozilla.org/zh-CN/docs/Mobile/Viewport_meta_tag)
2. [移动前端开发之viewport的深入理解](https://www.cnblogs.com/2050/p/3877280.html)