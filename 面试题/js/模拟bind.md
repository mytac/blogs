## Function.prototype.bind介绍
`bind`和`apply`、`call`一样是创建某个新函数，其具有将上下文绑定到某函数上的功能，这个新函数被调用时，它内部的`this`指向被赋予的上下文。如：
```js
var context = {
    name: 'mytac',
};

function original(a, b) {
    console.log(this.name)
    console.log('a', a)
    console.log('b', b)
}

var foo = original.bind(context, 1)
foo(2)
// mytac
// a 1
// b 2
```
## 模拟实现
我们需要在`Function`的原型链上创建函数，其参数要求和原生`bind`一样，包含一个上下文参数和多个传入该函数的实参。注意要将上下文`this`传入返回的匿名函数中，而不是在返回的匿名函数中获得上下文`this`，因为这时的匿名函数中`this`为调用该函数时的上下文，即`Window`。对于`this`概念比较模糊的小伙伴可以看我的这篇文章[《一篇文章完全搞懂this》](https://www.jianshu.com/p/4792dbddfc81)。
```js
Function.prototype.bindFn = function bind(thisArg) {
    if (typeof this !== 'function') {
        throw new TypeError(this + 'must be a function');
    }
    // 存储函数本身
    var self = this;
    // 去除thisArg的其他参数 转成数组
    var args = [].slice.call(arguments, 1);
    return function () {
        // bind返回的函数 的参数转成数组
        var boundArgs = [].slice.call(arguments);
        // apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果
        return self.apply(thisArg, args.concat(boundArgs));
    }
}
```
## es6实现
使用es6就简单多了，尤其是对参数的处理上。`...`spread操作符可以将类数组转成数组，原理是`...`调用了类数组上的`iterator`。（这里可以看我的另一篇文章[《ES6扫盲：用自定义iterator创建斐波那契数列》](https://www.jianshu.com/p/6c57be7f12e4)，会介绍`iterator`的神奇之处。）
```js
Function.prototype.bindFn = function bind(ctx, ...args) {
    const self = this
    return function (...args2) {
        return self.apply(ctx, [...args, ...args2])
    }
}
```
## 参考链接
1. [MDN-Function.prototype.bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)