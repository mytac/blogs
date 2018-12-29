## 文本处理
1. [forgJs -- ForgJs是一个javascript轻量级对象验证器。去查看快速入门部分并开始用爱编码](https://github.com/oussamahamdaoui/forgJs)
```js
  const { Validator, Rule } = require('@cesium133/forgjs');
  
  const vComplexe = new Validator({
    age: new Rule({ type: 'int', min: 18, max: 99 }),
    dateOfBirth: new Rule({ type: 'date' }),
    array: new Rule({ type: 'array', of: new Rule({ type: 'string' }) }),
  });

  vComplexe.test({
    age: 26,
    dateOfBirth: new Date(1995, 10, 3),
    array: ['1'],
  }); /// returns true
  ```
## 布局
1. [Magic-Grid -- 一个简单，轻量级的Javascript库，用于动态网格布局。](https://github.com/e-oj/Magic-Grid)

![demo](https://camo.githubusercontent.com/c81d42594b1b2fccd509ff83e8872f20fcd1de8a/687474703a2f2f64726976652e676f6f676c652e636f6d2f75633f6578706f72743d766965772669643d3137324553505a447751496637764c4d656c756e2d5f34526157445f2d6a39342d) 
## 静态站
1. [fiddly -- 从Readme.md文件创建美观简单的HTML页面](https://github.com/SaraVieira/fiddly)
## 表单
1. [autoComplete.js -- autoComplete.js是一个简单的纯vanilla Javascript库，它逐步为速度，高通用性和与各种项目和系统的无缝集成而设计，专为用户和开发人员而设计。](https://github.com/TarekRaafat/autoComplete.js)
## Node
1. [sharp -- 高性能Node.js图像处理，是调整JPEG，PNG，WebP和TIFF图像大小的最快模块。使用libvips库](https://github.com/lovell/sharp)
## 算法
1. [algorithm-visualizer -- 可视化代码算法的交互式在线平台](https://github.com/algorithm-visualizer/algorithm-visualizer)
## react相关
1. [react-jsonschema-form -- 用于从JSON Schema构建Web表单的React组件。](https://github.com/mozilla-services/react-jsonschema-form)
## 网络处理
1. [quicklink -- 通过在空闲时间预取视口内链接，加快后续页面加载速度](https://github.com/GoogleChromeLabs/quicklink)
## vue相关
1. [vue-virtual-scroll-list -- 支持具有高滚动性能的大数据列表的vue组件](https://github.com/tangbc/vue-virtual-scroll-list)
## css相关
1. [emotion -- Emotion是一个高效且灵活的CSS-in-JS库。在许多其他CSS-in-JS库的基础上，它允许您使用字符串或对象样式快速设置应用程序样式。它具有可预测的组合，以避免CSS的特殊性问题。通过源映射和标签，Emotion具有出色的开发人员体验和出色的性能，并且可以在生产中进行大量缓存。](https://github.com/emotion-js/emotion)
## 调试相关
1. [eruda -- 移动浏览器控制台](https://github.com/liriliri/eruda)
## 数据可视化
1. [tabulator -- 用于JavaScript的交互式表和数据网格](https://github.com/olifolkerd/tabulator)

    ![demo](https://camo.githubusercontent.com/9c2d6ef191915ab62b8ebebd89b872117d50fb3a/687474703a2f2f746162756c61746f722e696e666f2f696d616765732f746162756c61746f725f7461626c652e6a7067)

    [官网](http://tabulator.info/)
## 视差处理
1. [rallax.js -- 死简单的视差滚动。](https://github.com/ChrisCavs/rallax.js)

    [demo](https://chriscavs.github.io/rallax-demo/)
## 小程序相关
1. [wxa-plugin-canvas -- 小程序海报组件-生成朋友圈分享海报并生成图片](https://github.com/jasondu/wxa-plugin-canvas)
## 学习的文档
1. [nodebestpractices -- 最大的Node.JS最佳实践列表（2018年11月）](https://github.com/i0natan/nodebestpractices)
## funny stuff
1. [taiko-web -- web太鼓达人](https://github.com/bui/taiko-web)
2. [atree -- 只是一个简单的圣诞树，基于reddit的故事](https://github.com/anvaka/atree)

  ![demo](https://camo.githubusercontent.com/1ef821cdc5a42e5a04bfb71b0c830f7f4a6572d3/687474703a2f2f692e696d6775722e636f6d2f46793453316a522e676966)
    [预览](http://anvaka.github.io/atree/)