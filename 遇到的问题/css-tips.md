1. 有时候双击或者多次点击一个地方，会出现一些蓝色的块。
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