## 类比
比如我们在高峰期去麦当劳点餐，告诉服务员要一个汉堡，服务员给你一个订单收据上面印着2204，告诉你先等着取餐。**这里订单号即为一个Promise**，保证最后我会得到我的汉堡。这时你要拿好你的订单收据，用来拿他和汉堡交换；而且在排队等餐的过程中，你可能会刷刷手机或是和朋友说要一起吃汉堡；你拿到订单号时也不会去想这个汉堡，尽管你很想吃，这是因为你已经把订单号当作了汉堡的占位符；从根本上来说，这个占位符，使这个值不再依赖时间，这是一个**未来值**。最终屏幕上印着取餐单号2204，你拿着订单收据，把他交给收银员，最后换来了汉堡。也就是说，一旦你需要的值（汉堡）准备好了，你就需要用*承诺值*(订单收据)来换取这个值本身。

但也有一种情况是，你去收银台拿汉堡时，服务员说，你要的汉堡卖完了。这时*未来值*还有一个重要特性：他可能成功、也会失败。每次点汉堡时，要么会得到一个汉堡，要么会得到一个售罄消息。

### 现在值与未来值

```js
var x,y=2
x+y // NaN  x没有被决议（resolved）
```
`+`运算符不会等待x，y都准备好，再进行运算。如果有一种方式，来判断两个值的准备状态，如果任何一个没有准备好，就等待二者都准备好，在进行后面的计算。promise为了统一处理现在和将来，所有的操作都成了异步。
### Promise值
用promise改写上述代码，使两个值都准备好后，再进行加法操作。
```js
function add(x,y){
	return Promise.all([x,y])
	.then(values=>values[0]+values[1])
}

// fetchX(),fetchY()返回相应的promise，就绪状态未知
add(fetchX(),fetchY())
.then(sum=>console.log(sum))
```
fetchX和fetchY先直接调用，返回一个promise，传给add。add创建并返回一个Promise，通过调用then等待promise，add加运算完成后，sum已经准备好了（resolve），将会打印出来。

汉堡有可能售罄，程序也可能出错，这时，promise的决议状态为拒绝而不是完成（可能是程序逻辑直接设置的，也有可能是runtime异常隐式得出的值）。

从外部看，由于promise封装了依赖于时间的状态（等待底层值的完成或拒绝，promise本身是与时间无关的），他可以按照可预测的方式组成，不需要开发者关心时序或底层的结果。一旦promise决议，此刻他就成为了外部不可变的值。
### 完成事件
promise可以说是一种在异步任务中的流程控制机制。我们无需知道他要在什么时候开始，什么时候结束；我们只需要在他完成后发起一个通知，得到这个通知后我们来进行下一个任务。如下代码，foo执行完成后，建立一个listener时间通知处理对象；然后建立两个事件监听器，一个监听"completion"，一个监听"failure"。
```js
function foo(){
	// 。。。耗时的工作
	return listener
}
const evt=foo(20)
evt.on('completion',()=>{
	// 进行下一步
})
evt.on('failure',err=>{
	// foo中出错了
})
```
我们可以把这个事件监听对象（evt）提供给代码中多个独立的部分，他们可以独立的得到通知，执行下一步
```js
const evt=foo(20)
bar(evt) // bar()来监听foo的完成
baz(evt) // baz()也可以来监听foo的完成
```
foo()无需知道bar()和baz()是否存在，evt对象就是分离的关注点之间的中立的第三方协商机制，也是promise的一个模拟。
```js
function foo(){
    // 。。。耗时的工作
    // 构造并返回promise
	return new Promise((resolve,reject)=>{
		// 这里的函数会立即执行
	})
}
const p=foo()
bar(p)
baz(p)
```
这里p并不是被传给了bar()和baz()，而是使用p来控制这两个函数何时执行。
## then方法
注意，*所有的委托或值中，都不能存在自定义的then方法*，否则这个值在promise系统中会被误认为是一个thenable，会造成难以追踪的bug!!
### promise值得信任吗
以下给出了，在开发时我们会遇到的问题，以及promise的对应处理方式
#### 调用过早
当promise已经决议后，提供给then()的回调总会被异步调用，不需要自己插入`setTimeout()`。
#### 调用过晚
一旦promise决议后，这个promise上所有通过`then()`注册的回调都会在下一个异步时间点上依次被调用。这些回调中的任何一个都不会影响其他回调的调用，如下：
```js
p.then(()=>{
	p.then(()=>{
		console.log('C') //c无法打断b
	})
	console.log('A')
})
p.then(()=>{console.log('B')})
// A B C
```
#### 回调未调用
没有任何东西可以阻止promise通知他的决议；如果你对一个promise注册了完成回调和拒绝回调，那么在promise决议时**总是会调用其中一个**。

