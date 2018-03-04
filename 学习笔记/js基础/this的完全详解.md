## 函数中this的指向
先测一下你是否真的明白了this的指向
```js
foo.count=0
function foo(num){
    this.count++
}

for(let i=0;i<10;i++){
    if(i>5){
        foo(i)
    }
}

console.log(foo.count) //0
```
你可能一脸茫然道：这不是应该输出4吗？？咋输出0捏。（尼克杨脸）

foo是执行了4次没错。但this在任何情况下都不指向函数的词法作用域！！foo中的this指向全局，这是因为**this是在运行时绑定的，并不是在编写时绑定的**。它的上下文取决于函数调用时的各种条件。this的绑定和函数声明的位置没有关系，它只取决于**函数的调用方式**。当一个函数被调用时，会创建一个执行上下文，它包含函数在哪里被调用、函数的调用方式、传入的参数等信息，this就是这个记录的一个属性，在函数执行的过程中会用到。

那我们回到上面的程序，要想让控制台正确打印foo被调用的次数，只要把```this.count++```改为```foo.count++```就好啦~

总的来说呢，就是函数中的this指向什么，取决于这个函数在哪里被调用。
## this的绑定规则
### 1.默认绑定
这是最常用的函数调用类型：独立函数调用，可以把这条规则看作是无法应用其他规则时的默认规则。思考一下下面的代码：
```js
function foo(){
    console.log(this.a)
}
var a=1
foo() // 1
```
因为在全局环境中调用了foo，this.a被解析为全局对象a。这时没有使用任何修饰的函数进行调用，所以实现了this的默认绑定，指向全局对象。
### 2.隐式绑定
调用位置是否有上下文，换句话说是否被某个对象拥有或包含。思考下面的代码：
```js
var a=1
function foo(){
    console.log(this.a)
}
const obj={a:2,foo}
obj.foo() // 2
```
当函数引用由上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象。对象属性的引用链只有最后一层在调用位置中起作用。如：
```js
function foo(){
    console.log(this.a)
}
const obj1={a:1,foo}
const obj2={a:2,obj1}

obj2.obj1.foo() //1
```
#### 隐式丢失
还是看上面那段代码，如果后面加一句：
```js
const bar=obj1.foo
bar() //undefined
```
这就是隐式丢失，```const bar=obj1.foo```这句其实是一个引用，它引用的是foo函数本身。此时的bar其实是一个不带任何修饰的函数调用，因此进行了默认绑定，this指向全局。所以为undefined。

更常见的一种状况发生在传入回调函数时：
```js
function doFoo(fn){
    fn()
}
const obj={a:1,foo}
doFoo(obj.foo) //undefined
```
参数传递也是一种隐式赋值，我们传入函数时fn也是引用的foo函数本身，原理同上个例子。
### 3.显式绑定
显示绑定一般是通过call和apply来实现。我们还是用foo函数来说明。
```js
foo.call(obj1)
foo() //1
```
#### 1.硬绑定
```js
const bar=function (){
    foo.call(obj1)
}
bar() //1
```
这里强制把foo的this绑定到obj上，无论之后如何调用bar，它总会手动在obj上调用foo。这种绑定是一种显式的强制绑定，称之为硬绑定。

硬绑定是一种非常常用的模式，es5提供了内置方法```Function.prototype.bind```，它的用法如下：
```js
function foo(something){
    return this.a+something
}
const obj={a:1}
const bar=foo.bind(obj)

const b=bar(3)
console.log(b) // 5
```
#### 2.API调用的上下文
第三方库的许多函数，以及js语言和宿主环境中许多新的内置函数，都提供了可选的参数，通常被称为上下文，其作用和```bind```一样。

举个例子：
```js
function foo(el){
    console.log(el,this.id)
}
const obj={id:'awesome'}
// 调用foo时把this绑定到obj
[1,2,3].forEach(foo,obj)
// 1 awesome 2 awesome 3 awesome
```
### 4.new绑定
内置对象函数在内的所有函数都可以用```new```来调用，这种函数调用被称为构造函数调用。使用new来调用函数，会自动执行下面的操作：
1. 创建一个全新的对象
2. 这个新对象会被执行prototype连接
3. 这个新对象会绑定到函数调用的this
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

思考下面的代码：
```js
function foo(a){
    this.a=a
}
const bar=new foo(2)
console.log(bar.a) // 2
```
使用new来调用foo时，我们会构造一个新对象并把它绑定到foo调用中的this上。
### 优先级
new绑定 > 显式绑定 > 隐式绑定 > 默认绑定

在new中使用硬绑定，主要是预先设置函数的一些参数，这样在new初始化时，可以传入其余的参数。```bind```的功能之一就是把除了第一个参数（用于绑定this）之外的其他参数都传给下层的参数，这种技术称为**柯里化**。举个例子：
```js
function foo(p1,p2){
    this.val=p1+p2
}
const bar=foo.bind(null,"hello")
const baz=new bar("world")

console.log(baz.val) // helloworld
```
## 绑定例外
### 1. 当我们把null、undefined作为this传入call、apply或bind，这些值在调用时会被忽略，实际应用的是默认绑定规则。
### 2. 间接引用的情况下会应用默认绑定规则。
举个例子：
    ```js
    function foo(){
        console.log(this.a)
    }
    var a=0
    var obj1={a:1,foo}
    var obj2={a:2}
    
    obj1.foo() //1
    (obj2.foo=obj1.foo)() // 0 
    ```
表达式```obj2.foo=obj1.foo```的返回值为目标函数的引用，这里会应用默认绑定。
### 3. 箭头函数
前面介绍的四种规则适用于除了箭头函数之外，所有的普通函数。我们先看看箭头函数的词法作用域：
```js
function foo(){
    // this继承自foo
    return a=>{console.log(this.a)}
}

var obj1={a:1}
var obj2={a:2}

const bar=foo.call(obj1)
bar.call(obj2) // 是1，不是2
```
因为箭头函数会补货调用时```foo()```的```this```。由于```foo()```的this绑定到obj1，bar的this也会绑定到obj1，箭头函数的绑定无法被修改。