## 1. `prototype` 和 `__proto__` 的关系是什么？
`prototype`是只有函数才会有的属性；而`__proto__`是所有对象都有的属性。

几乎所有的函数都有一个`prototype`属性，`prototype`上挂载的所有属性和方法都可以被这个函数的实例继承。


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
是不是看起来很乱？祭上我多年收藏的此图！！OVO

![demo](https://pic.xiaohuochai.site/blog/JS_ECMA_grammer_proto.png)

我们可以使用
## 2. 自有属性和原型属性又是什么？
上面的例子中，在调用`foo.isTestable`时，先会在实例上查询是否有`isTestable`这个属性；如果没有找到，再往它的`__proto__`上查询这个属性；直至查到底层没有则返回`undefined`。
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
console.log(foo.hasOwnProperty('isTestable')) // false
console.log(foo.isTestable) // true 这时又从__proto__上找到isTestable了
// 来，我们把__proto__上面的也删掉
delete foo.__proto__.isTestable
console.log(foo.isTestable) // false， isTestable终于没了
```
当然`hasOwnProperty()`只能知道某个属性是否在实例上，如果我们想要知道某个属性是否在`__proto__`上，就需要自己写一个函数：
```js
 const hasPrototypeProperty=(obj,key)=>(key in obj)&&(!obj.hasOwnProperty(key))
```
## 3. 每个实例之间的关系是什么？
对于以下由一个构造函数创建的实例
```js
function Foo(){}
const foo1=new Foo()
const foo2=new Foo()
```
有下列关系
```js
foo1==foo2 // false,这是因为在这里都指向不同的内存，{}==={} // false
JSON.stringify(foo1)===JSON.stringify(foo2) // true
foo1.constructor===foo2.constructor // true 这里的构造函数都指向Foo，所以为true
foo1.__proto__===foo2.__proto__ // 当然这个也为true
foo1.__proto__===Foo.prototype // true
```
## 参考文档
1. [详解prototype与__proto__区别](https://blog.csdn.net/ligang2585116/article/details/53522741)
2. [一张图理解prototype、proto和constructor的三角关系](https://www.cnblogs.com/xiaohuochai/p/5721552.html)