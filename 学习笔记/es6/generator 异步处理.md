## 异步迭代生成器
先看一个例子，用于控制异步流程的暂停阻塞
```js
function foo(url){
	ajax(`api/${url}`,(err,data)=>{
		if(err){
			it.throw(err) // 抛出一个错误
		}else{
			it.next(data) // 得到了data再恢复*main()
		}
	})
}

function *main(){
	try{
		const text=yield foo('abc') // 只是暂停了生成器本身的代码，foo一直在执行
		console.log('text',text)
	}catch(e){
		console.log(e)
	}
}

const it=main()
it.next() // 启动
```
### 同步错误处理
从生成器向外抛出错误：
```js
function *main(){
	const x=yield 'hello'
	yield x.toLowerCase()
}

const it=main()
it.next().value
try{
	it.next(1)
}catch(e){
	console.log('e',e)
}
----
e TypeError: x.toLowerCase is not a function
```
手动通过`throw()`给生成器抛入一个错误：
```js
function *main(){
	const x=yield 'hello'
	console.log(x)
}
const it=main()
it.next().value
try{
	it.throw('oops!!')
}catch(e){
	console.log('e',e)
}
-----
e oops!!
```
## generator与promise结合
我们先来看一个例子：
```js
function foo(url){
	// 这里，request是一个promise
	return request(url)
}

function *main(){
	try{
		const x=yield foo('xxx')
		console.log(x)
	}catch(e){
		console.log('e',e)
	}
}

const it=main()
const p=it.next().value
p.then((data)=>{
	it.next(data)
},(e)=>{
	it.throw(e)
})
```
这样看来，创建一个generator似乎是多余的，因为如果不构造迭代器，直接调用foo()，也能按照要求完成请求。在上面的代码中，利用已知`*main()`中只有一个需要支持promise的步骤，有一种方法可以实现重复迭代控制，每次都会生成一个promise，等其决议之后再继续。
### 支持promise的generator runner
#### Promise.resolve()
`Promise.resolve()`常用于创建一个已完成的Promise，可以展开thenable值。这种情况下，返回的Promise采用传入的这个thenable最终决议，可能是完成，也可能是拒绝：
```js
const fulfilledTh={then:(cb)=>cb(42)}
const rejectedTh={then:(cb,errCb)=>{errCb('oops')}

const p1=Promise.resolve(fulfilledTh) // 完成的promise
const p2=Promise.resolve(rejectedTh) // 拒绝的promise
```
如果传入的是真正的promise，`Promise.resolve()`什么都不会做，只会直接把这个值返回。
#### runner
花几分钟研究下下面的代码，他可以重复迭代控制，每次都会生成一个promise，等其决议再继续。
```js
function run(gen) {
	const args = [].slice.call(arguments, 1)
	const it = gen.apply(this, args)

	return Promise.resolve() //创建一个已完成的promise
		.then(function handleNext(value) {
			const next = it.next(value)
			return (function handleResult(next) {
				if (next.done) { // 生成器执行完成
					return next.value
				} else { // 继续执行
					return Promise.resolve(next.value)
						.then(
							// 成功恢复异步循环，把决议值发回生成器
							handleNext,
							// 如果value是被拒绝的promise，把错误传回生成器进行出错处理
							function handleErr(err) {
								return Promise.resolve(it.throw(err)).then(handleResult)
							})
				}
			})(next)
		})
}
```
我们创建一个模拟请求函数`mockRequest`和一个处理所有请求的generator `main`
```js

function mockRequest(data){ // 模拟异步请求
	return new Promise((resolve,reject)=>{
		setTimeout(function() {
			resolve(data)
		}, 1500)
	})
}

function *main(a,b){
	const r1=yield mockRequest('r1')
	console.log(r1)
	const r2=yield mockRequest('r2')
	console.log(r2)
	const r3=yield mockRequest(r1+r2)
	console.log(r3)
}

run(main)
```
这种运行`run()`的方式，他会自动异步运行你传给它的生成器，直至结束。
### 生成器中的promise并发
上面的`main`中，是依次执行的；处于性能考虑他们也应该并发执行。这两个请求是相互独立的，性能更高的方案应该是让他们同时执行。

