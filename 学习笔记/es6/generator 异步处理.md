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