## 中间件
在`express`中，它的中间件可以访问请求对象、响应对象和next，即下一个中间件；express通过组合各种中间件和路由构造应用。而在`redux`中，它的中间件的构造和`express`大同小异，只是传入的参数是一个对象，包含`dispatch`和`getState`这两个函数。
## 构造一个中间件
```js
const doNothingMiddleWare = ({ dispatch, getState }) => next => action => next(action);
```
上面的代码读起来比较晦涩，我们将箭头函数展开：
```js
function doNothingMiddleWare({dispatch, getState}){
    return next=>{
        return action=>{
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