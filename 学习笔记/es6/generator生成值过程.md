1.iterable
2.generator=>iterator
应用
3. 异步
```js
// 模拟请求事件
function foo(){
	setTimeout(()=>{
		console.log(3)
		it.next('hello world')
	},1500)
}

function *main(){
	try{
		console.log(2)
		console.log(yield foo())// 只是暂停了生成器的代码，foo()仍在执行
	}catch(e){
		console.log(e)
	}
}

const it=main()

console.log(1)
it.next() //第一个next()启动生成器

-------
1
2
3
hello world
```
## generator基础
generator的结构和函数的构成相同，只不过声明格式不同，如：`function *foo(){}`或`function*foo(){}`（有无空格）。

我们先看一个generator简单的例子：
```js
let a=1
function *foo(){
	a++
	yield
	console.log(`a:${a}`)
}

function bar(){
	a++
}

// 构造迭代期it控制generator
const it=foo()
// 启动foo()
it.next() // a->2
bar() // a->3
it.next() // 打印： a:3
```
记住！**第一个next()是初始化启动generator**
### 输入输出
#### 1.迭代消息传递
```js
function *foo(x){
	const y=x*(yield)
	return y
}

const it=foo(2)
// 初始化启动*foo()，此时暂停在赋值语句中间
it.next()  // ->{value: undefined, done: false}
// 把3传回被暂停的yield表达式，此时赋值语句为const y=2*3
const res=it.next(3) // ->{value: 6, done: true}
res.value // 6
```
因为第一个`next()`总要启动`generator`，所以`next()`和`yield`并不是一一匹配的吗？
#### 2.双向消息传递
我们从迭代器角度来看`next()`和`yield`的关系：`yield ...`作为一个表达式可以发出消息响应`next(..)`调用，`next(..)`也可以向暂停的`yield`表达式发送值————消息是双向传递的。

改一下上面的例子：
```js
function *foo(x){
	const y=x*(yield 'hello')
	return y
}

const it=foo(2)
it.next() //-> {value: "hello", done: false}
it.next(3) // ->{value: 6, done: true}
```
在generator起始处，我们调用第一个`next()`时，还没有暂停的`yield`来接受这样一个值。第一个`next()`的调用，基本上在提出一个问题：generator `*foo`要给我的下一个值是什么，由第一个`yield 'hello'`来回答这个问题。
### 多个迭代器
在普通的函数中，想要两个函数交替执行是不可能的！要么A函数先运行完毕，要么B函数先运行完毕。

然而，使用generator交替执行显然是又肯能的！
```js
let a=1
let b=2
function *foo(){
	a++
	yield
	b=b*a
	a=(yield b)+3
}

function *bar(){
	b--
	yield
	a=(yield 8)+b
	b=a*(yield 2)
}
```
上面两个generator在共享的相同变量上迭代交替执行，根据迭代器的控制，前面的程序可以产生多种不同的结果。

我们创建一个辅助函数来控制迭代器：
```js
function step(gen){
	let it=gen()
	let last;
	return function(){
		// 不管yield的是啥，下一次都把他传回去
		last=it.next(last).value
	}
}
```
我们来试验交替运行`*foo()`和`*bar()`。
```js
const s1=step(foo)
const s2=step(bar)

s2() // b-- b=1
s2() // yield 8
s1() // a++ a=2
s2() // a=8+b a=9
	 // yield 2
s1() // b=b*a b=9
	 // yield b
s1() // a=b+3 12
s2() // b=a*2 18  这里的a在第四步已经被赋值为9了

console.log(a,b) // 12 18
```
## generator的产生值
在上一节中主要介绍了generator产生值的方式，这一节将介绍一些更基础的东西。
### iterator
假设你要生成一系列的值，每个值与前一个都有特定的关系，这就是一个迭代过程。iterator是一个定义良好的接口，用于从generator中一步步地得到一系列的值，每次想要从generator中得到下一个值的时候需要调用`next()`。
#### 用函数闭包构成迭代器
我们可以用简单的函数闭包构造生成一组数字的迭代过程。
```js
const gimmeSomething = (() => {
	let nextVal;
	return () => {
		if (nextVal === undefined) {
			nextVal = 1
		} else {
			nextVal = (3 * nextVal) + 6
		}

		return nextVal
	}
})()

gimmeSomething() //1
gimmeSomething() //9
gimmeSomething() // 33
...
```
我们再构造一个`next()`接口：
```js
const something=(()=>{
	let nextVal
	return {
		[Symbol.iterator]:function(){return this}, //
		next:()=>{
			if(nextVal===undefined){
				nextVal=1
			}else{
				nextVal=nextVal*3+6
			}
			return {done:false,value:nextVal}
		}
	}
})()
```
##### 自动迭代
es6中新增`for...of`循环，可以自动迭标准迭代器：
```js
for (var v of something) {
	console.log(v)
	if (v > 300) break;
}

// 1 9 33 105 321
```
我们更改下上个例子：
```js
const something = (() => {
	let nextVal
	return {
		[Symbol.iterator]: function() {
			return this
		},
		next: () => {
			if (nextVal === undefined) {
				nextVal = 1
			} else {
				nextVal = nextVal * 3 + 6
			}
			return {
				done: nextVal>300,
				value: nextVal
			}
		}
	}
})()

for (var v of something) {
	console.log(v) // 1 9 33 105
}
```
`for..of..`循环在每次迭代中自动调用`next()`，它不会向`next()`传入任何值，并且会在接受到`done:true`时停止。

