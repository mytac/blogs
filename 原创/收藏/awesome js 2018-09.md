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
## 地理相关
1. [AgentMaps -- 使用Javascript在交互式地图上进行社交模拟！基于代理的Web建模。](https://github.com/noncomputable/AgentMaps)

    [demo演示](https://noncomputable.github.io/AgentMaps/demos/simple/simple.html)

    ![demo](https://github.com/noncomputable/AgentMaps/raw/master/resources/agentgif.gif)
## pwa相关
1. [pwa -- 通用PWA Builder](https://github.com/lukeed/pwa)
## react-native相关
1. [react-native-starter -- React Native Starter是一个移动应用程序模板，包含许多内置组件](https://github.com/flatlogic/react-native-starter)
2. [react-native-paper -- react native material design](https://github.com/callstack/react-native-paper)

![demo](https://callstack.github.io/react-native-paper/gallery/typography.png)
## react相关
1. [react-proto --为开发人员和设计人员提供react应用原型设计工具。](https://github.com/React-Proto/react-proto)
## 机器学习
1. [ganlab -- 用于生成对抗网络的交互式可视化实验工具](https://github.com/poloclub/ganlab)

    [演示demo](https://poloclub.github.io/ganlab/)

    ![demo](https://github.com/poloclub/ganlab/raw/master/ganlab-teaser.png)
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