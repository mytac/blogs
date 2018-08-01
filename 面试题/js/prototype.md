## 1.`prototype` 和 `__proto__` 的关系是什么？
`prototype`是只有函数才会有的属性；而`__proto__`是所有对象都有的属性。

几乎所有的函数都有一个prototype属性，prototype上挂载的所有属性和方法都可以被这个函数的实例继承。

对于
```js
function Foo(){}
const foo=new Foo()
// 注意这里：无论在实例化前后在prototype上添加属性实例都会继承
Foo.prototype.isTestable=true
console.log(foo.isTestable) // true 
```
有
```js
Foo.prototype===foo.__proto__ //true
foo.constructor===Foo // true
Foo.constructor===Function // true
Foo===foo.__proto__.constructor // true
```
## 2. 自有属性和原型属性又是什么
在调用`foo.isTestable`时，先会在实例上查询是否有`isTestable`这个属性；如果没有找到，再往它的`__proto__`上查询这个属性；直至查到底层没有则返回`undefined`。
```js
function Foo(){}
const foo=new Foo()
Foo.prototype.isTestable=true
console.log(foo.isTestable) // true
```

那么如何区分某个对象的属性时其自身的还是继承的呢？我们就需要`hasOwnProperty()`这个方法来确认。

其中`isTestable`这个属性对于`foo`来说就是原型上的属性，所以它返回`false`
```js
foo.hasOwnProperty('isTestable') // false
```
如果我们在`foo`上直接添加`isTestable`这个属性，那么他与`__proto__`上的`isTestable`是否冲突？
```js
function Foo(){}
const foo=new Foo()
foo.isTestable=false
Foo.prototype.isTestable=true

console.log(foo.hasOwnProperty('isTestable')) // true
console.log(foo.isTestable) // false
console.log(foo.__proto__.isTestable) // true
// 删除实例上的isTestable属性
delete foo.isTestable
console.log(foo.isTestable) // true
```

图例

![demo](https://pic.xiaohuochai.site/blog/JS_ECMA_grammer_proto.png)

## 参考文档
1. [详解prototype与__proto__区别](https://blog.csdn.net/ligang2585116/article/details/53522741)