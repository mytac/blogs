## 1.DNS解析
我们在浏览器上输入地址时，如`www.qq.com`，需要把这个地址解析成ip地址，其中就需要dns解析。
DNS(Domain Name System)是域名系统的英文缩写，他的服务是用来将主机名和域名转换为ip地址的工作。
### dns域名
![dns域名](https://pic2.zhimg.com/80/79b9fd2666e989ab24024966632ae63f_hd.jpg)
### 工作流程
浏览器在查找这个服务器ip的时候，

1. 首先寻找本地hosts文件是否有这个地址映射关系，如果有就先调用这个ip地址映射，完成域名解析
2. 如没有，浏览器发送请求到本地dns服务器，本地dns服务器由网络运营商提供
3. 查询输入的网址的dns请求到达本地dns服务器后， 则会先查询他的缓存记录，有这条记录则直接返回；没有则向dns根服务器进行查询
4. 根dns服务器没有，则告诉本地dns服务器，向dns域服务器进行查询，并给出域服务器的地址
5. 本地dns服务器继续向域服务器发请求，域服务器收到请求后，**并不会直接返回域名和ip地址的对应关系**，而是告诉本地dns服务器，你的域名解析服务器的地址。
6. 最后，本地dns服务器向域名的解析服务器发出请求，从而获得一个ip地址和域名的对应关系，将他返回给浏览器并将这个关系保存在缓存中

![dns域名解析基本过程](http://www.maixj.net/wp-content/uploads/2015/10/dns.jpg)

## 2.发送HTTP请求
最终拿到ip地址，浏览器根据这个ip地址和端口号构造一个tcp连接请求，这个请求通过各种路由设备后达到服务端，进入到网卡，接着进入TCP/IP协议栈，最终到达服务端web程序，建立TCP/IP的连接。

建立了tcp连接后，发起一个http请求。一个典型的http请求头包括请求方法（GET,POST,etc.）；还需要一些请求信息：请求方法和请求附带的数据等。

![一个请求头](http://chuantu.biz/t6/288/1523949903x-1566688574.png)
## 3.服务器处理请求并返回HTTP报文
后端从固定的端口接收到tcp报文，对tcp链接进行处理，对http协议进行解析，按照报文格式进一步封装为http request对象，这一部分地工作通常由web服务器进行处理。

http响应头也是由三部分组成：状态码、响应报头、响应报文。
### 状态码
状态码由三位数字组成，第一位数字代表响应类别：
1. 1xx 请求已接受，继续处理（100：continue；101：Switching Protocols）
2. 2xx 请求成功接受、处理、解析
    200：ok；

    204 No Content 成功，但不返回任何实体的主体部分；
    
    206 Partial Content 成功执行了一个范围（Range）请求
3. 3xx 重定向 要完成的请求必须进行更进一步的操作
    
    301 Moved Permanently 永久性重定向，响应报文的Location首部应该有该资源的新URL

    302 Found 临时性重定向，响应报文的Location首部给出的URL用来临时定位资源

    303 See Other 请求的资源存在着另一个URI，客户端应使用GET方法定向获取请求的资源

    304 Not Modified 服务器内容没有更新，可以直接读取浏览器缓存

    307 Temporary Redirect 临时重定向。
4. 4xx 客户端错误 请求有语法错误或请求无法实现
    
    400 Bad Request 表示客户端请求有语法错误，不能被服务器所理解

    401 Unauthonzed 表示请求未经授权，该状态代码必须与 WWW-Authenticate 报头域一起使用

    403 Forbidden 表示服务器收到请求，但是拒绝提供服务，通常会在响应正文中给出不提供服务的原因

    404 Not Found 请求的资源不存在，例如，输入了错误的URL
5. 5xx 服务端出错 服务端未能处理合法的请求
    
    500 Internel Server Error 表示服务器发生不可预期的错误，导致无法完成客户端的请求

    503 Service Unavailable 表示服务器当前不能够处理客户端的请求，在一段时间之后，服务器可能会恢复正常
    
    
![响应报头](http://chuantu.biz/t6/288/1523950258x-1566688748.png)
### 响应头
![响应头](https://images2015.cnblogs.com/blog/776370/201703/776370-20170322193336611-2098719977.png)
### 响应报文
通常就是服务器返回给浏览器的文本信息了，通常是html、css、js等静态资源放在这里。
## 4.浏览器解析渲染页面
浏览器在收到html、css、js等文件后，按照下图的过程进行渲染：

解析html以构建dom树 -> 构建render树 -> 布局render树 -> 绘制render树

![demo](https://pic1.zhimg.com/80/e8bc40d7006f13fa0a191d774b7db36a_hd.jpg)

### 解析渲染过程
当浏览器获得html文件时，会“自上而下”地进行加载，并在加载的过程中进行解析和渲染。
1. 浏览器先将html解析成一个dom树，dom树的构建过程是一个深度遍历的过程，意思是必须加在完当前节点的所有子节点才能加载当前节点的下一个兄弟节点。
2. 在解析过程中需要下载js或css等资源时，异步新建进程进行下载，并继续把html解析成dom树。
3. 其中，js通过dom api修改dom，通过cssom api修改样式作用到render tree上，css则解析为css rule。 tree，浏览器将css规则树和dom树结合起来构建render tree。（在文档加载过程中遇到js文件，则会挂起渲染过程，等待js文件下载并解析之后，再继续进行渲染！）
4. 在渲染的过程中会出现回流（reflow）和重绘（repaint）

### 回流与重绘
#### 回流（reflow）
只要修改了dom或改变了元素的形状或大小等会改变布局的操作就会触发reflow
#### 重绘（repaint）
只是改变了颜色，不影响周围元素或布局，会引起浏览器的重绘
#### 减少reflow与repaint
1. 不要一条一条的修改样式，应该固定写一个class，更换className，减少reflow次数
2. 不要把 DOM 结点的属性值放在一个循环里当成循环里的变量。 
3. 为动画的 HTML 元件使用`position:fixed 或 absolute` ，那么修改他们的 CSS 是不会 reflow 的。
4. 避免使用table布局，一个很小的改动会造成整个table reflow！

## 6.连接结束

## 参考文档
1. [【原】老生常谈-从输入url到页面展示到底发生了什么](https://www.cnblogs.com/xianyulaodi/p/6547807.html)
2. [浏览器加载、解析、渲染的过程](https://blog.csdn.net/xiaozhuxmen/article/details/52014901)
3. [浏览器加载网页时的过程是什么？ - 陈金的回答 - 知乎](https://www.zhihu.com/question/30218438/answer/84704484)
4. [前端经典面试题: 从输入URL到页面加载发生了什么？](https://segmentfault.com/a/1190000006879700)