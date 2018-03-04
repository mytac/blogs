# 1.前言
目录：
1. 安装(就不说了，网上去找)
2. 模块
3. 代码的组织和部署
4. 文件操作

本文的命令行为 
```
$ node node_test.js test.py test.py1
```

```process.argv[2]``` 为 ```test.py```。

有疑问或是文章中有错误的地方，请在评论区指出来，如果私信的话别人就看不到了，加油一起进步~~(゜▽゜*)♪

# 2.模块
每一个文件就是一个模块，文件的路径就是模块名。在每个模块中，都有```require```、```exports```、 ```module```这三个变量可以使用。

一个模块的代码只在初始化时执行一次，之后被缓存以供重复调用。
## a.require
一个方法，用于在一个模块中，加载另一个模块的，返回一个导出对象。建议传入相对路径而不是绝对路径。
```js
const foo1 = require('./foo') // .js文件扩展名可以忽略
const data = require('./data.json') //也可以加载json文件
```
## b.exports
一个对象，是当前模块的导出对象，用于导出方法或属性，其他模块使用```require```方法可以调用当前模块的导出对象。
```js
exports.sayName=function(name){
    console.log('Hi' +name)
}
```
## c.module
一个对象，可以访问当前模块的相关信息，[点击查看他的相关属性](http://nodejs.cn/api/modules.html)。最多的用途是用来替换当前模块的导出模块，他的默认导出值为空对象，这时我们来将他改成一个函数。
```js
module.exports = function () {
    console.log('test');
};
```
## d.主模块
node只有一个入口文件称为主模块，需要调用命令行来启用的。
```
node main.js
```
在一个文件中多次调用相同模块时，被引入的模块的内部变量只初始化一次，不会开辟新的内存。
# 3.代码的组织和部署
## a.模块的路径解析规则
从上一章我们知道了```require```支持相对路径和绝对路径。但这种引入方式在后期维护上如果修改了某个文件的存放位置，在引用它的文件中也要随之修改相关路径，牵一发而动全身。```require```还有第三种的路径写法。
### 内置模块
内置模块没有路径解析，直接返回模块的导出对象
```js
const fs=require('fs')
```
### node_modules
大部分第三方模块都安装于此目录下，在引入时直接忽略node_modules文件夹之前的路径，直接引入就好。

比如该路径为：
```
/mytac/node_modules/app
```
引入时
```
const app=require('app')
```
### NODE_PATH环境变量
定义NODE_PATH环境变量，如
```
NODE_PATH=/a/b/c
```
当引用```require('file')```时，node会尝试以下路径
```
/a/b/c/file
```
## b.包
由多个子模块组成的模块称为包，把所有子模块放在同个目录下，写过npm包的人会知道，这个大模块需要一个入口文件。如果入口文件名为index的话，在引入时直接写之前的路径就好了，如：
```
const app=require('application')
// 等价于
const app=require('application/index')
```
## c.命令行
举个栗子，希望有一个命令行程序，传入相关参数，并将他打印出来
```
$ node myapp/src/util/node-echo.js Hello world
Hello world
```
这种使用方法不太像是一个命令行程序，下面才是我们期望的方式
```
$ node-echo Hello world
```
### Linux
在Linux下，我们可以把js文件当作shell脚本来执行，为了达到上述效果，步骤：

1. 在shell脚本中，通过```#!```注释指定当前脚本的解释器，首先在node-echo.js文件顶部增加这条注释，证明该脚本需要node来解析。
```
#! /myapp/src/util/env node
```
2. 赋予node-echo.js文件执行权限
```
$ chmod +x /myapp/src/util/node-echo.js
```
3. 在PATH环境变量下指定某个目录，比如要在```/myapp/src/util/```下创建一个软链文件，文件名与我们希望使用的终端命令同名，命令如下：
```
$ sudo ln -s /myapp/src/util/node-echo.js /myapp/src/util/node-echo
```
这样处理过后，可以在任意目录下使用```node-echo```命令咯~
### Windows
windows下与Linux完全不同，需要.cmd文件来解决问题。假如node-echo.js存放在```C:\myapp\src\util```目录，并且该目录已经添加到PATH环境变量里，接下来需要在该目录下新建一个名为```node-echo.cmd```文件，如下：
```
@node "C:\myapp\src\util\node-echo.js" %*
```
这样处理过后，可以在任意目录下使用```node-echo```命令咯~
### 工程目录标准样例
```
- /home/user/workspace/node-echo/   # 工程目录
    - bin/                          # 存放命令行相关代码
        node-echo
    + doc/                          # 存放文档
    - lib/                          # 存放API相关代码
        echo.js
    - node_modules/                 # 存放三方包
        + argv/
    + tests/                        # 存放测试用例
    package.json                    # 元数据文件
    README.md                       # 说明文件
```
## d.NPM
### 下载第三方包
```
# 下载安装并将依赖写入package.json文件中
$ npm install package --save
# 安装指定版本
$ npm install package1.0.1
```
### 发布自己的包
先要在npm注册个账号，然后按照npm init的提示填写相关信息，最后使用```npm publish```发布就好。
# 3.文件操作
## a.fs模块
node只提供了基本的文件操作api，但没有文件拷贝这种高级操作，这里我们先练个手
### 小文件拷贝
```js
var fs = require('fs');

function copy(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}

function main(argv) {
    copy(argv[0], argv[1]);
}

main(process.argv.slice(2));
```

**进入该目录下**，如果想要复制该目录下的test.py文件到该文件夹下test2.py，键入命令：
```
$ node node-echo.js test.py test2.py
```
以上程序通过```fs.readFileSync```从源路径读取文件内容，并使用```fs.writeFileSync```将文件写入到目标路径。process是一个全局变量，通过process.argv获得命令行参数。**值得注意的是**argv[0]始终为node执行程序的绝对路径，argv[1]为主模块的绝对路径，所以传入的参数需要从argv[2]这个位置取。
### 大文件拷贝
上面的文件拷贝小文件没有什么大问题，但是读取大文件内存会爆仓，要读取大文件只能读一点写一点，直至完成，对于上面的程序需要进行如下改造。
```js
var fs=require('fs')

function copy(src,dist){
	fs.createReadStream(src).pipe(fs.createWriteStream(dist))
}

function main(argv){
	copy(argv[0],argv[1])
}

main(process.argv.slice(2))
```
使用```fs.createReadStream```创建一个源文件只读数据流，使用```fs.createWriteStream```创建一个只写数据流，并用pipe方法将两个数据流连接起来。
## b.Buffer
js中没有二进制数据类型，node提供了一个与String对等的全剧构造函数```Buffer```来对二进制数据进行操作。除了可以读取文件得到Buffer的实例，还能够直接构造，如：
```
var bin = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
```
Buffer与String类型差不多，可以用length属性读取字节长度，也可以通过```[index]```方式读取文件位置。也可与String相互转化，如：
```js
var str=bin.toString('utf-8') // 指定编码
var bin=new Buffer('hello','utf-8') //<Buffer 68 65 6c 6c 6f>
```
当然，他们两者也是有区别的。字符串是只读的，他的意思不是说这个字符串不会被修改，而是单独修改某个字节位置，这个位置并不会改变，而Buffer则不同，修改Buffer更像是修改数组，可以直接修改某个位置的值。

使用```slice```方法也不是返回一个新Buffer,而是返回了某个位置的指针，修改该指针的值会作用于原buffer。比如：
```js
var bin =new Buffer([0x68,0x65,0x6c])
var bin2=bin.slice(1)
bin2[0]=0x68
console.log(bin) // 68 68 6c
```
所以，如果想要拷贝一份buffer，需要创建一个新buffer，通过```copy```方法将buffer中的数据复制过去。
```js
var bin =new Buffer([0x68,0x65,0x6c])
var dup=new Buffer(bin.length)
bin.copy(dup)
bin[0]=0x65
console.log(bin) //65 65 6c
console.log(dup) // 68 65 6c
```
## c.Stream
当内存中无法一次装下需要处理的数据，或是需要一边读一边处理时，我们就需要用到数据流。Node中通过各种```Stream```来提供对数据流的操作。比如，对数据创建一个只读流：
```js
var fs=require('fs')
var rs=fs.createReadStream(process.argv[2])

rs.on('data',function(chunk){
   // do something
	console.log(chunk) 
})

rs.on('end',function(){
	console.log('end')
})
```
Stream基于事件机制工作，所有Stream的实例都继承于NodeJS提供的EventEmitter。
上面的data事件会不断被触发，然而data事件中的函数并不会每次都执行得过来，可以按照如下方法来解决这个问题。
```js
var fs=require('fs')
var rs=fs.createReadStream(process.argv[2])

function print(data,func){
	console.log(data)
	func()
}

rs.on('data',function(chunk){
	rs.pause()
	print(chunk,function(){
		rs.resume()
	})
})

rs.on('end',function(){
	console.log('end')
})
```
创建一个只写数据流
```js
var fs=require('fs')
var rs=fs.createReadStream(process.argv[2])
var ws=fs.createWriteStream(process.argv[3])

rs.on('data',function(chunk){
	ws.write(chunk)
})

rs.on('end',function(){
	ws.end()
	console.log('end')
})
```
但上面的程序有个问题是，写入速度跟不上读取速度的话，内部缓存会爆仓。我们根据```.write```方法的返回值来判断传入的数据是写入目标文件还是临时放在了缓存中，通过[drain事件](http://nodejs.cn/api/stream.html#stream_event_drain)，drain的意思是排干，意思是用来判断什么时候只写数据流已经将缓存中的数据写入目标，可以传入下一个待写数据了。
```js
var fs=require('fs')
const argvs=process.argv
var rs=fs.createReadStream(argvs[2])
var ws=fs.createWriteStream(argvs[3])

rs.on('data',function(chunk){
	if(ws.write(chunk)===false){
		rs.pause()
	}
})

rs.on('end',function(){
	ws.end()
})

ws.on('drain',function(){ // 防爆仓控制
	rs.resume()
})
```
## d.其他文件操作
### (a)文件属性的读写
#### 获取文件属性
[fs.stat](http://nodejs.cn/api/fs.html#fs_fs_stat_path_callback)
```js
var fs=require('fs')
const argvs=process.argv
fs.stat(argvs[2],function(err,stats){
	if(err){
		throw err
	}else{
		console.log(stats)
	}
})
```
#### 修改读写权限
[fs.chmod](http://nodejs.cn/api/fs.html#fs_fs_chmod_path_mode_callback)

[关于设置权限707、777](https://zhidao.baidu.com/question/15534963.html)
```js
var fs=require('fs')
const argvs=process.argv
function getState(path,str){
	fs.stat(path,function(err,stat){
			if(err){
				throw err
			}else{
				console.log(str+stat.mode)
			}
		})
}

getState(argvs[2],'原权限')

fs.chmod(argvs[2],0777,function(err){
	if(err){
		throw err
		console.log('读写失败')
	}else{
		getState(argvs[2],'现权限')
	}
})
```
#### 更改文件所有权
[fs.chown](http://nodejs.cn/api/fs.html#fs_fs_chown_path_uid_gid_callback)
```js
var fs=require('fs')
const path=process.argv[2]
function getState(path){
	fs.stat(path,function(err,stat){
			if(err){
				throw err
			}else{
				const {gid,uid}=stat
				console.log(`gid:${gid},uid:${uid}`)
			}
		})
}

getState(path)
fs.chown(path,1,0,function(err){ // 1,0分别对应uid、gid
	if(err){
		throw err
	}else{
		console.log('changed')
		getState(path)
	}
})
```
### (b)文件内容读写
#### 读取文件内容
[fs.readFile](http://nodejs.cn/api/fs.html#fs_fs_readfile_path_options_callback)
```js
var fs=require('fs')
const path=process.argv[2]
fs.readFile(path,'utf-8',function(err,data){ // 不指定编码的情况下，以buffer形式输出
	if(err){
		throw err
	}else{
		console.log(data)
	}
})
```
#### 读取文件目录
[fs.readdir](http://nodejs.cn/api/fs.html#fs_fs_readdir_path_options_callback)
```js
fs.readdir('../',function(err,files){ //传入目录
	if(err){
		throw err
	}
		console.log(files)
})
```
#### 写入文件
如果文件存在，则被覆盖

[fs.writeFile](http://nodejs.cn/api/fs.html#fs_fs_writefile_file_data_options_callback)
```js
fs.writeFile('test.txt','test message~~~',function(err){
	if(err){
		throw err
	}
		console.log('saved file')
})
```
#### 创建目录
如果目录存在，则抛出异常

[fs.mkdir](http://nodejs.cn/api/fs.html#fs_fs_mkdir_path_mode_callback)
```js
fs.mkdir('newdir',0777,err=>{
	if(err) throw err
		console.log('created!')
})
```
### (c)底层文件操作
#### 打开/关闭文件
[fs.open](http://nodejs.cn/api/fs.html#fs_fs_open_path_flags_mode_callback)
[fs.close](http://nodejs.cn/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback)
```js
var fs=require('fs')
const path=process.argv[2]
fs.open(path,'w',(err,fd)=>{
	if(err) throw err
	fs.futimes(fd,1388648322,1388648322,err=>{
		if(err) throw err
		console.log('futimes done')
	fs.close(fd,()=>{
		console.log('done')
	})
	})
})
```
#### 读取文件数据
[fs.read](http://nodejs.cn/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback)
根据指定的文件描述符fd来读取文件数据并写入buffer指向的缓冲区对象。相对于readFile提供了更底层的接口.

一般情况下不建议使用这种方式来读取文件，因为它要求你手动管理缓冲区和文件指针，尤其是在 你不知道文件大小的时候，这将会是一件很麻烦的事情。
```js
var fs = require('fs')
const path = process.argv[2]
fs.open(path, 'r', (err, fd) => {
	if (err) throw err
	let buf = new Buffer(8)
	fs.read(fd, buf, 1, 15, null, (err, bytesRead, buffer) => { // 0为偏移量  100为读取的字结束  null为开始读取的位置，null只从读取位置读取
		if (err) throw err
		console.log('bytesRead', bytesRead)
		console.log(buffer)
	})
})
```
#### 根据文件描述符写入文件
[fs.write](http://nodejs.cn/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback)
该方法提供更底层的操作，实际应用中建议使用多 fs.writeFile()
```js
var fs = require('fs')
const path = process.argv[2]
fs.open(path, 'w', (err, fd) => {
	if (err) throw err
	const data='# hello python!'
	const buf=new Buffer(data,'utf-8')
	fs.write(fd,buf,0,data.length,0,(err,bytesWritten,buffer)=>{
		if(err) throw err
		console.log(bytesWritten)
		console.log(buffer)

		fs.close(fd,err=>{
			if(err) throw err
				console.log('file closed')
		})
	})
}  
```
以上介绍的方法都是以异步的方式调用的，也分别都有对应的同步方法，拿```readFileSync```举例：
```js
var fs = require('fs')
const path = process.argv[2]
try{
	const data=fs.readFileSync(path)
	console.log(data)
}catch(err){
	console.log(err)
}
```
## e.Path
node中提供了几个内置模块来简化路径相关操作，并提升代码可读性。
### 路径标准化
[path.normalize(path)](http://nodejs.cn/api/path.html#path_path_normalize_path)
将传入的路径转换为标准的路径，可以去掉多余的斜杠。但在不同操作系统下，解析后的斜杠不一样。
```js
var path=require('path')
const url = process.argv[0]
console.log(path.normalize(url))
```
### 连接路径分隔符
将path片段连接在一起并将路径规范化。
[path.join](http://nodejs.cn/api/path.html#path_path_join_paths)
```js
var path=require('path')
console.log(path.join('/foo','//bar','abc','../abc')) // \foo\bar\abc
```
### 获取path的扩展名
返回文件的扩展名，从最后一个```.```截取，没有```.```则返回空字符串。
[path.extname](http://nodejs.cn/api/path.html#path_path_extname_path)
```
const url = process.argv[2]
var path=require('path')
console.log(path.extname(url)) // .py
```
