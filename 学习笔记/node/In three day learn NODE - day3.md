# 前言
## 目录
1. 异步编程
2. 一个大示例


# 1.异步编程
异步编程是node最大的特点，虽然也受到众多开发者的诟病，但不会异步编程就不算完全学会node。
## 回调
异步编程的体现为回调，异步编程依托于回调来实现，但并不是回调之后就异步了。。

写一个运行时间较长的函数
```js
function heavyCompute(n,cb){
	let count=0,i,j

	for(i=n;i>0;--i){
		for(j=n;j>0;--j){
			count+=1
		}
	}

	cb(count)
}

heavyCompute(10000,count=>{
	console.log(count)
})

console.log('hello')

------------
100000000
hello
```
从上面的输出结果可以看出，代码中的回调函数仍然先于后续代码执行。没有执行完回调函数是不会运行其他的代码，所以这并不是异步。但是在做运行某个函数的时候，创建一个新的进程或是线程，并与js主线程并行的做一些事情，在事情做完后，直接通知主线程，这情况就又不一样了。
```js
setTimeout(function() {
	console.log('world')
}, 2000)

console.log('hello')
--------
hello
world
```
写前端的都知道上面的执行顺序。这次回调函数后于后续代码的执行了。如上，js本身为单线程的，无法异步执行，因此我们可以认为```setTimeout```这类js规范之外由运行环境提供的特殊函数做的事情时创建一个平行线程后立即返回，让js主进程可以接着执行后续代码，并在收到平行进程的通知后再执行回调函数。除了```setTimeout```、```sertInerval```这些原生的，还包括node中提供了诸如```fs.readFile```这样的异步api。

即便js是单线程的，这决定了js在执行完一段代码之前无法执行包括回调函数在内的别的代码。也就是说，通知js主线程执行回调了，回调函数也要等到js主线程空闲时才能开始执行。
```js

setTimeout(function() {
	console.log('world')
}, 2000)

function heavyCompute(n) {
    var count = 0,
        i, j;

    for (i = n; i > 0; --i) {
        for (j = n; j > 0; --j) {
            count += 1;
        }
    }
}

var t = new Date();

setTimeout(function () {
    console.log(new Date() - t);
}, 1000);

heavyCompute(50000);
```
运行下试试看，本应该在1s后被调用的回调函数因为js主线程忙于其他代码，实际执行时间被大幅延迟。
## 遍历数组
在遍历数组时，使用某个函数依次对数据成员做一些处理也是常见的需求。当函数为异步执行的，数组必须一个一个串行处理，异步函数在执行一次并返回执行结果后才传入下一个数组成员并开始下一轮执行，直到所有数组成员处理完毕后，通过回调方式触发后续代码的执行。如果数组成员可以并行处理，但后续代码仍然需要所有数组处理完毕后才能执行的话，异步代码会调整为一下形式：
```js
(function (i, len, count, callback) {
    for (; i < len; ++i) {
        (function (i) {
            async(arr[i], function (value) {
                arr[i] = value;
                if (++count === len) {
                    callback();
                }
            });
        }(i));
    }
}(0, arr.length, 0, function () {
    // All array items have processed.
}));
```
## 异常处理
**注意**```try...catch``` 只能用于同步执行的代码。异常会沿着代码执行路径一直冒泡，知道遇到第一个try语句时被捕获，但由于异步函数会打断代码执行路径，异步函数执行过程中以及执行后产生的异常冒泡到执行路径被打断的位置时，如果一直没有遇到try语句，则作为一个全局异常抛出。
```js
function async(fn,cb){
	setTimeout(function() {
		console.log('async')
		cb(fn())
	}, 1000)
}

try{
	async(null,()=>{
		console.log('try')
	})
}catch(err){
	console.log(`err:${err.message}`)
}

----------------
C:\Users\mytac\Desktop\test\node_test.js:8
                cb(fn())
                   ^

TypeError: fn is not a function
    at Timeout._onTimeout (C:\Users\mytac\Desktop\test\node_test.js:8:6)
    at ontimeout (timers.js:469:11)
    at tryOnTimeout (timers.js:304:5)
    at Timer.listOnTimeout (timers.js:264:5)
```
因为代码执行路径被打断了，我们就需要在异常冒泡到断点之前用try语句把异常捕获住，并通过回调函数传递被捕获的异常。于是我们可以像下边这样改造上边的例子。
```js
function async(fn, cb) {
	setTimeout(function() {
		try {
			cb(null,fn())
		} catch (err) {
			cb(err)
		}
	}, 1000)
}

async(null,(err,data)=>{
	if(err){
		console.log(`Error:${err.message}`)
	}else{
		console.log('success')
	}
})

-------------
Error:fn is not a function
```
可以看到，异常再次被捕获。node中几乎所有的异步api都像上述方式设计，回调函数第一个参数都是err，因此我们在编写自己设计的异步函数时，也要按照这种方法处理异常，与node设计风格保持一致。