除了构造自定义的iterator，数组也有默认的迭代器：
```js
const a=[1,5,15,25]

for (var v of a) {
	console.log(v) // 1,5,15,25
}
```
一般的object是没有像`array`一样的默认迭代器，如果想要迭代一个对象的所有属性的话，通过`Object.keys(..)`返回一个array，之后用`for..of..`迭代这个键名数组（注意：`Object.keys`并不包含来自于原型链上的属性，而`for..in..`则包含）。
### 2.iterable
iterable指的是一个包含可以在其值上迭代的迭代器的对象，他的名称是符号值`Symbol.iterator`，调用这个函数时，他会返回一个迭代器。`for..of`循环自动调用`Symbol.iterator`函数来构建一个迭代器。

对于上一节使用`for..of`迭代数组的例子，就相当于
```js
const a=[1,5,15,25]

const it=a[Symbol.iterator]()

it.next().value //1
it.next().value //5
it.next().value // 15
```
### 3.生成器迭代器
我们可以把genrator看作一个值的生产者，我们通过迭代器接口的`next()`调用一次提取出一个值。

当你执行一个generator时就得到了一个iterator。我们用`generator`实现上一节无限数字序列生产者`something`。
```js
function *something(){
	let nextVal
	while(true){
		if(nextVal===undefined){
			nextVal=1
		}else{
			nextVal=nextVal*3+6
		}
		yield nextVal
	}
}
```
> 通常我们在编写js程序时，使用`while(true)`且其中没有退出语句时是一个非常糟糕的设计，而如果在生成器中有`yield`的话，使用这样的循环完全没有问题！因为生成器会在每次迭代中暂停，通过`yield`返回到主程序或时间循环队列中。

使用`for..of`循环这个生成器：
```js
for(let v of something()){
	console.log(v)
	if(v>300) break; // 1 9 33 105 321
}
```
我们首先要将`generator -> iterator`才能使用`for .. of`迭代，所以先`something()`构造一个生产者来让`for..of..`循环迭代。generator的迭代器iterable也有一个`Symbol.iterator`函数，所以也是一个iterable。
#### 停止生成器
在上面的例子中，generator `*something()`的迭代器实例在循环中`break`后就，似乎永远停留在挂起状态。

事实上，在`for..of`循环的“异常结束”（提前终止），通常由break、return或未捕获异常引起，会向generator的迭代器发送一个信号使其终止。

使用`try..finally..`语句构建generator，即使generator已经在外部结束了，但finally中的语句会被执行，可以在其中清理资源，如：
```js
function *something(){
	try{
	let nextVal
	while(true){
		if(nextVal===undefined){
			nextVal=1
		}else{
			nextVal=nextVal*3+6
		}
		yield nextVal
	}
	}
	finally{
		console.log('clean up')
	}
}

for(let v of something()){
	console.log(v)
	if(v>300) break; // 1 9 33 105 321 'clean up'
}
```
上面的例子中，break会触发finally语句；我们也可以用`it.return()`手动终止生成器的迭代器实例：
```js
const it=something()
for(let v of it){
	console.log(v)
	if(v>300){
		console.log(
			it.return('end up!!').value
			)
		// 无需break
	}
}
// 1 9 33 105 321
// clean up!
// end up!!
```
调用`it.return()`后，他会立即终止生成器，触发finally中的语句，并且将返回的value设置为`return()`中传入的内容，done为true，也就是`end up!`被传出的过程，`for..of`循环终止。
