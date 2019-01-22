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
### 1. 使用applyMiddleware包装createStore产生新函数
调用这个中间件：
```js
import logMiddleWare from './reduxMiddleWare/logger'
// ...
const configureStore = applyMiddleware(logMiddleWare)(createStore); // store enhancer creator
const store = configureStore(reducer,initialState)
// ...
```
在每次`dispatch`的时候，我们将会在控制台看到打印的信息：
```
action {type: Symbol(FETCHING_START)}
action {type: Symbol(FETCHING_SUCCESS), result: {}}
```
### 2. 多个store enhancer混合
上面的处理方式适用于只有一个`store enhancer`的情况，如果需要多个`store enhancer`需要用`compose`进行组合，如下：
```js
const enhancers=compose(applyMiddleware(logMiddleWare,...otherMiddleWares),devToolsExtensions()) // devToolsExtensions是redux-devtools的增强器
const store=createStore(reducer,enhancers)
```
切记，`compose`中中间件的顺序是`action`传入的顺序，如果`applyMiddleware(logMiddleWare,...otherMiddleWares)`放在`devToolsExtensions`之后，异步的`action`将不会被捕获，可能会抛出异常。
### 何为store enhancer

## Promise中间件
在应用中，对于请求数据一些操作，我们可以通过派发异步`action`进行操作，所以我们可以设计一个`Promise`中间件来实现这样的操作。
```js
const isPromise=p=>(p&&p.then&&(typeof p.then==='function'))

function promiseMiddleWare({dispatch}){
    return  next=>{
        return action=>{
            return isPromise(action)?action.then(dispatch):next(action)
        }
    }
}
```
比如在请求数据的时候，有三个请求状态，分别为pending、success、fail；然后我们需要给每个`promise`对象，绑定这三个状态。
```js
function promiseMiddleWare(){
    return ({dispatch,getState})=>{
        return next=>{
            return action=>{
                if(!isPromise(action)||!(action.types&&action.types.length===3)){
                    return next(action)
                }
                const {PENDING,SUCCESS,FAIL}=action.types
                dispatch({type:PENDING})
                return action.promise
                .then(result=>dispatch({type:SUCCESS,result}))
                .catch(err=>dispatch({type:FAIL,err}))
            }
        }
    }
}
```
在使用`fetch`进行数据请求时，我们就可以这样定义`action`：
```js
{types:[PENDING,SUCCESS,FAIL],promise:fetch(api)}
```
## store enhancer
中间件可以用来增强`dispatch`方法，但`store enhancer`可以对`redux store`进行更深层的定制。上文中的`applyMiddleware`就是一个`store enhancer`。比如上文我们使用的`logMiddleWare`是这样写的：
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
如果我们在`store`上，直接在`dispatch`方法上挂载`log`方法。
```js
const logEnhancer = createStore => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    const oldDispatch = store.dispatch
    store.dispatch = (action) => {
        console.log('dispatch action：', action)
        oldDispatch(action)
    }
    return store
}

// 调用
const enhancers = compose(logEnhancer, applyMiddleware(reduxThunk, promiseMiddleWare))
const store = createStore(reducer, enhancers)
```
一个`store`对象上包含以下接口，我们可以对其进行扩展，但*仍然不能直接修改state*，需要用`dispatch`派发。
```
dispatch
subscribe
getState
replaceReducer
```
如下例，我们可以在`store`上添加一个`reset`方法：
```js
const resetCreator = (reducer, resetState) => (reducer, resetState) => (state, action) => {
    if (action.type === 'reset') {
        return resetState
    }
}

const reset = createStore => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    const reset = (resetReducer, resetState) => {
        const newReducer = resetCreator(resetReducer, resetState)
        store.replaceReducer(newReducer)
        store.dispatch({ type: 'reset', state: resetState })
    }

    return { ...store, reset }
}
```
## 参考链接
1. [浅析Redux 的 store enhancer](https://segmentfault.com/a/1190000012653724)