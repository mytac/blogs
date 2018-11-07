2018 react conf在今年十月底于las vegas举行，其中主讲人Ryan Florence，演示了使用最新版本的react其中的几个hooks api可以大幅减少react functional 组件的代码量，本篇文章将围绕这个内容进行补充和示范。（在文章的结尾有大会的油管连接，没有梯子的小伙伴可以在b站上自行搜索）。

比如现在有个需求，需要监听键盘输入内容，显示在屏幕的某块可见范围中，效果如下：

![demo](https://s1.ax1x.com/2018/10/31/iRRRO0.gif)

以下代码基于`create-react-app`创建。
## 使用稳定版本react实现(v15)
```jsx
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      words: ''
    }
    this.keyFunc = this.keyFunc.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keypress', this.keyFunc)
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.keyFunc)
  }

  keyFunc(e) {
    this.setState(prev => ({
      words: prev.words + e.key
    }))
  }

  render() {
    const { words } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{words}</p>
        </header>
      </div>
    );
  }
}
```
我们会发现仅仅为了绑定监听函数和使用state，就要调用两个钩子函数和声明为类组件，是不是有点小题大做了？？那么我们看一下v16的react给我们带来的简洁高效！
## 使用alpha版本（v16.7）
首先安装
```
yarn add react@next,react-dom@next
```

```jsx
import React, { useState, useEffect } from 'react';

function setIt(initWords) {
  const [words, setWords] = useState(initWords);
  const listener = (e) => { setWords(prev => (prev + e.key)) }
  useEffect(() => {
    window.addEventListener('keypress', listener);
    console.log('aaa')
    return () => window.removeEventListener('keypress', listener);
  }, [])
  return words
}

function App() {
  const words = setIt('')
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{words}</p>
      </header>
    </div>
  );
}
```
看啊!虽然是functional component，却可以产生和class组件一样的效果，而且减少了代码量。那么`useState`和`useEffect`到底是干啥的呢？往下翻OVO
## api
### useState
类似于`setState`，但不支持state object扩展，如下
```js
setState(prevState => {
  // Object.assign would also work
  return {...prevState, ...updatedValues};
});
```
`useState`用法如下：
```js
const [state, setState] = useState(initialState);
```
#### 延迟初始化
如果`initState`是需要昂贵计算的结果，它也可以被延时提供，如下。
```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```
### useEffect
```js
useEffect(didUpdate);
```
使用`useEffect`，传递给它的函数将会在组件渲染到屏幕后运行。

在从屏幕上卸载组件之前，要清除监听器或者定时器以避免内存泄漏。`useEffect`可以返回一个清除函数，来完成这项操作，如：
```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```
#### 触发effect的时机
在组件每次渲染完毕之后触发effect，在此期间如果有输入变化，总是会重新建立effect。这里就引出了`useEffect`的第二个参数，他是一个数组类型，指的是产生effect所依赖的值。

比如我们将上述代码改为
```js
useEffect(() => {
    window.addEventListener('keypress', listener);
    console.log('aaa')
    return () => window.removeEventListener('keypress', listener);
  }, [state.words])
```
指该effect依赖于`state.effect`这个字段，如果它变化的话，将会触发effect函数，在此例中只要输入，就会触发effect中的函数（如果你尝试此例的话，当你的键盘在输入时，会看到控制台在打印aaa）。那么，如果我们传入空数组，`useEffect`只会在`componentDidMount`和`componentWillUnmount`阶段触发，也就是仅仅触发一次（这时控制台只打印了一次aaa）。

## 参考链接
1. [react-conf-2018](https://github.com/ryanflorence/react-conf-2018)
2. [youtube视频 -- 90% Cleaner React - Ryan Florence - React Conf 2018](https://www.youtube.com/watch?v=wXLf18DsV-I)
3. [react api-【userState】](https://reactjs.org/docs/hooks-reference.html#usestate)
4. [react conf 2018主站](https://conf.reactjs.org/)

