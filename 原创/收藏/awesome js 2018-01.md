## 框架
1. [hyperapp -- 1 KB用于构建Web应用程序的JavaScript库。](https://github.com/hyperapp/hyperapp)他的特点是轻量和开箱即用，它将状态管理与支持密钥更新和生命周期事件的VDOM引擎相结合，所有这些都不依赖于任何依赖关系。

## 脚手架相关
1. [jarvis -- 一个非常智能的基于浏览器的Webpack仪表板](https://github.com/zouhir/jarvis)它的主要特点是可以查看在12种不同的网络制式中你的项目的表现情况。
    ![demo](https://github.com/zouhir/jarvis/raw/master/.github/screenshot.png?raw=true)

## 网络通信
1.[greenlet -- 移动一个异步函数到自己的线程。](https://github.com/developit/greenlet)他的原理是接受一个异步函数，生成一个在Web Worker中运行的副本。

示例：
```js
import greenlet from 'greenlet'

let get = greenlet(async url => {
	let res = await fetch(url)
	return await res.json()
})

console.log(await get('/foo'))
```
2. [sockette -- 最可爱的小WebSocket包装！](https://github.com/lukeed/sockette)Sockette是一个很小的（319字节）WebSocket封装，如果连接丢失，它将自动重新连接！

## 编辑器
1. [tui.editor -- Markdown所见即所得的编辑器。图表和UML在markdown语法。](https://github.com/nhnent/tui.editor)
    ![demo](https://user-images.githubusercontent.com/1215767/34353629-95b58da0-ea6c-11e7-859b-df5e990dd157.png)
    
## react相关
1. [react-sortable-hoc -- 触摸有好、可排序的列表](https://github.com/clauderic/react-sortable-hoc)
2. [after.js -- 类似Next.js，使用React Router 4构建的ssr React应用程序的框架](https://github.com/jaredpalmer/after.js)

## node相关
1. [polka -- 基于express的微型Web服务器](https://github.com/lukeed/polka)简单程序上比express快30%；支持中间件：包括express中间件；和express几乎相同的api和路由模式；
2. [safe-start-koa2 -- 简單直接的 Koa2 的脚手架](https://github.com/chungchi300/safe-start-koa2)

## PWA
1. [lavas -- 基于 Vue 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题 ](https://github.com/lavas-project/lavas)

[官网示例，建议在手机浏览器打开](https://lavas-project.github.io/lavas-demo/appshell/#/)

## 博客/文档
1. [project-guidelines -- JavaScript工程项目的一系列最佳实践策略](https://github.com/wearehive/project-guidelines/blob/master/README-zh.md#consistent-dev-environments)
2. [outline -- 为成长中的团队开放源代码wiki和知识库](https://github.com/outline/outline)比较适合创业团队来看的

    [文档](https://www.getoutline.com/developers)
3. [standard -- JavaScript风格指南，配有linter＆自动代码修复器](https://github.com/standard/standard/blob/master/docs/README-zhcn.md)
4. [webpack-demos -- Webpack的简单演示的集合](https://github.com/ruanyf/webpack-demos)

## funny-stuff
1. [PlanMaster -- 威信小程序套餐助手：手机套餐对比选购小程序](https://github.com/PrototypeFunction/PlanMaster)
2. [jspaint -- windows经典的画图工具](https://github.com/1j01/jspaint)

![demo](https://github.com/1j01/jspaint/blob/gh-pages/images/readme/main-screenshot.png)

[demo地址](http://jspaint.ml/#local:199164e0.a711e)
3. [ilsap -- Intellij许可证服务器活动代理](https://github.com/rodrigogs/ilsap)这个我自己还没有测试，使用jet brains家的产品就fork一下把~~