最自然有效的方法是让异步流程基于promise，特别是基于它们以时间无关的方式管理能力。改造下上面的main:
```js
function *main(a,b){
	const p1=mockRequest('r1')
	const p2=mockRequest('r2')

	const r1=yield p1
	console.log(r1)
	const r2=yield p2
	console.log(r2)
	const r3=yield mockRequest(r1+r2)
	console.log(r3)
}
---
// 同时输出
r1
r2
//等待1.5s
r1r2
```
p1,p2并发执行的用于ajax请求的promise，哪一个先完成都无所谓，因为promise会按照决议保持任意长的时间。接下来的两个yield语句，等待并取得promise决议，如果p1先决议，那么yield p1就会先恢复执行，然后等待yield p2恢复；如果p2先决议，他就会先耐心保持其决议值等待请求，但是yield p1将先会等待，直到p1决议。

不论哪种情况，p1\p2都会并发执行，两者都要全部完成才会发出`r3=yield request...`请求。

这种流程控制类似于`Promise.all([])`工具实现的gate模式相同。
## 生成器委托
### yield委托
先看一个简单的使用场景：从一个生成器*bar()中调用另一个生成器
```js
function *foo(){
	console.log('*foo()')
	yield 3
	yield 4
	console.log('*foo() finished!!')
}

function *bar(){
	yield 1
	yield 2
	yield *foo()
	yield 5
}

const it=bar()
--------
1
2
*foo()
3
4
*foo() finished!!
5
```
在执行到`yield *foo()`时，调用`foo()`创建一个迭代器，然后`yield *`把迭代器实例控制委托给/转移到了另一个 `*foo`迭代器，bar把自己的迭代控制委托给了foo。一旦it迭代器控制小消耗了整个foo迭代器，it就会自动转回控制bar。
### 为什么使用委托
主要目的是代码组织，已达到与普通函数调用的对称。有些情况下是单独调用foo()，另一些情况则有bar()调用foo()。**保持生成器分离有助于程序的可读性、可维护性和可调试性。
### 消息委托
```js
function *foo(){
	console.log('in *foo():',yield 'foo 1')
	console.log('in *foo():',yield 'foo 2')
	return 'return foo'
}

function *bar(){
	console.log('in *bar():',yield 'bar 1')
	console.log('in *bar():',yield *foo())
	console.log('in *bar():',yield 'bar 2')
	return 'return bar'
}

const it=bar()

console.log('outside',it.next().value)
//outside bar 1
console.log('outside',it.next(1).value)
//in *bar(): 1
//outside foo 1
console.log('outside',it.next(2).value)
//in *foo(): 2
//outside foo 2
console.log('outside',it.next(3).value)
// in *foo(): 3
// in *bar(): return foo
// outside bar 2
console.log('outside',it.next(4).value)
// in *bar(): 4
// outside return bar
```
这部分消息委托中需要注意的是在执行到`it.next(3)`时，`'return foo'`并没有一直返回到外部的`it.next(3)`调用；而值`'return foo'`作为`*bar()`内部等待的`yield *foo()`表达式的结果发出---这个yield委托本质上是在所有`*foo()`完成之前是暂停的。所以`'return foo'`作为`*foo()`内的最后结果，并被打印出来。
#### 委托给非生成器
```js
function *bar(){
	console.log('in *bar():',yield 'bar 1')
	console.log('in *bar():',yield *['A','B','C'])
	console.log('in *bar():',yield 'bar 2')
	return 'return bar'
}

const it=bar()
console.log(it.next().value)
// "bar 1"
console.log(it.next(1).value)
//in *bar(): 1
//"A"
console.log(it.next(2).value)
//"B"
console.log(it.next(3).value)
// "C"
console.log(it.next(4).value)
// in *bar(): undefined
// "bar 2"
console.log(it.next(5).value) // 迭代器结束
// in *bar(): 5
// "return bar"
```
默认的数组迭代器不关心通过`next()`调用发送的任何值，（可以理解为他的内部没有接收的语句）；next发送的值2、3、4都被忽略了；因为数组迭代器没有显式的返回值，所以在`yield *['A','B','C']`完成后得到`undefined`。
#### 异常也可以被委托
```js
function *foo(){
	try{
		yield 'B'
	}catch(err){
		console.log('error caught in *foo',err)
	}
	yield 'C'
	
	throw 'D'
}

function *bar(){
	yield 'A'
	try{
		yield *foo()
	}catch(err){
		console.log('error caught in *bar',err)
	}
	yield 'E'
	yield *baz()
	yield 'G'
}

function *baz(){
	throw 'F'
}

const it=bar()
console.log(it.next().value)
// A
console.log(it.next(1).value)
// B
console.log(it.next(2).value)
// C
console.log(it.next(3).value)
// error caught in *bar D
//E
try{
	console.log(it.next(4).value)
}catch(err){
	console.log('error caught outside:',err)
}
// error caught outside:F
```
调用`it.throw(2)`时，他会发送错误消息2到`*bar()`，他又将其委托给`*foo()`，后者捕获并处理他。然后，`yield 'c'`把c发送回去作为`it.throw(2)`调用返回的value。

