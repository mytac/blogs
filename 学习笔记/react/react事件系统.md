## 阅读前的测试
想点↗x关闭的同学，先花一分钟进行测试，再来决定是否要继续阅读：
1. 点击button，最后的输出顺序是什么？
2. B,E,F 处的type都是啥？
```jsx
export default class Test extends React.Component {
    componentDidMount() {
        document.querySelector('#btn').addEventListener('click', (e) => {
            console.log('A inner listener')
            setTimeout(() => {
                console.log('B inner listener timer', e.type)
            })
        })

        document.body.addEventListener('click', (e) => {
            console.log('C document listener')
        })

        window.addEventListener('click', (e) => {
            console.log('D window listener')
        })
    }

    outClick(e) {
        setTimeout(() => {
            console.log('E out timer', e.type)
        })
        console.log('F out e', e.type)
    }

    innerClick = (e) => {
        console.log('G inner e')
        e.stopPropagation()
    }

    render() {
        return (
            <div onClick={this.outClick}>
                <button id="btn" onClick={this.innerClick}>点我</button>
            </div>
        )

    }
}
```

```md
1. 最后的输出顺序为 A C G F D B E 
2. B,F处的type为click，而E处的type为null
```
如果错了，不要紧~~咱们往下看吧。
## 合成事件（SyntheticEvent）

考虑到浏览器的兼容性和性能问题，react拥有自己的事件系统，即合成事件。在下文中将深入了解react事件系统。

与原生事件直接在元素上注册的方式不同的是，react的合成事件不会直接绑定到目标dom节点上，而是利用事件委托绑定到最外层document上，用一个统一的监听器去监听，这个监听器上保存着目标节点与事件对象的映射，当你挂载或删除节点时，所对应的事件就会从映射表上绑定或删除。（不理解事件委托或事件冒泡的同学可以看我的这篇文章[《举个栗子详解事件代理》](https://www.jianshu.com/p/bf1b882b277e)）

## 响应过程（对应第一问）
我们参照上题，详细说一下事件的响应过程：

1. 由于我们写的几个监听事件`addEventListener`，都没有给第三个参数，默认值为`false`，所以在事件捕获阶段，原生的监听事件没有响应，react合成事件没有实现事件捕获。所以在捕获阶段没有事件响应。
2. 接着到了事件绑定的阶段，`button`上挂载了原生事件，于是输出`"A"`，`setTimeout`中的`"B"`则进入`EVENT LOOP`。在上一段中，我们提到react的合成事件是挂载到`document`上,所以“G”没有输出。
3. 之后进入冒泡阶段，到了`div`上，与上条同理，不会响应`outClick`，继续向上冒泡。
4. 之后冒泡到了`document`上，先响应挂载到`document`的原生事件，输出`"c"`。之后接着由里向外响应合成事件队列，即输出`"G""F"`，将`'E'`放入`EVENT LOOP`。再向上冒泡。
5. 到了`window`上，响应`‘D’`，之后再处理`EVENT LOOP`上的事件，输出`'B' 'E'`.

## 合成事件对象
react合成事件是原生事件的扩充，它符合w3c标准。下面是合成事件对象的属性：

属性名|类型|描述
-|-|-|
`bubbles`|boolean|事件是否可冒泡
`cancelable`|boolean|事件是否可拥有取消的默认动作
`currentTarget`|DOMEventTarget|事件监听器触发该事件的元素（绑定事件的元素）
`defaultPrevented`|boolean|当前事件是否调用了 event.preventDefault()方法
`eventPhase`|number| 事件传播的所处阶段[0:Event.NONE-没有事件被处理,1:Event.CAPTURING_PHASE - 捕获阶段，2:被目标元素处理,3:冒泡阶段（Event.bubbles为true时才会发生）]
`isTrusted`|boolean| 触发是否来自于用户行为，false为脚本触发
`nativeEvent`|DOMEvent|浏览器原生事件
`preventDefault()`|void|
`isDefaultPrevented()`|boolean|返回的事件对象上是否调用了preventDefault()方法
`stopPropagation()`|void|
`isPropagationStopped()`|boolean|返回的事件对象上是否调用了stopPropagation()方法
`target`|DOMEventTarget|触发事件的元素
`timeStamp`|number|事件生成的日期和时间
`type`|string|当前 Event 对象表示的事件的名称，是注册事件的句柄，如，click、mouseover...etc.

注意`preventDefault()`和`stopPropagation()`，他们只能对react合成事件产生作用，尤其
注意`stopPropagation()`浏览器原生事件是不会被禁止传播的。比如我们把题目中的注释去掉，会发现“C”依然被输出，原因就在于合成事件其实是通过`document`上的监听器进行事件委托的（看不懂的同学接着看上一小节。）
## 事件池（对应第二问）
在react中，合成事件被调用后，合成事件对象会被重用，所有属性被置为`null`，所以题目中`outClick`中通过异步方式访问`e.type`是取不到任何值的，如果需要保留属性，可以调用`event.persist()`事件，会保留引用。

> 彩蛋：如果对这里好奇的同学可以在控制台打印一下event，会发现不论是不是异步方法中的event，它的所有属性都是null。但为什么会得到它的属性值呢，大概是因为`get`方法吧，具体的原因我也没深入。如果了解原理的同学请在评论区留言~~~或者等我之后填坑

## 源码构成
react事件系统的核心文件`renderers/shared/event/EventPluginHub.js`，感兴趣的同学可以去看看源码~~
```js
var EventPluginHub = {
 injection,
 putListener,
 getListener,
 deleteListener,
 deleteAllListeners,
 extractEvents, // 当顶层事件被触发，该方法中会传入原生事件，生成合成事件
 enqueueEvents,// 合成事件进入事件队列
 processEventQueue, // 调度事件队列上的所有合成事件
}
```
## 参考文档
1. [React事件系统和源码浅析](https://juejin.im/post/5bdf0741e51d456b8e1d60be)
2. [react事件系统源码](https://github.com/facebook/react/tree/v15.0.0/src/renderers/shared/event)
3. [react 官方文档 -- SyntheticEvent](https://reactjs.org/docs/events.html)