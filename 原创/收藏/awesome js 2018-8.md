## react相关
1. [mauerwerk -- react-spring grid 栅格进入/退出交互组件](https://github.com/drcmda/mauerwerk)

    ![demp](https://github.com/drcmda/mauerwerk/raw/master/assets/grid.gif)
2. [react-color -- 来自Sketch，Photoshop，Chrome，Github，Twitter等的颜色选择器](https://github.com/casesandberg/react-color)

    ![demo](https://camo.githubusercontent.com/cf6a12e93cfa2e84b49f1cc4343f5f509c5ff54c/68747470733a2f2f6d656469612e67697068792e636f6d2f6d656469612f32364666676754353371453330344377452f67697068792e676966)

    [官网](http://casesandberg.github.io/react-color/)
3. [react-loadable -- 用于加载具有promise的组件的更高阶组件。](https://github.com/jamiebuilds/react-loadable)
4. [react-window -- React组件，用于有效地呈现大型列表和表格数据](https://github.com/bvaughn/react-window)

    [官网](https://react-window.now.sh/#/examples/list/fixed-size)
5. [rc-bmap -- 当百度地图遇上React，会产生怎样的火花🔥 🎉欢迎您的加入](https://github.com/jser-club/rc-bmap)

	[官网](https://bmap.jser-club.com/)
6. [JavaScript和React的可读，自动化和优化（5 kb）国际化](https://github.com/lingui/js-lingui)
7. [用于滚动，缩放和突出显示代码的反应组件<🏄/>](https://github.com/pomber/code-surfer)

	![demo](https://raw.githubusercontent.com/pomber/code-surfer/master/other/sample.gif)
## react native 相关
1. [metro -- React Native的JavaScript打包工具。](https://github.com/facebook/metro)
## 音频
1. [Tone.js -- 用于在浏览器中制作交互式音乐的Web Audio框架。](https://github.com/Tonejs/Tone.js)

    [demo](https://tonejs.github.io/demos)
## UI
1. [taro-ui -- 一款基于 Taro 框架开发的多端 UI 组件库](https://github.com/NervJS/taro-ui)

	[官网](https://taro-ui.aotu.io/#/docs/article)
## 办公
1. [mdx-deck -- 基于MDX的演示文稿](https://github.com/jxnblk/mdx-deck)

    ![demo](https://camo.githubusercontent.com/c12c8d143a3509f9aa6fde5629ea0c7f78e68437/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6a786e626c6b2f6d64782d6465636b2e676966)
## webpack
1. [size-plugin -- 随时间跟踪压缩的Webpack资产大小。](https://github.com/GoogleChromeLabs/size-plugin)
```js
// webpack.config.js
+ const SizePlugin = require('size-plugin');

module.exports = {
  plugins: [
+    new SizePlugin()
  ]
}
```
	![demo](https://camo.githubusercontent.com/806eb206a76f2453f3160eb2e56f1d4a2aaa589f/68747470733a2f2f692e696d6775722e636f6d2f33625742724a6d2e706e67)
## 架构
1. [lerna -- 用于管理具有多个包的JavaScript项目的工具。](https://github.com/lerna/l                                                                                                                                                                                                                    erna)
对于维护过多个package的同学来说，都会遇到一个选择题，这些package是放在一个仓库里维护还是放在多个仓库里单独维护，数量较少的时候，多个仓库维护不会有太大问题，但是当package数量逐渐增多时，一些问题逐渐暴露出来：
```
package之间相互依赖，开发人员需要在本地手动执行npm link，维护版本号的更替。
issue难以统一追踪，管理，因为其分散在独立的repo里。
每一个package都包含独立的node_modules，而且大部分都包含babel,webpack等开发时依赖，安装耗时冗余并且占用过多空间。
```
## 可视化
1. [BizCharts -- 基于G2和React的强大数据可视化库。](https://github.com/alibaba/BizCharts)

	![demo](http://img.alicdn.com/tfs/TB1YHabzxSYBuNjSsphXXbGvVXa-3602-972.png)

	[官网](http://bizcharts.net/products/bizCharts)
2. [zeu -- 用于实时可视化的JavaScript库](https://github.com/shzlw/zeu)

	![demo](https://github.com/shzlw/zeu/raw/master/examples/my-command-center.v1.0.0.gif)
## css
1. [postcss-autoprefixer](https://github.com/postcss/autoprefixer)通过Can I Use解析CSS并将规则添加到规则中
## node
1. [dumper.js -- 适用于Node.js应用程序的更好，更漂亮的变量检查器](https://github.com/zeeshanu/dumper.js)
2. [got -- 简化的HTTP请求](https://github.com/sindresorhus/got)
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
3. [check-links -- 可靠地检查一系列URL以获得活跃度。](https://github.com/transitive-bullshit/check-links)
```
支持http和https；
每次HTTP请求默认为10秒超时，重试次数为2次；
默认为Mac OS Chrome用户代理；
默认为重定向
```
4. [http-timer -- HTTP请求的计时](https://github.com/szmarczak/http-timer)
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
## 微信小程序
1. [WeTypecho -- 微信小程序版Typecho ](https://github.com/MingliangLu/WeTypecho)

众所周知，现在由于移动互联网的普及，网站访问量下降，导致个人站长非常难混。

WeTypecho则能帮您快速搭建微信小程序，将Typecho博客的内容映射到微信小程序。 帮助您在一定程度上获取更多来自微信的流量。WeTypecho的安非常简单，只需三分钟，就能搭建。

## 文本处理
1. [monaco-editor -- 基于浏览器的代码编辑器](https://github.com/Microsoft/monaco-editor)

	![demo](https://cloud.githubusercontent.com/assets/5047891/19600675/5eaae9e6-97a6-11e6-97ad-93903167d8ba.png)
## pwa
1. [SuperSlide.js -- 为您的下一个PWA提供灵活，流畅的GPU加速滑动菜单](https://github.com/osrec/SuperSlide.js)

	![demo](https://github.com/osrec/SuperSlide.js/raw/master/gifs/demo.gif)
## funny stuff
1. [nes -- 一个Javascript NES模拟器](https://github.com/fredericcambon/nes)

    ![demo](https://camo.githubusercontent.com/7545e51acb21557e1a37856f45ab7f01da83d4e0/68747470733a2f2f692e696d6775722e636f6d2f7a6d39626a474e6c2e706e67)
2. [resources -- 知名互联网企业内推资料整理 持续更新ing 。 目前已经维护四个微信群接近2000人，欢迎你的加入！](https://github.com/BestDingSheng/resources)
3. [windows95 -- Windows 95 in Electron。在macOS，Linux和Windows上运行。](https://github.com/felixrieseberg/windows95)

	![demo](https://user-images.githubusercontent.com/1426799/44532591-4ceb3680-a6a8-11e8-8c2c-bc29f3bfdef7.png)