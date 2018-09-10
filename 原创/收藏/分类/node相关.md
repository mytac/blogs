1. [polka -- 基于express的微型Web服务器](https://github.com/lukeed/polka)简单程序上比express快30%；支持中间件：包括express中间件；和express几乎相同的api和路由模式；
2. [dumper.js -- 适用于Node.js应用程序的更好，更漂亮的变量检查器](https://github.com/zeeshanu/dumper.js)
## Koa
1. [safe-start-koa2 -- 简單直接的 Koa2 的脚手架](https://github.com/chungchi300/safe-start-koa2)

## 数据库驱动
1. [node-mongodb-native -- Mongo DB本机NodeJS驱动程序](https://github.com/mongodb/node-mongodb-native)
2. [better-sqlite3 -- Node.js中最快和最简单的SQLite3库](https://github.com/JoshuaWise/better-sqlite3)
3. [bull -- 用于处理NodeJS中的作业和消息的高级包，最快，最可靠，基于Redis的Node队列](https://github.com/OptimalBits/bull)

## 科学计算
1. [stdlib -- stdlib是JavaScript和Node.js的标准库，重点放在数字和科学计算应用程序上。](https://github.com/stdlib-js/stdlib)

    ![demo](https://camo.githubusercontent.com/603be274fc41ee39a4095b7c349016f85ee31945/68747470733a2f2f63646e2e7261776769742e636f6d2f7374646c69622d6a732f7374646c69622f323033383339333533626337343239376665363431323037323730663739313764326264613536302f646f63732f6173736574732f726561646d652f626173655f7370656369616c5f6d6174682e706e67)
## 均衡负载
1. [Microjob -- 一个微小的包装器，用于将Node.js工作线程转换为易于使用的例程，用于繁重的CPU负载。 ](https://github.com/wilk/microjob)
```js
(async () => {
  const { job } = require('microjob')

  try {
    // this function will be executed in another thread
    const res = await job(() => {
      let i = 0
      for (i = 0; i < 1000000; i++) {
        // heavy CPU load ...
      }

      return i
    })

    console.log(res) // 1000000
  } catch (err) {
    console.error(err)
  }
})()
```
## 路径匹配
1. [node-glob -- node中glob模式下路径匹配](https://github.com/isaacs/node-glob)
```js
var glob = require("glob")

// options is optional
glob("**/*.js", options, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
}) 
```
## 调试工具
1. [ndb -- ndb是针对Node.js的改进调试体验，由Chrome DevTools启用](https://github.com/GoogleChromeLabs/ndb)
## 请求工具
1. [got -- 简化的HTTP请求](https://github.com/sindresorhus/got)
```js
const got = require('got');

(async () => {
	try {
		const response = await got('sindresorhus.com');
		console.log(response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
})();
```
2. [check-links -- 可靠地检查一系列URL以获得活跃度。](https://github.com/transitive-bullshit/check-links)
```
支持http和https；
每次HTTP请求默认为10秒超时，重试次数为2次；
默认为Mac OS Chrome用户代理；
默认为重定向
```
3. [http-timer -- HTTP请求的计时](https://github.com/szmarczak/http-timer)
```js
const https = require('https');
const timer = require('@szmarczak/http-timer');

const request = https.get('https://httpbin.org/anything');
const timings = timer(request);

request.on('response', response => {
	response.on('data', () => {}); // Consume the data somehow
	response.on('end', () => {
		console.log(timings);
	});
});
```