generator `*foo`中直接throw的值传到 `*bar()`，这个函数捕获并处理它。然后`yield e`把`e`发送回去作为`it.next(3)`调用返回的value。

从`*baz()` throw出来的一场并没有在`*baz()` 中捕获，所以`*baz()` 和`*bar()`都被设置为完成状态。这段代码之后，就再也无法通过任何后续的`next()`调用得到值G，next调用只会给value返回undefined。
### 异步委托
在之前的例子中，我们调用多个生成器的方法，类似于以下代码：
```js
function *bar(){
    const r1=yield request('r1')
    const r3=yield run(foo)
    console.log(r3)
}

function *foo(){
    const r2=yield request('r2')
    const r3=yield request('r3')
    return r3
}

run(bar)
```
在一个生成器内部，使用`run`函数调用`foo`。然而使用yield委托，我们就可以只调用一次run函数了。
```js
...
function *bar(){
    const r1=yield request('r1')
    const r3=yield *foo()
    console.log(r3)
}
...
```
### 递归委托
这段代码的处理还是非常复杂的，大家可以调试跟踪一下。
```js
function* foo(val) {
	if (val > 1) {
		val = yield* foo(val - 1)

	}
	const r = yield mockRequest(val)
	console.log('request', r)
	return r
}

function* bar() {
	const r1 = yield* foo(3)
	console.log(r1)
}

run(bar)

function mockRequest(data) { // 模拟异步请求
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve(data+10)
		}, 50)
	})
}
-----
request 11
request 21
request 31
31
```
## 生成器并发
```js
const res=[]

function *reqData(url){
	const data=yield mockRequest(url)
	// 控制转移
	yield;
	res.push(data)
}


const it1=reqData('1')
const it2=reqData('2')

const p1=it1.next().value
const p2=it2.next().value

p1.then(data=>{
	it1.next(data)
})

p2.then(data=>{
	it2.next(data)
})

Promise.all([p1,p2])
.then(()=>{
	it1.next()
	it2.next()
	console.log('res',res)
})

function mockRequest(data) { // 模拟异步请求
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve(data)
		}, 50)
	})
}
```
以上代码手动让生成器并发，`*reqData`的两个实例确实是并发执行，并且是相互独立的。生成器构建两个迭代器实例，两个实例等待各自的响应一回来就取得了数据；每个实例再次yield，用于控制转移，最后在`Promise.all([p1,p2])`处理函数中选择他们的恢复顺序。