有了异常处理方式后，我们可以接着想一想一般我们怎么写代码。通常我们都是写一个函数做一些事情，然后再调用一些函数，如此循环。如果我们写的是同步代码，只需要在代码入口写一个try语句就可以捕获所以冒泡上来的异常，示例如下：
```js
function main() {
    // Do something.
    syncA();
    // Do something.
    syncB();
    // Do something.
    syncC();
}

try {
    main();
} catch (err) {
    // Deal with exception.
}
```
如果写的是异步代码，由于每次异步调用都会打断代码执行路径，只能通过回调函数来传递异常，于是我们需要在每个回调函数里判断是否有异常发生
```js
function main(callback) {
    // Do something.
    asyncA(function (err, data) {
        if (err) {
            callback(err);
        } else {
            // Do something
            asyncB(function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    // Do something
                    asyncC(function (err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            // Do something
                            callback(null);
                        }
                    });
                }
            });
        }
    });
}

main(function (err) {
    if (err) {
        // Deal with exception.
    }
});
```
我们会看到以上代码嵌套很深，回调函数让代码看起来更加复杂了，而异步方式下对异常的处理加剧了代码的复杂度。
## 域
node提供[domain](http://nodejs.cn/api/domain.html)模块，可以简化异步代码的异常处理。域是一个js的运行环境，如果有一个异常没有被捕获，将作为一个全局异常被抛出。node通过process对象提供了捕获全局异常的方法，示例：
```js
process.on('uncaughtException',err=>{
	console.log(err.message)
})

setTimeout(function(fn) {
	fn()
},1000)
```
全局有个地方可以捕获，对于大多数异常，我们更希望尽早捕获，并根据结果决定代码执行路径。写一个HTTP服务器代码：
```js
function async(req,cb){
	asyncA(req,(err,data)=>{
		if(err){
			cb(err)
		}else{
			asyncB(req,(err,data)=>{
				if(err){
					cb(err)
				}else{
					cb(null,data)
				}
			})
		}
	})
}

http.createServer((req,res)=>{
	async(req,(err,data)=>{
		if(err){
			res.writeHead(500)
			res.end()
		}else{
			res.writeHead(200)
			response.end(data)
		}
	})
})
```
以上代码将请求对象交给异步函数处理后，根据处理结果返回响应。这里使用上文提到的用回调处理异常的方法，因此async内部如果在多几个异步函数的话，代码会嵌套更多。为了让代码变得好看，我们在处理每个请求时，使用```domain```模块创建一个子域。在子域内运行的代码可以随意抛出异常，这些异常可以通过子域对象的error事件统一捕获，改造后的代码如下：
```js
const domain=require('domain')

function async(req,cb){
	asyncA(req,(err,data)=>{
			asyncB(req,(err,data)=>{
					cb(null,data)
			})
	})
}

http.createServer((req,res)=>{
	const d=domain.create()
	d.on('error',()=>{
		res.writeHead(500)
		res.end()
	})

	d.run(()=>{
		async(req,data=>{
			res.writeHead(200)
			response.end(data)
		})
	})
})
```
使用```.create```方法创建一个子域对象，并通过```.run```进入需要在子域中运行的代码的入口点。而位于子域中的异步函数回调函数由于不在需要捕获异常，代码变得整洁了很多。
### 陷阱
无论是通过```process```的```uncaughtException```事件捕获到全局异常，还是通过子域对象```error```事件捕获到了子域异常，在node官方文档里都强烈建议处理完异常后立即重启程序，而不是让程序运行。按照官方的说法时，发生异常后的程序处于一个不确定的状态，不立即退出，会发生内存泄漏，或是其他奇怪的表现。

但```throw..try..catch```异常处理机制并不会导致内存泄漏，也不会让程序的执行结果出乎意料，但node中大量api是用c/c++ 实现的，因此在node运行时，代码执行于js内部和外部，而js抛出异常可能会打断正常的执行流程，导致内存泄漏。因此，使用```uncaughtException```或```domain```捕获异常，代码执行路径里涉及到了内部c/c++代码时，如果不能确定是否会造成内存泄漏的问题，最好在处理完异常后重启程序更好。而使用```try```语句捕获异常时一般捕获到的都是js本身的异常，不用担心上述问题。

## 一个大示例
### 需求说明
我们现在开发的是简单的静态文件合并服务器，支持js和css文件合并请求，请求格式如下：
```
http://assets.example.com/foo/??bar.js,baz.js
```
在以上的url中，```??```代表一个分隔符，之前是需要合并的多个文件的url公共部分，之后是使用```,```分隔的差异部分。服务器再处理这个url时，返回的是以下两个文件按顺序合并后的内容。
```
/foo/bar.js
/foo/baz.js
```
另外，服务器也需要能支持以下格式的普通js或css文件请求。
```
http://assets.example.com/foo/bar.js
```
以上就是整个需求。
### 第一次迭代
我们在第一次迭代中，先实现服务器的基本功能。
#### 设计
简单的分析需求之后，我们会得到以下的设计方案
```
request -->|  parse  |-->|  combine  |-->|  output  |--> response
```
服务器首先会先分析URL，得到请求的文件的路径和MIME类型，然后服务器读取请求的文件，按顺序合并文件内容。最后，服务器返回响应，完成对一次请求的处理。另外，服务器再读取文件时需要个根目录，并且服务器监听的HTTP端口最好不要写死在代码里，做到服务器是可配置的。

```js
const fs=require('fs'),
	  path=require('path'),
	  http=require('http')

const MIME={
	".css":'text/css',
	".js":'application/javascript'
}

// 先分析url，解析出对应的mime类型和完整的路径集合
function parseURL(root,url){
	let base,pathname,parts

	if(url.indexOf('??') === -1){
		url=url.replace('/','/??')
	}

	parts=url.split('??')
	base=parts[0]
	pathnames=parts[1].split(',').map(value=>path.join(root,base,value))
	return {
		mime:MIME[path.extname(pathnames[0])]||'text/plain',
		pathnames:pathnames
	}
}

// 根据解析后的pathnames合并对应的文件
function combineFiles(pathnames,cb){
	let output=[];

	(function next(i,len){
		if(i<len){
			fs.readFile(pathnames[i],(err,data)=>{
				if(err){
					cb(err)
				}else {
						output.push(data)
						next(i+1,len)
					}
				})
			}else{
				cb(null,Buffer.concat(output))
			}
		}(0,pathnames.length));
}

// 启动服务
function main(argv){
	const config=JSON.parse(fs.readFileSync(argv[0],'utf-8')),
		 root=config.root||'.',
		 port=config.port||80

	http.createServer((req,res)=>{
		const {mime,pathnames}=parseURL(root,req.url)
		console.log(`the server is running on ${port}`)

		combineFiles(pathnames,(err,data)=>{
			if(err){
				res.writeHead(404)
				res.end(err.message)
			}else{
				res.writeHead(200,{
					'Content-Type':mime
				})
				res.end(data)
			}
		})
	}).listen(port)
}

main(process.argv.slice(2))
```
以上，我们就实现了需求中所提到的功能
1. 使用命令行参数传递JSON配置文件路径，入口函数负责读取配置并创建服务器
2. 入口函数完整描述了程序的运行逻辑，其中解析URL和合并文件的具体实现封装在其他两个函数里
3. 解析url时先将普通url转换为了文件合并URL，使得两种URL的处理方式可以一致
4. 合并文件时使用异步API读取文件，避免服务器因等待磁盘IO而发生阻塞。

### 第二次迭代
在上一个方法中，我们有了一个可以工作的版本，满足了需求。
```
 发送请求       等待服务端响应         接收响应
---------+----------------------+------------->
         --                                        解析请求
           ------                                  读取a.js
                 ------                            读取b.js
                       ------                      读取c.js
                             --                    合并数据
                               --                  输出响应
```
但我们请求合并输出多个文件时，串行读取文件会比较耗时，服务端响应时间会很长。由于每次响应输出的数据都先缓存再内存中，当服务器请求并发数较大时，会有较大的内存开销。

我们会很容易想到把读取文件的方式从串行改为并行。但是对于机械磁盘而言，因为只有一个磁头，尝试并读取文件只会造成磁盘频繁抖动，反而降低IO效率。对于固态硬盘来说，虽然的确存在多个并行IO通道，但是对于服务器并行处理的多个请求而言，硬盘已经在做IO了，对单个请求采用并行IO无异于拆东墙补西墙。因此，正确的方法不是改用并行IO，而是一边读取文件一边输出响应，把响应输出时机提前至第一个文件的时刻。
```
发送请求 等待服务端响应 接收响应
---------+----+------------------------------->
         --                                        解析请求
           --                                      检查文件是否存在
             --                                    输出响应头
               ------                              读取和输出a.js
                     ------                        读取和输出b.js
                           ------                  读取和输出c.js
```
在第一版的基础上，更改了相关代码如下：
```js
// 判断路径是否为一个文件，并进行错误处理
function validateFiles(pathnames,cb){
	(function next(i,len){
		if(i<len){
			fs.stat(pathnames[i],(err,stat)=>{
				if(err){
					cb(err)
				}else if(stat.isFile()){
					next(i+1,len)
				}else{
					cb(new Error())
				}
			})
		}else{
			cb(null,pathnames)
		}
	}(0,pathnames.length))
}

// 输出文件
function outputFiles(pathnames,writer){
	(function next(i,len){
		if(i<len){
			const reader=fs.createReadStream(pathnames[i]);
			reader.pipe(writer,{end:false}) //end:false->在 reader 结束时结束 writer  默认为true
			reader.on('end',()=>{
				next(i+1,len)
			})
		}else{
			writer.end()
		}
	}(0,pathnames.length))
}

// 启动服务
function main(argv){
	const config=JSON.parse(fs.readFileSync(argv[0],'utf-8')),
		 root=config.root||'.',
		 port=config.port||80

	http.createServer((req,res)=>{
		const {mime,pathnames}=parseURL(root,req.url)


		validateFiles(pathnames,(err,data)=>{
			if(err){
				res.writeHead(404)
				res.end(err.message)
			}else{
				res.writeHead(200,{
					'Content-Type':mime
				})
				outputFiles(pathnames,res)
			}
		})
	}).listen(port)
}
```
### 第三次迭代
经过第二次迭代后，服务器的性能和功能已经得到了基本满足。

但整个服务器也有可能因为外部因素而挂掉。一般在生产环境下都配有守护进程，在服务挂掉的时候立即重启服务。在这个程序中，我们把守护进程作为父进程，服务器程序作为子进程，并让父进程监控子进程的状态，在异常时退出重启子进程。

我们新建一个叫做deamon.js的文件：
```js
const cp=require('child_process')

let worker;

function spawn(server,config){
	worker=cp.spawn('node',[server,config])
	worker.on('exit',code=>{
		if(code!==0){
			spawn(server,config)
		}
	}
}

function main(argv){
	spawn('server.js',argv[0])
	process.on('SIGNTERM',()=>{
		worker.kill()
		process.exit(0)
	})

}

main(process.argv.slice(2))
```
同时，我们也要在server的入口，在收到```SIGNTERM```信号的时候将服务停掉，再正常退出。
```js
// server.js
...
function main(argv){
// ....
	process.on('SIGNTERM',()=>{
		server.close(()=>{
			process.exit(0)
		})
	})
}
```
之后，命令行键入```node deamon.js config.json```启动服务，我们有了守护进程，这个服务就显得靠谱多了~