那么，如果promise本身永远不会决议呢？我们可以创建一个用于超时的promise工具，设置超时竞态回调，这将在后面讨论promise api时给出答案。
#### 调用次数过少或过多
正常的调用次数为1，过少为0，即为未被调用；调用过多，如代码中出现多个`resolve()`或`reject()`，那么这个promise将会只接受第一次决议，并忽略后续任何调用！！
#### 未能传递参数/环境值
如果你没有用任何值在promise中显式决议（即没有调用resolve或reject），这个值为undefined；它会被传给所有的注册回调。

或者你要传递多个值，那么就把它们放在数组中进行处理。
#### 吞掉错误或异常
如果在promise创建中，出现了一个javascript一场错误，这个异常会被捕捉，并且使这个promise被拒绝。如下：
```js
const p=new Promise((resove,reject)=>{
	foo.bar() // foo没有被定义，这里抛出错误
	resolve(20)
})
p.then((num)=>{
	// 不会被输出
	console.log(num)
},(err)=>{
	// err会是一个typeerror异常对象
})
```
#### 传入的值是否为一个可信的promise
在上一节提到，不要传入含有`then()`的值！那么，在我们无法确定时该怎样处理呢？

先举个反例：
```js
const p={
	then(cb,errcb){
		cb(20)
		errcb('this is err')
	}
}

p.then(
(val)=>{console.log(val)}, // 20
// 这里不应该被运行啊！
(err)=>{console.log(err)} // this is err
)
```
就像一个普通的函数一样运行了，并不是promise的运行机制。但我们可以用`Promise.resove()`封装下，就会得到期望的结果。
```js
Promise.resolve(p)
	.then(
		(val)=>{console.log(val)},
		// 永远不会到达这里！
		(err)=>{console.log(err)} 
		)
```
### 链式流
我们可以把多个promise连接到一起表示一系列异步步骤，这是基于promise的两个固有行为特性：
> 每次对promise调用then，都会创建并返回一个新的promise，我们可以将其链接起来
> 不管从then()调用的完成回调（第一个参数）返回的值是什么，都会被自动设置为被链接的promise的完成。

如下，我们很容易把promise连接到一起：
```js
const p=Promise.resolve(10)
	p.then((val)=>{return val*2})
	p.then((val)=>{console.log(val)}) // 20
```
并且，不论我们想要多少个异步步骤，每一步都能根据需要等待下一步；当然，如果不显式返回一个值，就会隐式返回undefined。 
```js
const p=Promise.resolve(10)
	p.then((val)=>{
		return new Promise((resolve,reject)=>{
			setTimeout(()=>{
				resolve(val*2)
			},500)
		})
	}).then((val)=>{console.log(val)}) // 20
```
在链式调用中，如果在某个步骤上出现了错误，则会在最近的`reject`上处理，如果没有，则会抛出错误。
```js
const p=Promise.resolve(10)
	p.then((val)=>{ //第一个then
		return new Promise((resolve,reject)=>{
			resolve(val*2)
			foo.bar() // 这里不会执行，因此并不抛出错误，最后打印60
		})
	})
	.then((val)=>{ // 第二个then
		return val*3
	},
	()=>{
		console.log('oops!!')
	})
	.then(val=>{ // 第三个then
		console.log(val)
	},
	()=>{
		console.log('oops!!2')
	})

```
如果将`resolve(val*2)`和`foo.bar()`换个位置，`foo.bar`没有声明，此时promise决议为拒绝状态，因为没有设置reject值，所以向下传递undefined值；在向下遇到的首个reject（第二个then中的reject）被捕捉，输出`oops!`；由于这个then节点没有出现错误，也没有返回值，则向下传递，直到被第三个then中的resolve捕捉，输出`undefined`。

如果将`foo.bar()`放到第二个`then`中，则会打印`'oops!!2'`；将`foo.bar()`放到第三个`then`中，其后面的链没有`reject`，则会抛出错误。
### 错误处理
我们比较熟悉的`try..catch`只能是同步的，无法用于异步代码模式。

