## 文本处理
1. [flexsearch -- Browser和Node.js的下一代全文搜索库](https://github.com/nextapps-de/flexsearch)
## react相关
1. [animated-burgers -- React的动画汉堡集合，也可用作HTML + CSS](https://github.com/march08/animated-burgers)

[demo](https://march08.github.io/animated-burgers/)
2. [react-three-fiber -- Three.js的React-renderer](https://github.com/drcmda/react-three-fiber)

![demo](https://camo.githubusercontent.com/ab0f0018c0fa81fc6d020be4595d80fba4f2f46a/68747470733a2f2f692e696d6775722e636f6d2f6946746a4b484d2e676966)
3. [formal -- react hooks 时代的优雅跨平台表单管理原语。](https://github.com/kevinwolfcr/formal)
```jsx
import React from "react";
import useFormal from "@kevinwolf/formal";

const initialValues = {
  firstName: "Tony",
  lastName: "Stark",
  email: "ironman@avengers.io"
};

function App() {
  const formal = useFormal(initialValues, {
    onSubmit: values => console.log("Your values are:", values)
  });

  return (
    <form onSubmit={formal.submit}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input {...formal.getFieldProps("firstName")} type="text" />
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input {...formal.getFieldProps("lastName")} type="text" />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input {...formal.getFieldProps("email")} type="text" />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```
4. [Vibe -- 使用Bootstrap 4构建一个漂亮的react.js仪表板](https://github.com/NiceDash/Vibe)

![demo](https://github.com/NiceDash/Vibe/raw/master/assets/preview.png)
## 动画相关
1. [typeit -- 这个星球上最通用的JavaScript动画打字工具](https://github.com/alexmacarthur/typeit)
![demo](https://github.com/alexmacarthur/typeit/raw/master/demo.gif)
2. [laxxx -- 简单轻巧（2kb缩小和压缩）香草javascript插件，当你滚动时创建流畅和美丽的动画！利用最直观的互动的力量，让您的网站活跃起来！](https://github.com/alexfoxy/laxxx)

  ![demo](https://camo.githubusercontent.com/9c753cc96b8ce9b065bc33f736118768c2ecc2ea/68747470733a2f2f692e696d6775722e636f6d2f4448686c724d332e676966)

[demo](https://alexfox.dev/laxxx/)
## css相关
1. [linaria -- JS库中的零运行时CSS](https://github.com/callstack/linaria)在js中写css，0 runtime
```jsx
import { css } from 'linaria';
import { modularScale, hiDPI } from 'polished';
import fonts from './fonts';

// Write your styles in `css` tag
const header = css`
  text-transform: uppercase;
  font-family: ${fonts.heading};
  font-size: ${modularScale(2)};

  ${hiDPI(1.5)} {
    font-size: ${modularScale(2.5)};
  }
`;

// Then use it as a class name
<h1 class={header}>Hello world</h1>;
```
## node
1. [httpie -- Node.js HTTP客户端就像馅饼一样简单！](https://github.com/lukeed/httpie)
```js
import { get, post } from 'httpie';

try {
  const { data } = await get('https://pokeapi.co/api/v2/pokemon/1');

  // Demo: Endpoint will echo what we've sent
  const res = await post('https://jsonplaceholder.typicode.com/posts', {
    body: {
      id: data.id,
      name: data.name,
      number: data.order,
      moves: data.moves.slice(0, 6)
    }
  });

  console.log(res.statusCode); //=> 201
  console.log(res.data); //=> { id: 1, name: 'bulbasaur', number: 1, moves: [{...}, {...}] }
} catch (err) {
  console.error('Error!', err.statusCode, err.message);
  console.error('~> headers:', err.headers);
  console.error('~> data:', err.data);
}
```
## 数据相关
1. [construct-js -- 用于创建字节级数据结构的库。](https://github.com/francisrstokes/construct-js)
## 人工智能
1. [handtrack.js -- 用于直接在浏览器中进行实时手部检测（边界框）原型设计的库。](https://github.com/victordibia/handtrack.js)

![demo](https://github.com/victordibia/handtrack.js/raw/master/demo/images/bossflip.gif)
2. [nlp.js -- 用于构建机器人的NLP库，具有实体提取，情感分析，自动语言识别等功能](https://github.com/axa-group/nlp.js)

  ![demo](https://github.com/axa-group/nlp.js/raw/master/screenshots/hybridbot.gif)
## react native
1. [react-native-really-awesome-button -- React Native按钮组件。 Awesome Button是一个60fps的3D，支持进度，社交就绪，可扩展，生产就绪的组件，可以呈现一组很棒的动画UI按钮](https://github.com/rcaferati/react-native-really-awesome-button)

![demo](https://raw.githubusercontent.com/rcaferati/react-native-really-awesome-button/master/demo/demo-button-blue-new.gif)
2. [react-native-reanimated-bottom-sheet -- 高度可配置的底部组件，使用react-native-reanimated和react-native-gesture-handler制作](https://github.com/osdnk/react-native-reanimated-bottom-sheet)

![demo](https://github.com/osdnk/react-native-reanimated-bottom-sheet/raw/master/gifs/2.gif)
## 表单
1. [cleave.js -- 键入时格式化输入文本内容。](https://github.com/nosir/cleave.js)
## 请求
1. [async-retry -- 重试变得简单，容易和异步](https://github.com/zeit/async-retry)
```js
const retry = require('async-retry')
const fetch = require('node-fetch')

await retry(async bail => {
  // if anything throws, we retry
  const res = await fetch('https://google.com')

  if (403 === res.status) {
    // don't retry upon 403
    bail(new Error('Unauthorized'))
    return
  }

  const data = await res.text()
  return data.substr(0, 500)
}, {
  retries: 5
})
```
## vue相关
1. [quasar -- 高性能，Material Design 2，带Vue.js的完整前端堆栈](https://github.com/quasarframework/quasar)
## 大牛博客
1. [frankmcsherry/blog](https://github.com/frankmcsherry/blog)
## 文档
1. [docker_practice -- 通过真正的DevOps练习，学习和了解Docker技术！](https://github.com/yeasy/docker_practice)
## funny stuff
1. [miniC-hosting -- 一个简单的基于堆栈的虚拟机，在浏览器中运行C.](https://github.com/vasyop/miniC-hosting)
2. [slate -- 适用于API的精美静态文档](https://github.com/lord/slate)

    ![demo](https://raw.githubusercontent.com/lord/img/master/screenshot-slate.png)
    
    [demo](https://lord.github.io/slate/#authentication)
3. [wechat-format -- 微信公众号排版编辑器，转化 Markdown 微信特制的 HTML ](https://github.com/lyricat/wechat-format)

  [demo](https://lab.lyric.im/wxformat/)
4. [baiduyun -- 油猴脚本 直接下载百度网盘和百度网盘分享的文件,直链下载超级加速](https://github.com/syhyz1990/baiduyun)