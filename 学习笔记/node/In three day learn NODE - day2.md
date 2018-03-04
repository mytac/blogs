# 前言
目录:
1. 文件操作
2. 网络操作
3. 进程管理


# 1.文件操作
## a.遍历目录
在开发中我们会经常需要找到并处理指定目录下的某些文件时，这时就需要遍历目录。
### 同步遍历
举个例子，我们想得到某个路径下所有子文件路径，需要遍历路径。
```js
var fs = require('fs')
const path = require('path')

function getDirFilePath(dir) {
	fs.readdirSync(dir).forEach((file) => {
		const pathname = path.join(dir, file)
		if (!fs.statSync(pathname).isDirectory()) { // 判断该路径是否为一个文件夹
			console.log(pathname)
		}
	})
}

getDirFilePath("C:/Users/mytac/Desktop/test")
```
然而当该路径上有子文件夹时，以上方法就不可取了，这时，需要递归遍历子文件夹的路径。
```js
function getDirFilePath(dir) {
	fs.readdirSync(dir).forEach((file) => {
		const pathname = path.join(dir, file)
		if (fs.statSync(pathname).isDirectory()) { // 判断该路径是否为一个文件夹
			getDirFilePath(pathname) // 递归遍历子文件夹
		} else {
			console.log(pathname)
		}
	})
}
```
### 异步遍历
如果我们在遍历时使用的是异步的api，这个函数会变的复杂，但实现原理是一样的。具体实现步骤将会在后文介绍。
## b.文本编码
### BOM的移除
[关于BOM](https://baike.baidu.com/item/BOM/2790364)是用来标记一个文本使用的Unicode编码，位于文本文件的头部，在不同的编码下，BOM字符对应的二进制字节如下：
```
    Bytes      Encoding
----------------------------
    FE FF       UTF16BE
    FF FE       UTF16LE
    EF BB BF    UTF8
```
我们可以根据文件前几个字节来判断文件是否包含BOM，以及使用哪种Unicode编码。但是BOM并不是文件内容的一部分，如果读取文本文件时没有去掉BOM，在某些使用场景中就会出现问题。比如说在我们在合并某些js文件时，每个js文件头部都有BOM，会导致解析错误，所以必须要删除BOM，以下为识别和去除BOM的代码
```js
function removeBOM(pathname){
	const bin = fs.readFileSync(pathname)

	if(bin[0]===0xEF&&bin[1]===0xBB&&bin[2]===0xBF){
		bin.slice(3)
	}

	return bin.toString('utf-8')
}
```
### GBK转UTF8
GBK编码不在node本身支持的范围内，所以没有直接可用的方法。通常我们使用[icon-lite](https://github.com/ashtuchkin/iconv-lite)这个库来进行转码。
```js
const iconv=require('iconv-lite')

function readGBKText(pathname){
	const bin=fs.readFileSync(pathname)
	return iconv.decode(bin,'gbk')
}
```
### 单字节编码
通常我们不看文件内容的情况下是无法确定该文件是哪种编码的，以下介绍的方法虽然局限，但非常简单。

大家都知道，一个文件中只有英文字符无论是gbk还是utf-8都能读取。如果文件中有中文字符，但中文字符并不是会产生解析错误的代码，如注释或是字符串。这时我们都可以使用单字节编码来读取文件，因为无论中文为何种编码类型，他对应的字节始终不变
```
1. GBK编码源文件内容：
    var foo = '中文';
2. 对应字节：
    76 61 72 20 66 6F 6F 20 3D 20 27 D6 D0 CE C4 27 3B
3. 使用单字节编码读取后得到的内容：
    var foo = '{乱码}{乱码}{乱码}{乱码}';
4. 替换内容：
    var bar = '{乱码}{乱码}{乱码}{乱码}';
5. 使用单字节编码保存后对应字节：
    76 61 72 20 62 61 72 20 3D 20 27 D6 D0 CE C4 27 3B
6. 使用GBK编码读取后得到内容：
    var bar = '中文';
```
node中提供了```binary```方法来实现以上过程。
```js
function replace(pathname){
	let str=fs.readFileSync(pathname,'binary')
	str=str.replace('foo','bar')
	fs.writeFileSync(pathname,str,'binary')
	return str.toString('utf-8')
}
```
# 2. 网络操作
## a.HTTP
使用[createServer](http://nodejs.cn/api/http.html#http_http_createserver_requestlistener)创建一个HTTP服务器，调用```.listen```方法监听端口。之后，每当一个客户端请求，创建的服务器传入的回调就被调用一次。
```js
const http=require('http')

http.createServer((req,res)=>{ 
	res.writeHead(200,{'Content-Type':'text-plain'})
	res.end('hello world')
}).listen(8888) // 简历了一个http服务器，监听8888端口
```
打开浏览器访问```localhost:8888```就能看到```hello world```了。

HTTP请求本质上是一个数据流，由headers和body组成。以下为一个完整的http请求数据：
```
POST / HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
Host: localhost:8888
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Content-Length: 11
Content-Type: text-plain

Hello World
```
以上，hello world为请求体，hello world以上的内容为请求头。HTTP请求在发送给服务器时，是从头到尾的顺序，一个字节一个字节以数据流的方式发送的。当http服务器接收到完整的请求头后，就会调用回调函数。除了可以使用request对象访问请求头数据外，还可以吧request对象当作一个只读数据流来访问请求体数据。
```js
http.createServer((req,res)=>{
	let body=[]

	console.log(req.method)
	console.log(req.headers)

	req.on('data',chunk=>{
		body.push(chunk)
	})

	req.on('end',()=>{
		body=Buffer.concat(body)
		console.log(body.toString())
	})

	res.end('hello world')
}).listen(8888)
```
在回调函数中，除了可以使用request对象来写入响应头数据，还能把response对象当作一个只写数据流来写入响应体数据。下面的例子，服务端将客户端的请求体数据原样返回给客户端。
```js
http.createServer((req,res)=>{
	res.writeHead(200,{'Content-Type':'text/plain'})

	req.on('data',chunk=>{
		res.write(chunk)
	})

	req.on('end',()=>{
		console.log('end')
		res.end()
	})
}).listen(8888)
```
创建一个客户端，指定请求目标和请求头数据。之后，把request当成一个只写数据流来写入请求体数据和结束请求。
```js
const options={
	hostname: 'www.mytac.cn',
        port: 8888,
        path: '/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
}
const request=http.request(options,response=>{

})

request.write('hello world')
request.end()
```
另外，由于HTTP请求中```GET```是最常见的一种，并且不需要请求体，因此http模块提供了简单的API。
```js
http.get('http://www.example.com/', function (response) {});
```
当客户端发送请求并接收到完整的服务端响应头时，就会调用回调函数。在回调函数中，除了可以使用response对象访问响应头数据外，还能把response对象当作一个只读数据流来访问响应体数据。请看下例：
```js
http.get('http://localhost:8888',res=>{
	let body=[]

	res.on('data',chunk=>{
		body.push(chunk)
	})

	res.on('end',()=>{
		body=Buffer.concat(body)
		console.log(body.toString())
		console.log('req end')
	})
})

http.createServer((req,res)=>{
	res.writeHead(200,{'Content-Type':'text/plain'})

	req.on('data',chunk=>{
		res.write(chunk)
	})

	req.on('end',()=>{
		console.log('end')
		res.end()
	})
}).listen(8888)
```
## HTTPS
HTTPS模块与HTTP模块非常相似，区别在于HTTPS需要额外处理SSL证书。[SSL(sercure socket layer)指安全套接层](https://baike.baidu.com/item/ssl/320778?fr=aladdin)。

创建一个HTTPS服务器：
```js
const options = { 
        key: fs.readFileSync('./ssl/default.key'), // 私钥
        cert: fs.readFileSync('./ssl/default.cer') // 公钥
    };

// 与http.createServer相比，多出一个option对象
const server = https.createServer(options, function (request, response) {
        // ...
    });
```
node支持sni技术，可以根据HTTPS客户端请求使用的域名动态使用不同的证书，因此同一个HTTPS服务器可以与使用多个域名提供服务。接着上面的例子，为https服务器添加多组证书。
```js
const server=https.createServer((req,res)=>{
	res.writeHead(200,{'Content-Type':'text/plain'})

	req.on('data',chunk=>{
		res.write(chunk)
	})

	req.on('end',()=>{
		console.log('end')
		res.end()
	})
}).listen(8888)

server.addContext('mytac.cn',{
	key:fs.readFileSync('./ssl/default.key'),
	cert:fs.readFileSync('./ssl/default.cer')
})
```
在客户端模式下与HTTP几乎没有差别
```js
var options = {
        hostname: 'www.example.com',
        port: 443,
        path: '/',
        method: 'GET'
    };

var request = https.request(options, function (response) {});

request.end();
```
## URL
该模块对URL进行生成、解析、拼接等。
### url的组成
```
                           href
 -----------------------------------------------------------------
                            host              path
                      --------------- ----------------------------
 http: // user:pass @ host.com : 8080 /p/a/t/h ?query=string #hash
 -----    ---------   --------   ---- -------- ------------- -----
protocol     auth     hostname   port pathname     search     hash
                                                ------------
                                                   query
```
### url字符串与url对象的转换
#### url字符串转换为对象
使用[.parse](http://nodejs.cn/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost)将字符串转换为对象
```js
console.log(url.parse('http://nodejs.cn/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost'))
/*
Url {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'nodejs.cn',
  port: null,
  hostname: 'nodejs.cn',
  hash: '#url_url_parse_urlstring_parsequerystring_slashesdenotehost',
  search: null,
  query: null,
  pathname: '/api/url.html',
  path: '/api/url.html',
  href: 'http://nodejs.cn/api/url.html#url_url_parse_urlstring_parsequerystring_
slashesdenotehost' }
*/
```
传给.parse方法的不一定是一个完整的url，比如在HTTP服务器回调函数中，```request.url```不包含协议头和域名，但同样可以用```.parse```解析。当parse传入的第二个参数对象为```true```时，返回的query字段由字符串变成字段；当第三个参数为true时，该方法可以解析没有协议头的URL，这两个参数默认为```false```。
#### URL对象转换为字符串
使用[format](http://nodejs.cn/api/url.html#url_url_format_url_options)方法将对象转换为字符串。
```js
url.format({
    protocol: 'http:',
    host: 'www.example.com',
    pathname: '/p/a/t/h',
    search: 'query=string'
});
/* =>
'http://www.example.com/p/a/t/h?query=string'
*/
```
使用[resolve](http://nodejs.cn/api/url.html#url_url_resolve_from_to)方法将字符串拼接
```js
url.resolve('http://www.example.com/foo/bar', '../baz');
/* =>
http://www.example.com/baz
*/
```
### url参数对象和字符串的相互转换
这里需要queryString模块。 
```js
const queryString=require('querystring')
// 将字符串转换为对象
const str='foo=bar&baz=qux&baz=quux&corge'
console.log(queryString.parse(str))
// ->  { foo: 'bar', baz: [ 'qux', 'quux' ], corge: '' }

// 将对象转换为字符串

const obj={ foo: 'bar', baz: [ 'qux', 'quux' ], corge: '' }
// -> foo=bar&baz=qux&baz=quux&corge=
```
### 数据压缩和解压
这里需要引入```zlib``` 模块。当我们处理HTTP请求和响应时会用到这个模块。

它可以用来压缩HTTP响应体数据。在下面这个例子中，他判断客户端是否支持[gzip](https://baike.baidu.com/item/gzip/4487553?fr=aladdin)，并在支持的情况下使用zlib模块返回gzip之后的响应体数据。
```js
const options={
        hostname: 'localhost',
        port: 8888,
        path: '/',
        method: 'GET',
        headers: {
            'Accept-Encoding': 'gzip, deflate'
        }
    }

http.request(options,res=>{
	let body=[]

	res.on('data',chunk=>{
		body.push(chunk)
	})

	res.on('end',()=>{
		body=Buffer.concat(body)

		if(res.headers['content-encoding']=='gzip'){
			zlib.gunzip(body,(err,data)=>{
				console.log(data)
			})
		}else{
			console.log('not gzip')
		}
	})
}).end()
```
### 创建Socket服务器或Socket客户端
这里要引入```net```模块。接下来我们来演示一下如何从Socket层面来实现HTTP请求和响应。

创建一个HTTP服务器，不论收到什么请求，都返回固定相同的响应。
```js
const net=require('net')

net.createServer(conn=>{
	conn.on('data',data=>{
		conn.write([
			'HTTP/1.1 200 OK',
            'Content-Type: text/plain',
            'Content-Length: 11',
            '',
            'Hello World'
			].join('\n'))
	})
}).listen(8888)
```
下面这个例子是使用socket发起http客户端请求。建立连接后发送了一个http的get请求，通过data事件监听函数获取服务器响应。
```js
const net=require('net')

const options={
	port:'8010',
	host:'127.0.0.1'
}

var client=net.connect(options,()=>{
	 client.write([
            'GET / HTTP/1.1',
            'User-Agent: curl/7.26.0',
            'Host: www.baidu.com',
            'Accept: */*',
            '',
            ''
        ].join('\n'));
})

client.on('data',data=>{
	console.log(data.toString())
	client.end()
})

```
# 3.进程管理
node可以感知和控制自身进程的运行环境和状态，也可以创建子进程并与其协同工作，这使得node可以把多个程序组合在一起共同完成某项工作，并在其中充当胶水和调度器的作用。

举个栗子，使用node调用终端命令简化目录拷贝，在windows下拷贝目录时使用```copy path```，linux下时使用```cp -r source/* target```。
```js
const child_process=require('child_process')
const util=require('util')
const path=require('path')

const dir="C:/testNode"
function copy(source){
	child_process.exec(`copy ${path.normalize(source)}`, function(err,stdout,stderr) {
		if(err){
			throw err
		}
		console.log('stdout',stdout)
		console.log('stderr',stderr)
	})
}

copy(dir)
// -------输出
/* 乱码不知道时啥 应该是复制的文件描述
stdout C:\testNode\1.txt
�Ѹ���         1 ���ļ���

stderr*/
```
## Process对象
[process](http://nodejs.cn/api/process.html)是一个全局变量，不需要```require```引入，提供相关信息，控制当前进程。任何一个进程都有启动进程时使用的命令行参数，有标准输入输出，有运行权限，有运行环境和状态。在node中，通过process对象感知和控制node自身进程的方方面面。
## 方法介绍
1. ```process.platform```返回当前的系统平台
2. ```cwd```返回运行当前脚本的工作目录路径
3. ```abort```立即结束进程
4. ```nextTick```指定下次事件循环首先运行的任务

## child_process模块
使用[child_process](http://nodejs.cn/api/child_process.html)模块可以创建和控制子进程。这个模块中最核心的方法是[child_process.spawn()](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options)，他会异步的衍生子进程，而且不会阻塞node事件循环，他的同步方法为``` child_process.spawnSync() ```，但会阻塞事件循环，直到衍生的子进程退出或终止。其余的api都是针对使用场景对他的进一步封装，算是他的语法糖。
## cluster模块
[cluster模块](http://nodejs.cn/api/cluster.html)允许简单容易的创建共享服务器端口的子进程。它是对```child_process```模块的进一步封装，专门用它来解决web服务器无法充分利用多核cpu的问题。使用该模块可以简化多进程服务器程序的开发，让每个核上运行一个工作进程，并统一通过主进程监听端口和分发请求。
## 结合应用场景来介绍相关api
### a.获取命令行参数
在上文很多个示例中都出现了```process.argv```。命令行参数是从```prcess.argv[2]``开始的，因为第0个为node程序的执行路径，第1个为该文件的路径。
### b.退出程序
程序只有在正常退出时的状态码才为0。当一个程序捕获到异常，但并不想让程序再执行下去，需要程序立即退出，并把状态码设置为指定数字，比如1，如下：
```js
try {
    // ...
} catch (err) {
    // ...
    process.exit(1);
}
```
### c.控制输入输出
node中分别有```process.stdout```,```process.stdin```,```process.stderr```对应标准输出流、标准输入流和标准错误流，前一个为只读数据流，后两个为只写数据流，对他们的操作按照对数据流的操作方式即可。如果想要实现一个```console.log```：
```js
function log(){
	process.stdout.write(
		util.format.apply(util,arguments)
		)
}

log(process.argv.slice(2).join(' '))
==============================
// 输入
$ node node_test.js fuck job
// 输出
fuck job
```
### d.降权
有时候我们需要root权限才能进行某些操作。但一旦执行结束后，继续让程序拥有root权限会存在安全隐患，因此，最好把权限降下来。
```js
http.createServer(options, (req, res) => {
	const env = process.env
	const uid = parseInt(env['SUDO_UID'] || process.getuid(), 10) // 通过从权限的获取方式来获得对应的gid、uid
	const gid = parseInt(env['SUDO_UID'] || process.getgid(), 10)

	process.setgid(gid) // 这两个方法只接受number类型的参数
	process.setuid(uid) // 降权时必须先将gid再降uid
}).listen(8888)
```
### e.创建子进程
创建子进程的例子：
```js
const child_process = require('child_process')
const child=child_process.spawn('node',['child.js'])

child.stdout.on('data',data=>{
	console.log('stdout:'+data)
})

child.stderr.on('data',data=>{
	console.log('stderr:'+data)
})

child.on('close',code=>{
	console.log('child process exited width code '+code)
})
```
新增一个子进程文件child.js
```js
// child.js
console.log('child works')
```
最后将在命令行输出
```
$ node node_test.js
-----------------
stdout:child works

child process exited width code 0
```
我们将child.js改写为一串乱码，这时会抛出错误，并输出：
```
stderr:C:\Users\mytac\Desktop\test\child.js:1
(function (exports, require, module, __filename, __dirname) { sgaduysag
                                                              ^

ReferenceError: sgaduysag is not defined
    at Object.<anonymous> (C:\Users\mytac\Desktop\test\child.js:1:63)
    at Module._compile (module.js:569:30)
    at Object.Module._extensions..js (module.js:580:10)
    at Module.load (module.js:503:32)
    at tryModuleLoad (module.js:466:12)
    at Function.Module._load (module.js:458:3)
    at Function.Module.runMain (module.js:605:10)
    at startup (bootstrap_node.js:158:16)
    at bootstrap_node.js:575:3

child process exited width code 1
```

[.spawn(exec, args, options)](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options)这个方法支持三个参数。第一个参数代表需要执行的命令，第二个参数代表字符串参数列表，第三个参数代表用于配置子进程的执行环境与命令。上例中虽然通过子进程对象的```.stdout```和```.stderr```访问子进程输出，但通过```options.stdio```字段的不同配置，可以将子进程的输入输出重定向到任何数据流上，或者让子进程共享父进程的标准输入输入流，或是直接忽略子进程的输入输出。
### 进程间如何通讯
在linux系统下，进程间可以通过信号相互通信。
```js
// parent.js
const child_process = require('child_process')
const child=child_process.spawn('node',['child.js'])

child.kill('SIGTERM')

// child.js
process.on('SIGTERM',()=>{
	console.log('child run')
	cleanUp()
	process.exit(0)
})
```
上例中，父进程通过```.kill```方法向子进程发送SIGTERM信号，子进程监听process对象的SIGTERM事件响应信号。

当父子进程都是node进程，就可以通过IPC（进程间通讯）双向传递数据。
```js
// parent.js
const child_process = require('child_process')

var child = child_process.spawn('node', [ 'child.js' ], {
        stdio: [ 0, 1, 2, 'ipc' ]
    });

child.on('message', function (msg) {
    console.log(msg);
});

child.send({ hello: 'hello' });

// child.js
process.on('message', function (msg) {
    msg.hello = msg.hello.toUpperCase();
    process.send(msg);
});

// 输出
---------------
{ hello: 'HELLO' }
```
父进程在创建子进程时，在```options.stdio```字段中通过ipc通道，之后就可以监听子进程对象的```message```事件接受来自子进程的消息，并通过```.send```方法发送给子进程，子进程监听```message```事件接受来自父进程的消息。再通过```send```方法向父进程发送消息。
### 守护子进程
守护进程用于监控工作进程的运行状态，在工作进程不正常退出时重启工作进程，保障工作进程不间断运行。在进程非正常退出时，守护进程立即重启工作进程。
```js
function spawn(mainModule){
	const worker=child_process.spawn('node', [mainModule])

	worker.on('exit',code=>{
		if(code!==0){
			spawn(mainModule)
		}
	})
}

spawn('child.js')
```