## Cookie
cookie是由服务器发送到浏览器的小量信息，浏览器会将cookie保存下来，下次请求同一网站时会将cookie发送给服务器。
## session
session是指一个用户与交互进行通信的时间间隔，比如登录到登出的这一过程所需要的时间。具体到web中就是用户浏览某个网站时，从进入网站到关闭浏览器所经过的这段时间。注意!!**session是一个时间概念，并非客观存在的东西**。

当程序需要为某个客户端的请求创建一个session时，服务器首先检查浏览器中是否包含session标识（称为session id），如果已包含则说明为此客户端创建过session，服务器按照这个session id把session对象检索出来使用；如果不包含则为客户端创建一个session并且生成一个对应的session id，并且在响应中返回给客户端，客户端可以将他保存为cookie格式。
## cookie和session的区别

 ---| Cookie | session对象
---|---|---|
存储位置 | 客户端（设置过期时间在硬盘；没设置在内存中） | 服务端
时效性|自定义的过期时间（没设置关闭浏览器则消除）|session不活动时超出设置时间失效
存储类型|字符串|对象
安全性|明文（可以加密后存放）|放在服务器内存中，安全

## localStorage
`localStorage`和`sessionStorage`都属于Web Storage。

`localStorage`以键值对的形式存储在浏览器中，永久存储，永不失效，除非手动删除。
## sessionStorage
sessionStorage 属性允许你访问一个 session Storage 对象。它与 localStorage 相似，不同之处在于 localStorage 里面存储的数据没有过期时间设置，而存储在 sessionStorage 里面的数据在页面会话结束时会被清除。页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话。在新标签或窗口打开一个页面会初始化一个新的会话，这点和 session cookies 的运行方式不同。
## localStorage 和 sessionStorage 的区别
 ---| localStorage | sessionStorage
---|---|---|
有效期|永久存储，永不失效，除非手动删除|关闭会话窗口失效
作用域|同源窗口|仅在同一个标签页中

## 参考资料
1. 百度百科
2. [Cookie、session和localStorage、以及sessionStorage之间的区别](https://www.cnblogs.com/zr123/p/8086525.html)