## 网络请求
1. [ky -- 基于浏览器Fetch API的简洁优雅的HTTP客户端](https://github.com/sindresorhus/ky)
```js
import ky from 'ky';

(async () => {
	const json = await ky.post('https://some-api.com', {json: {foo: true}}).json();

	console.log(json);
	//=> `{data: '🦄'}`
})();
```
如果用普通的fetch，它将会是
```js
(async () => {
	class HTTPError extends Error {}

	const response = await fetch('https://sindresorhus.com', {
		method: 'POST',
		body: JSON.stringify({foo: true}),
		headers: {
			'content-type': 'application/json'
		}
	});

	if (!response.ok) {
		throw new HTTPError(`Fetch error:`, response.statusText);
	}

	const json = await response.json();

	console.log(json);
	//=> `{data: '🦄'}`
})();
```
2. [nuage -- Dropbox克隆，适用于FTP，SFTP，WebDAV，Git，S3，Minio，....](https://github.com/mickael-kerjean/nuage)

	![demo](https://raw.githubusercontent.com/mickael-kerjean/nuage/master/.assets/img/photo.jpg)
## node相关
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
2. [rxdb -- Web的实时数据库 ](https://github.com/pubkey/rxdb)

	![demo](https://github.com/pubkey/rxdb/raw/master/docs-src/files/realtime.gif)
## 数据可视化
1. [muze -- 用于Web的可组合数据可视化库，具有数据优先方法](https://github.com/chartshq/muze)
Muze是一个数据可视化库，它使用分层的图形语法（GoG）为Web创建可组合的交互式数据可视化。它使用数据优先方法来定义图表的构造和层，自动生成跨图表交互，并允许您覆盖图表上的任何行为或交互。
  [demo](https://www.charts.com/muze/examples/view/retinal-encoding)
## 地理相关
1. [AgentMaps -- 使用Javascript在交互式地图上进行社交模拟！基于代理的Web建模。](https://github.com/noncomputable/AgentMaps)

    [demo演示](https://noncomputable.github.io/AgentMaps/demos/simple/simple.html)

    ![demo](https://github.com/noncomputable/AgentMaps/raw/master/resources/agentgif.gif)
## pwa相关
1. [pwa -- 通用PWA Builder](https://github.com/lukeed/pwa)
## 文件处理
1. [percollate -- 一种命令行工具，可将网页抓取为格式精美的PDF](https://github.com/danburzo/percollate)
## react-native相关
1. [react-native-starter -- React Native Starter是一个移动应用程序模板，包含许多内置组件](https://github.com/flatlogic/react-native-starter)
2. [react-native-paper -- react native material design](https://github.com/callstack/react-native-paper)

![demo](https://callstack.github.io/react-native-paper/gallery/typography.png)
## react相关
1. [react-proto --为开发人员和设计人员提供react应用原型设计工具。](https://github.com/React-Proto/react-proto)
2. [rfcs -- 用于更改React的RFC](https://github.com/reactjs/rfcs)
## 状态管理
1. [unstated -- 用于react的状态管理](https://github.com/jamiebuilds/unstated)
## vue相关
1. [tiptap -- Vue.js的富文本编辑器](https://github.com/heyscrumpy/tiptap)
```html
<template>
  <editor>
    <!-- Add HTML to the scoped slot called `content` -->
    <div slot="content" slot-scope="props">
      <p>Hi, I'm just a boring paragraph</p>
    </div>
  </editor>
</template>

<script>
// Import the editor
import { Editor } from 'tiptap'

export default {
  components: {
    Editor,
  },
}
</script>
```
2. [gridsome -- 使用Vue.js和GraphQL构建超快的网站](https://github.com/gridsome/gridsome)

    [文档](https://gridsome.org/docs)
## 机器学习
1. [ganlab -- 用于生成对抗网络的交互式可视化实验工具](https://github.com/poloclub/ganlab)

    [演示demo](https://poloclub.github.io/ganlab/)

    ![demo](https://github.com/poloclub/ganlab/raw/master/ganlab-teaser.png)
## 控件
1. [react-modal-experiment -- 用于移动端的全屏表单react组件](https://github.com/stereobooster/react-modal-experiment)

	![demo](https://camo.githubusercontent.com/7829b2dcc921447e750e09e8316930e30c596c9e/68747470733a2f2f74686570726163746963616c6465762e73332e616d617a6f6e6177732e636f6d2f692f646274366d6f6f677076336b717570326b3077652e676966)
## 小程序
1. [omi -- Omi === Preact + Scoped CSS +Store System +本机支持3kb javascript。](https://github.com/Tencent/omi)

	[文档](https://github.com/Tencent/omi/blob/master/README.CN.md)
2. [westore -- 世界上最小却强大的小程序框架 - 100多行代码搞定全局状态管理、跨页通讯和插件开发](https://github.com/dntzhang/westore)
## 浏览器插件
1. [markdown-here -- Google Chrome，Firefox和Thunderbird扩展程序，可让您在Markdown中编写电子邮件并在发送前进行呈现。](https://github.com/adam-p/markdown-here)

	![demo](https://camo.githubusercontent.com/4d86f3e42a47d99458ea21f40ca80eaab7d8373a/68747470733a2f2f7261772e6769746875622e636f6d2f6164616d2d702f6d61726b646f776e2d686572652f6d61737465722f73746f72652d6173736574732f6d61726b646f776e2d686572652d696d616765312e67696d702e706e67)

## 时间处理
1. [You-Dont-Need-Momentjs -- 可用于替换moment.js + ESLint插件的日期文件或本机函数列表](https://github.com/you-dont-need/You-Dont-Need-Momentjs)
## 编辑器
1. [alex -- 无论是你自己还是别人的写作，亚历克斯都会帮助你找到性别偏好，两极分化，种族相关，宗教不体贴或其他不平等的措辞。](https://github.com/get-alex/alex)

	[在线示例](https://alexjs.com/#demo)
2. [awesome-vscode -- vscode插件集合](https://github.com/viatsko/awesome-vscode)
## 架构
1. [jslib-base -- 最好用的js第三方库脚手架，赋能js第三方库开源，让开发一个js库更简单，更专业](https://github.com/yanhaijing/jslib-base)
## 静态page
1. [md-page -- 创建一个只用markdown的网页](https://github.com/oscarmorrison/md-page)
	![demo](https://user-images.githubusercontent.com/1651212/46581080-1cefcb00-ca7d-11e8-8a4f-828dbe945dc6.png)
## 学习的文档
1. [33-js-concepts -- 每个JavaScript开发人员应该知道33个概念。](https://github.com/leonardomso/33-js-concepts)
## funny stuff
1. [chinese-dos-games -- 浏览器游玩中文 DOS 游戏](https://github.com/rwv/chinese-dos-games)
目前包括
```
仙剑奇侠传
模拟城市 2000
美少女梦工厂
同级生 2
大富翁3
明星志愿1
金庸群侠传
轩辕剑1
轩辕剑2
皇帝
轩辕剑外传：枫之舞
疯狂医院
大航海时代
大航海时代2
银河英雄传说III SP
三国志II
三国志III
三国志IV
三国志V
三国志V 威力加强版
三国志英杰传
主题医院
三国演义
三界谕：邦沛之迷
殖民计划
炎龙骑士团II‧黄金城之谜
倚天屠龙记
信长之野望·天翔记
信长之野望·霸王传
金瓶梅之偷情宝鉴
江南才子唐伯虎
暗棋圣手
太阁立志传
非洲探险2
```
 [演示地址](https://dos.zczc.cz/)
2. [docsite -- 一个开源静态网站生成器](https://github.com/txd-team/docsite)