# ES6 Temporal Dead Zone
## 什么是暂存死区
暂存死区TDZ(Temporal Dead Zone)是ES6中对作用域新的语义。他关系到let、const和var声明变量的区别。
在程序的控制流程在新的作用域进行实例化时，在此作用域中用let、const声明的变量会在该作用域中先创建，但这个时候还没有进行词法绑定，没有进行对声明语句的求值运算，所以是不能访问的，访问会抛出错误。所以在这运行流程一进入作用域创建变量，到变量开始可被访问的一段时间，就称为TDZ。

## let暂存死区的错误
大家都知道，使用var声明变量，有变量提升，如下：
```js
	console.log(a)//undefined
	var a=1
```
他等同于
```js
var a
console.log(a)
a=1
```
let和const使用区块作用域，使用let声明a变量，会报错：
```js
console.log(a) //Uncaught ReferenceError：a is not defined
///// 以上区域则为暂存死区
	let a=1
```
是因为let声明不会被提升到当前执行上下文的顶部。该变量属于从块开始到初始化处理的“暂存死区”。

再用一个更明显的例子来说明：
```js
switch (1) {
  case 0:
    let foo;
    break;
    
  case 1:
    let foo; // TypeError for redeclaration.
    break;
}
```
switch中只有一个块，所以会报错。

我们再看for循环，
```js
    let a=0
	for(let a;a<5;a++){
		console.log(a) //什么都不会输出，因为这时a为undefined，undefined<5为false，所以不会打印任何内容
	}
```
但如果把上述程序中的```let```改成```var```则会正确打印0,1,2,3,4。
## 与词法作用域结合的暂存死区
由于词法作用域，表达式```a+2```中的a会解析为if块中的a，而不是引用值为1的a。
```js
function main(){
	var a=1
	if(true){
		let a=a+2 // ReferenceError: a is not defined
	}
}
```
我们使用立即执行函数复习一遍，a=2这个表达式不会被提升，所以会报错。
```js
let a=1
(function(){
	console.log(a) //a is not defined
	// 以上区域为暂存死区
	let a=2
}())
```
## 相关资料
[MDN Web Docs -- let](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)