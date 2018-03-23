## 什么是内存泄漏（Memory Leak）
内存泄漏可以简单地被认为没有被应用所使用，但也没有被操作系统回收掉的内存。可以说是为它分配了内存，但没有被使用，没有被及时释放或无法释放。这通常只有开发者决定哪个地方不再需要这些内存，并将其释放。所以长时间占用久了，内存会占用越来越多，最终导致内存不足，整个程序崩坏。

不单独说任何一种开发语言，内存的生命周期都是：

1. 分配你需要的内存
2. 使用这些内存进行读写操作
3. 不需要时释放这些内存

## 垃圾回收机制（GC -- Garbage Collection）
而高级语言嵌入了一个名为“垃圾回收”的机制，他的工作是跟踪内存分配和使用情况，以便找到何时不再需要分配内存的情况，它会自动释放，但他也有局限性。GC机制造成内存泄漏最常见的原因是无效引用，我想们先了解一下GC的算法。
### 标记清除算法(mark-and-sweep)
这个算法假设了一组名为根的东西（在js中为全局对象）。垃圾回收器将会定期地，从根上遍历查找根上的引用，并标记为引用状态。从这些根开始查找所有可访问的对象，收集不可访问的对象（未被标记的对象），所有未被标记的内存块视为垃圾内存，回收机将回收这一块内存返还给系统。

无效引用指的是，被标记但被开发者确认无用的内存块的引用。在js上下文中，无效引用即代码中那些引用了内存但没有被释放的变量，大多数人认为，无效引用的产生主要是开发人员的错误导致，所以可以人为规避。
## 原因及分析
### 1.全局变量
比如我们在某个作用域中定义某个变量，但没有使用声明变量的关键字如`var`、`let`、`const`，这样做就会使这个变量变成了全局变量，这里的内存就会泄漏。
```js
function foo(){
    a=1 
}
```
等同于
```js
function foo(){
    window.a=1 
}
```
### 2.被遗忘的计时器
没有清除定时器上对dom的引用，即使这个节点不被需要，计时器仍然在工作状态，内存并没有被释放。
```js
setInterval(function() {
    const node = document.getElementById('Node');
    if(node) {
        node.innerHTML = JSON.stringify(someResource));
    }
}, 1000);
```
最佳实现还是要显式地将定时器取消掉。
### 3.DOM以外的引用
比如下面这个例子：我们可能会在对象中存储dom节点，这时实际上每个dom节点就会有两个地方在引用，一个是dom树中，另一个在对象中。如果需要，我们要保证所有引用的地方都是不可跟踪的！如节点被清空，但绑定到节点上的事件仍会导致内存泄漏。
```js
var elements = {
    button: document.getElementById('button'),
};
function doStuff() {
    button.click();
}

function removeButton() {
    document.body.removeChild(document.getElementById('button'));
    // 这时，我们仍然有一个引用指向全局中的饿elements。button这个节点仍在内存中，不会被回收。
}
```
### 4.闭包不会引起内存泄漏，循环引用才是罪魁祸首！
查了不少资料，都说闭包是引起内存泄漏的原因，但事实上只有在IE9以下的ie浏览器中才会产生内存泄漏，如下例：如果`element`不是dom对象，是不会产生内存泄漏的~
```js
function assignHandler(){
    var element = document.getElementById("someElement");
    element.onclick = function(){
        alert(element.id);
    };
}
```

以上代码创建了一个作为element元素事件处理程序的闭包，而这个闭包则又创建了一个循环引用。由于匿名函数保存了一个对`assignHandler()`的活动对象的引用，因此就会导致无法减少`element`的引用数。只要匿名函数存在，`element`仍被引用，因此它所占用的内存就永远不会被回收。


解决方法是把引用置空
```js
element=null
```
## 如何解决
chrome->performace 录制查看是否有阶段性起伏

![demo](http://chuantu.biz/t6/262/1521794248x-1566688706.png)
## 参考文档
1.[JavaScript 常见的内存泄漏原因](https://juejin.im/entry/58158abaa0bb9f005873a843)

2.[【译】JavaScript 内存泄漏问题](http://octman.com/blog/2016-06-28-four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/)

3.[mdn -- Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management#Release_when_the_memory_is_not_needed_anymore)