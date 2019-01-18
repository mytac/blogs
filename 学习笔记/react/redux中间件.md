## 何为中间件
在`express`中，它的中间件可以访问请求对象、响应对象和`next`，即下一个中间件；`express`通过组合各种中间件和路由构造应用。而在`redux`中，从派发`action`到将`action`传入`reducer`这个过程中间（可以理解为`dispacth`时）可以有一个管道，在这个管道中可以包含若干个中间件，用于处理同步或异步的`action`。每个中间件都是独立的函数，可以组合使用，每个中间件都有统一的接口。之所以将这个过程称之为管道是因为，这些中间件并非并发的，你可以将`action`看作一个数据流，它依次通过各个中间件，当`action`在某个中间件中断后，后面的中间件也不会再进行任何操作，当然也不会进入到`reducer`中。

<!-- ![demo](https://upload-images.jianshu.io/upload_images/5590388-304c6de2cf25067f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/645/format/webp) -->
## 构造一个中间件
理解了上面的中间件的作用和它的机制之后，我们来手动实现一个中间件！他需要**返回一个接受`next`参数的函数，而这个函数又需要返回一个接受`action`的函数**。ok，我们将上述的过程，用箭头函数解释出来：（至于为什么这样设计，后面将给出解释）
```js
const doNothingMiddleWare = ({ dispatch, getState }) => next => action => next(action);
```
如果你对函数式编程不敏感，用普通函数将他翻译为：
```js
function doNothingMiddleWare({dispatch, getState}){
    return function (next){
        return function (action){
            return next(action)
        }
    } 
}
```
比如，我们需要一个打印action type的中间件，
```js
const loggerMiddleWare = ({ dispatch, getState }) => {
    return next => {
        return action => {
            console.log('action', action)
            return next(action)
        }
    }
}
```
中间件函数接收一个包含`redux store`上的两个同名函数的对象，`dispatch`和`getState`。所以一个中间件拥有以下几种功能：

1. `dispatch`派发新的`action`对象
2. 调用`getState`获取当前`redux store`上的状态
3. 调用`next`，告诉`redux`当前中间件工作完毕，让`redux`调用下一个中间件
4. 访问`action`对象上的所有数据

因为`redux`的设计是基于函数式编程的，所以中间件中的函数尽可能小，并且可以进行组合。如果不是出于函数式编程，中间件可以写成这样：
```js
function middleWare({ dispatch, getState },next){
    return function(action){
        return next(action)
    }
}
```
## 调用中间件
调用中间件有两种方法
### 1. 使用applyMiddleware
调用这个中间件：
```js
import logMiddleWare from './reduxMiddleWare/logger'
// ...
const store = createStore(reducer, applyMiddleware(reduxThunk, logMiddleWare));
// ...
```
在每次`dispatch`的时候，我们将会在控制台看到打印的信息：
```
action {type: Symbol(FETCHING_START)}
action {type: Symbol(FETCHING_SUCCESS), result: {}}
```
## 