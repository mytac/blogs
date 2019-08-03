## 前言
在社区上看了不少关于`Event Loop`的文章，对于面试题来讲，是会做了，但还是感觉理解的深度不够。为什么要划分宏任务与微任务，event loop除了我们日常开发时会遇到的场景之外，还有哪些我不了解的知识。我在whatwg上找到了解释，同时也发现了很多自己不知道的新概念，所以产出此文和大家分享。如有错误的翻译和理解请在评论区指出，靴靴~~
## Agent
[github issue](https://github.com/tc39/ecma262/issues/882)
## Reaml
https://github.com/tc39/proposal-realms
## whatwg上对event loop的解释
[8.1.4 Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
>To coordinate events, user interaction, scripts, rendering, networking, and so forth, user agents must use event loops as described in this section. Each agent has an associated event loop.

渣翻：每个用户代理在协调事件，用户交互，脚本，渲染，网络等场景下都要使用event loop，每个用户代理都有自己相关的event loop。

它有三种类型，分别为window event loop,woker event loop,worklet event loop.

**window event loop**是用在类似原始窗口代理([similar-origin window agents](https://html.spec.whatwg.org/multipage/webappapis.html#similar-origin-window-agent))上的事件循环。 比如说，我在chrome上访问
