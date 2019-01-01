## 前言
我从《深入浅出react和redux》中了解到`reselect`，发现它是`redux`官方社区的一个选择器库(selector library)，这里的“选择器”不是指css中的选择器，他的这个概念是出自[nuclear-js](https://github.com/optimizely/nuclear-js)。

选择器可以计算派生数据，允许redux存储最小的状态；他是可以组合的，可以用作其他选择器的输入；它也是有效的，不会被重复计算，除非它的参数真的改变了。
## 为什么需要reselect
当你在更新`state tree`的时候，操作他的`reducer`就会运行一次；这也就意味着如果你的`state tree`嵌套很深或是非常庞大，就会产生昂贵的系统开销，因此会带来性能问题。`reselect`是`redux`的一个中间件，它会帮助你避免这些重复计算。

你也不用再为不能直接改变state而烦恼，因为选择器自动会创造一份副本，我们只需定义函数，将`state`直接传入就好。
## 使用
```js
import { createSelector } from 'reselect'

const getVisibilityFilter = (state) => state.visibilityFilter
const getTodos = (state) => state.todos

export const getVisibleTodos = createSelector(
  [ getVisibilityFilter, getTodos ],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
  }
)
```
在上面的例子中`getVisibilityFilter`和`getTodos`两个选择函数不会缓存选择的数据（non-memozied），但使用`createSelector`将`getVisibleTodos`转换为可缓存的选择器(memoized)。
## 将选择器与redux store连接
需要在`mapStateToProps`中调用选择器，在此例中是上文的`getVisibleTodos`。
```js
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state)
  }
}
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

放在组件中：

```jsx
import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <VisibleTodoList listId="1" />
    <VisibleTodoList listId="2" />
    <VisibleTodoList listId="3" />
  </div>
)
```
如上，在多个组件中，我们的reducer应该根据`VisibleTodoList`的prop，`listId`进行数据操作。所以在`getTodos`中可能会写成：
```js
const getTodos = (state, props) =>
state.todoLists[props.listId].todos
```
props可以从`mapStateToProps`传递给`getVisibleTodos`：
```js
const mapStateToProps = (state, props) => {
  return {
    todos: getVisibleTodos(state, props)
  }
}
```
但是!拥有多个实例的`VisibleTodoList`不会正确的缓存状态。因为一个选择器只会创建一份缓存，如果我们在两个`VisibleTodoList`的实例上来回交替，每次的参数都是不一样的，所以选择器会一直重复计算，而不是返回存储好的缓存。
## 多个组件共享具有props的选择器
如果要在传递props和保留缓存状态的同时，使多个`VisibleTodoList`的实例共享选择器，组件的每个实例都需要他自己的选择器私有副本。让我们创建一个名为`makeGetVisibleTodos`的函数，每次调用它时都会返回`getVisibleTodos`选择器的新副本：
```jsx
import { createSelector } from 'reselect'

const getVisibilityFilter = (state, props) =>
  state.todoLists[props.listId].visibilityFilter

const getTodos = (state, props) =>
  state.todoLists[props.listId].todos

const makeGetVisibleTodos = () => {
  return createSelector(
    [ getVisibilityFilter, getTodos ],
    (visibilityFilter, todos) => {
      switch (visibilityFilter) {
        case 'SHOW_COMPLETED':
          return todos.filter(todo => todo.completed)
        case 'SHOW_ACTIVE':
          return todos.filter(todo => !todo.completed)
        default:
          return todos
      }
    }
  )
}

export default makeGetVisibleTodos
```
先需要调用一次`makeGetVisibleTodos`，获得`getVisibleTodos `，在将他传入`props`中，如下：
```js
const makeMapStateToProps = () => {
  const getVisibleTodos = makeGetVisibleTodos()
  const mapStateToProps = (state, props) => {
    return {
      todos: getVisibleTodos(state, props)
    }
  }
  return mapStateToProps
}
```
## 参考资料
1. [reselect 官方文档](https://github.com/reduxjs/reselect#installation)