但从上一节我们也知道promise是可以捕捉到异步错误，但必须是在出错的地方的下一链中有`reject`才会进行处理，否则只能抛出错误。对此，许多开发者常使用如下的实践，来解决上述问题:
```js
const handleErrors=(err)=>{console.log(err)}
const p=Promise.resolve(10)
p.then((val)=>{
	foo.bar()
	return val*2
})
.catch(handleErrors)
```
但这个处理方法并不全面，如果handleErrors中有错，promise中的错误也不能被成功捕获。

还有一种解决方法是，设置一个定时器，在拒绝的时候启动，如果promise被拒绝，而在定时器出发之前都没有出错处理函数被注册，呢么他就不会注册处理韩式，进而就是未被捕获错误。再多种库中这个方法运行良好，但设置定时时间太随意了，如果处理某些请求真的pending了很长时间，这个方法显得并不那么可靠。
### promise模式
#### 1.Promise.all([..])
多个任务完成后再继续执行更多操作。在promise链中，任意时刻都只能有一个异步任务正在执行，想要同时执行两个或更多步骤（并行执行），必须使用**门**来创建。

门要等待两个或更多并行/并发的任务都完成才能继续。完成顺序并不重要，但必须都得完成，门才能打开并让流程控制继续。
```js
Promise.all([p1,p2])
.then(msgs=>{
    // 这里的msg也是一个数组，分别为p1、p2的完成消息
})
```
需要注意的是，p1、p2中，如果有任何一个被拒绝的，主Promise.all()就会立即被拒绝，并丢弃来自其他所有promise的全部后果。
#### 2.Promise.race([])
这个api指的是竞态，传统模式是称为**门闩**，即只响应第一个执行完成的promise。

与Promise.all()相似，一旦有任何一个promise决议为完成，promise.race()就会完成；一旦有任何一个promise决议为拒绝，他就会拒绝。如果传入了空数组，则永远不会被决议。

我们可以用它来检测一个请求是否超时：
```js
Promise.race([
request(),
timeoutPromise()
])
.then(()=>{
    // request按时完成
},
err=>{
    // request()被拒绝或超时!!
}
)
```
### 并发迭代
有时候需要再一列promise中迭代，并对所有promise都执行某个任务。其实就像是同步数组迭代，但改成了异步。使用`map`迭代promise（或其他任何值），再每个值上运行一个函数作为参数。`map`本身返回一个`promise`，其完成值是一个数组，该数组保持映射顺序，保存任务执行之后的异步完成值：
```js
Promise.map((vals,cb)=>{
    return Promise.all(
        vals.map(val=>
            new Promise(resolve=>cb(val,resolve))
        )
    )
})
```
在以上的map实现中，不能发送异步拒绝拒绝信号，但如果在映射的回调cb中，出现同步的异常或错误，主Promise.map()返回的promise就会拒绝。
## Promise的局限性
promise看似神奇，解决了很多异步回调的问题，使代码清晰可靠。但万事没有百分百完美的，promise也有自身的局限性。
### 1.顺序错误处理
由于promise的链接方式，promise中的错误很容易被无意中默默忽略掉。如果构建了一个没有错误处理的promise链，链中任何地方都会在链中一直传递下去，直到被查看（通过在某个步骤注册拒绝处理函数）。
### 2.单一值
promise只能有一个完成值或一个拒绝理由。在简单的应用中，这不是什么问题；但是在复杂的场景中，你就会发现这是一种局限。
如果需要处理多个值，直接将多个值封装成promise，并把它们放到数组中，使用`Promise.all()`来进行处理。
### 3.单决议
promise只能被决议一次，如果将某个事件绑定，放到promise中，如下例。如果按钮响应只点击一次，这种方式才能运作。点击第二次，promise已经决议，所以第二次调用`resolve()`就会被忽略。如下例，只会再第一次点击时打印50，之后的点击`resolve`被忽略。
```js
function click(ele,event){
	document.getElementById(ele).onclick=event
}

const request=()=>new Promise((resolve,rej)=>{
	resolve(50)	
})

const p=new Promise((resolve,reject)=>{
	click('test',resolve)
})

p.then(evt=>request())
.then(text=>{console.log(text)})
```
### 4.无法取消的promise
如果建立了一个promise并为其注册了完成或拒绝处理函数，如果出现某种情况使这个任务悬而未决的话，也没有办法从外部停止他的进程。

考虑前面的超时场景：使用`Promise.race()`设置一个定时器，到时则抛出错误。
### 5.promise的性能问题
promise做的工作比自身建立的回调方案，要慢一些。但promise值得信任，损失微小的的性能但能让整个系统可信任性和组合性更高；代码条理也更加清晰。


