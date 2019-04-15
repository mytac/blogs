## 前言
在平常使用`redux`的时候，我们经常会用到`middleware`，
## 柯里化
>在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。 ————百度百科

其实说白了就是高阶函数，只不过只有一个参数，示例如下：
### 一个简单的示例
```js
const curry = a => b => c => console.log(a, b, c)

curry(1)(2)(3) // 输出1 2 3
```
箭头函数太过抽象？将他写为普通函数
```js
function curry(a){
    return function(b){
        return function(c){
            console.log(a,b,c)
        }
    }
}
// 我们分步看下
curry(1)
// 闭包保存着a
function (b){ 
    return function(c){
        console.log(a,b,c)
    }
}

curry(1)(2)
// 闭包保存着a,b
function(c){
    console.log(a,b,c)
}

curry(1)(2)(3)
// 执行上一步的匿名函数，闭包保存a,b,c
console.log(a,b,c) // 1 2 3
```
### middleware为啥不直接写成多参数函数
> 世界上所有事物的存在都有它存在的道理，除了蚊子。（题外话，查了资料发现[蚊子会减少肉食动物的数量，从而减轻地球压力](https://baijiahao.baidu.com/s?id=1609968105554548410&wfr=spider&for=pc)）

在《深入react技术栈》中，作者提到柯里化的middleware写法主要有以下两个好处：
1. 易串联：柯里化函数延迟执行，通过不断的currying形成的中间件可以累积参数，再配合`compose`，很容易形成`pipeline`来处理数据流

2. 共享store

我们先看一下redux怎么在程序里使用`middleware`:
```js
const store = createStore(reducer, applyMiddleware(...middleware))
```
### applyMiddleWare
源码
```js
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }
    let chain = [] //用于存放中间件

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```
### compose
```js
export default function compose(...funcs) {
  // 如果什么都没有传，则直接返回 参数
  // return arg => arg 即
  // return function (arg) {
  //   return arg;
  // };
  if (funcs.length === 0) {
    return arg => arg
  }
  // 如果funcs中只有一个中间件，那么就直接返回这个 中间件
  if (funcs.length === 1) {
    return funcs[0]
  } 
  
  // reduce() 方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值。
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```


也可以这样使用`applyMiddleware(...middlewares)(createStore)(reducer,null)`



## 推荐阅读
1. [详解JS函数柯里化](https://www.jianshu.com/p/2975c25e4d71)