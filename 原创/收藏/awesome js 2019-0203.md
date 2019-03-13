## 文本处理
1. [flexsearch -- Browser和Node.js的下一代全文搜索库](https://github.com/nextapps-de/flexsearch)
## react相关
1. [animated-burgers -- React的动画汉堡集合，也可用作HTML + CSS](https://github.com/march08/animated-burgers)

[demo](https://march08.github.io/animated-burgers/)
2. [react-three-fiber -- Three.js的React-renderer](https://github.com/drcmda/react-three-fiber)

![demo](https://camo.githubusercontent.com/ab0f0018c0fa81fc6d020be4595d80fba4f2f46a/68747470733a2f2f692e696d6775722e636f6d2f6946746a4b484d2e676966)
## 动画相关
1. [typeit -- 这个星球上最通用的JavaScript动画打字工具](https://github.com/alexmacarthur/typeit)
![demo](https://github.com/alexmacarthur/typeit/raw/master/demo.gif)
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
## 人工智能
1. [handtrack.js -- 用于直接在浏览器中进行实时手部检测（边界框）原型设计的库。](https://github.com/victordibia/handtrack.js)

![demo](https://github.com/victordibia/handtrack.js/raw/master/demo/images/bossflip.gif)
2. [nlp.js -- 用于构建机器人的NLP库，具有实体提取，情感分析，自动语言识别等功能](https://github.com/axa-group/nlp.js)

  ![demo](https://github.com/axa-group/nlp.js/raw/master/screenshots/hybridbot.gif)

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