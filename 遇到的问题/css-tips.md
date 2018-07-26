### 1. 有时候双击或者多次点击一个地方，会自动选中。
下列方法任一解决
```css
// css
body{

-webkit-user-select: none;

  -moz-user-select: none;

  -ms-user-select: none;

  user-select: none; 

}
```
```js
//js
document.onselectstart=new Function("return false");
```
### 2. 绝对定位居中

比如写个组件需要单个元素节点居中，就可以这样写
```html
<div style="position: absolute; left: 50%;">
    <div style="position: relative; left: -50%; border: dotted red 1px;">
      没有宽度<br />
      照样居中，嘿嘿嘿
    </div>
</div>
```
