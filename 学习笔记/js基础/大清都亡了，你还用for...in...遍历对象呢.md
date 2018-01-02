哈哈，标题党一枚。这篇文章是介绍对象的枚举性和几个用于遍历对象方法的。
## 枚举
不太了解对象的几个属性描述符的，[请阅读这篇文章](https://github.com/mytac/blogs/blob/master/%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/js%E5%9F%BA%E7%A1%80/%E5%85%B3%E4%BA%8E%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E4%BD%A0%E5%BA%94%E8%AF%A5%E7%9F%A5%E9%81%93%E7%9A%84%E4%BA%8B.md)。

在上面这篇文章中，我们针对`enumberable`特性简单说了什么是可枚举性，我们可以针对对象的某个属性设置其`enumberable`布尔值来控制它的可枚举性。概括的说，可枚举就是可以出现在`for...in..`循环中，可以在对象属性的遍历中出现。
```js
const obj={a:1,b:2}
Object.defineProperty(obj,'b',{
	enumerable:false
})
console.log('b' in obj) // true
for(let k in obj){
	console.log(k,obj[k]) // a 1
}
```
如上例，b确实是存在并且可访问，但并不会出现在`for...in...`中。

正如标题所说，不要使用`for...in...`遍历对象了，所以要用另一种方式区分属性是否可枚举：
```js
const obj={a:1,b:2}
Object.defineProperty(obj,'b',{
	enumerable:false
})
console.log(obj.propertyIsEnumerable('b')) // false
console.log(Object.keys(obj)) // ['a']
console.log(Object.getOwnPropertyNames(obj)) ['a','b']
```
`propertyIsEnumerable`会检查给定的属性名是否存在于对象中（并非原型链上）并且可枚举。

我们也可以从上例中看出，`Object.keys`和`getOwnPropertyNames`两者的区别。前者是返回可枚举的属性，后者是返回所有的属性。
## 遍历
### 1.for...in...
它可以遍历对象的可枚举属性列表，包括原型链。使用它遍历对象是无法直接获取属性值的，需要手动绑定对象属性指向值。
### 2.for...of...
ES6中增加了一种遍历数组的语法，他是直接遍历值，而不是数组下标，当然如果对象本身定义了迭代器也可以遍历对象。
```js
const arr=[1,2,3]
for(let v of arr){
	console.log(v)
}
// 1
// 2
// 3
```
和数组不同，普通的对象没有内置的迭代器，所以无法通过```for...of...`遍历。我们可以给项便利的对象定义` @@iterator`（迭代器）。
```js
const obj={a:1,b:2}
Object.defineProperty(obj,Symbol.iterator,{ 
	value(){
		const o=this
		let idx=0
		const keys=Object.keys(o)
		return {
			next(){
				return {
					value:o[keys[idx++]],
					done:(idx>keys.length)
				}
			}
		}
	}
})
``` 
也可以直接在定义对象时进行声明：
```js
const obj={a:1,b:2,[Symbol.iterator](){
	const o=this
		let idx=0
		const keys=Object.keys(o)
		return {
			next(){
				return {
					value:o[keys[idx++]],
					done:(idx>keys.length)
				}
			}
		}
}}
```
我们来手动遍历对象：
```js
const it=obj[Symbol.iterator]()
console.log(it.next()) // {value: 1, done: false}
console.log(it.next()) // {value: 2, done: false}
console.log(it.next()) // {value: undefined, done: true}
```
使用`for...of...`遍历
```js
for(let v of obj){
	console.log(v)
}
// 1
// 2
```
### 3.Object.keys
如果是使用过airbnb的eslint规范的人都知道，使用`for...in...`遍历对象属性会报语法错误。我们通常的解决方法就是用```Object.keys```得到包含可枚举的属性名数组，再使用`forEach`进行遍历。
```js
const obj={a:1,b:2}
const keys=Object.keys(obj)
keys.forEach(key=>{console.log(obj[key])})
// 1
// 2
```
