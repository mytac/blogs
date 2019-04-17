## 前言
在平常使用`redux`的时候，我们经常会用到第三方`middleware`，或者自己写`middleware`，但是还是对这种写法比较疑惑，因此才产出此篇文章。

先看个例子，比如：写一个logger middleware，在每次`dispatch`时，都在控制台打印`action`。
```js
const loggerMiddleware=({ dispatch, getState })=>next=>action=>{
  console.log('action',action)
  next(action)
}
```
### 疑问
1. 为什么不直接传多参数？？ 比如写成这样：`(store,next,action)=>{next(action)}`
2. 为什么是store=>next=>action顺序，而不是其他？？

>在《深入react技术栈》中，作者提到柯里化的middleware写法主要有以下两个好处：
>1. **易串联**：柯里化函数延迟执行，通过不断的currying形成的中间件可以累积参数，再配合`compose`，很容易形成`pipeline`来处理数据流
>2. **共享store**：因为闭包的存在，每个中间件的store引用都指向同一个值，`applyMiddleware`之后才是新的store。

看了上面的描述我又不懂了，柯里化是怎么积累参数延迟执行的？`applyMiddleware`这个方法又是怎样工作的？相信读者和我有一样的疑问，那我们就带着疑问一步一步挖掘。
## 柯里化
>在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。 ————百度百科

其实说白了就是高阶函数，示例如下：
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
综合上例，我们类比`middleWare`的实现，也能够大概知道一点他是怎样累积参数的了。那么我们再看一下`applyMiddleware`是怎么把一个个中间件串起来，让他们共享一个`store`的。

## applyMiddleware源码解读
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

    /*  applyMiddleware主要作用：改造dispatch方法*/
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }

    // 这里拿到的store引用都指向同一个值，因此store是共享的
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}

export default function compose(...funcs) {
  // 如果什么都没有传，则直接返回参数
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
从源码中我们可以看到，`applyMiddleware`封装了`store`然后把这个参数传递给每个`middleware`。在`compose`中，进行了参数累加。

上面的核心逻辑我们可以压缩成以下代码：
```js
// middlewares数组
const chains = [
    next => action => { console.log(action); next(action) },
    next => action => { console.warn(action); next(action) },
    next => action => { console.dir(action); next(action) },
]

// applyMiddleware方法的核心！！
function compose(chain) { 
  // middlewares=[m1,m2,m3]
  return chain.reduce((a, b) => (...args) => a(b(...args)))
}
const dispatch = compose(chains)(store.dispatch)
// 当执行dispatch时，相当于执行了m1(m2(m3(store.dispatch)))，每一个middleware会依次执行

// reduce之后是这样的 action => { console.log(action); console.warn(action);console.dir(action); }
dispatch({ type: 'hello' })
// 控制台将打印三条{ type: 'hello' }
```
## 推荐阅读
1. [详解JS函数柯里化](https://www.jianshu.com/p/2975c25e4d71)