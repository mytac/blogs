## 前言
本文是我阅读《深入React技术栈》所写的总结笔记。
`reconciliation`调和，是`react`中最为核心的模块，它指的是将virtual dom树转换成actual dom树所耗费的最少操作。他需要进行`diff`->`patch`这两个过程。`diff`是计算virtual dom 树转换成另一棵树进行的最少操作，而`patch`是将差异更新到真实的`dom`节点。
## diff
### tree diff
react为了让运行效率更高，tree diff只对树进行同层对比，不去比较跨层的节点。比如，在树A中第一层有一个节点B，想要将他移动到第二层，但并不会直接移动。而是会在第二层创建节点B，接着创建节点B的子节点，创建节点B的子节点的子节点...，然后再把之前第一层的B节点删除。

```html
<A>         <A>
<B/>        <C>
<C/>        <B/>
</A>   ->   </C>
            </A>
```

![demo](https://upload-images.jianshu.io/upload_images/5518628-d60043dbeddfce8b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/504/format/webp)
### component diff
因为react通过组件化开发，在对比组件差异上也采用上述算法。即，同一层只要出现不是同一类型的组件，就替换该组件的所有子节点。对于同一类型的组件，则通过`shouldComponentUpdate`去判断是否需要通过`diff`进行分析。`shouldComponentUpdate`默认为true。
### element diff
element diff主要是根据`mountIndex`和`lastIndex`进行比较，在确定是否移动 ，`mountIndex`是A节点在旧节点结合中的位置，`lastIndex`指访问过的节点，在旧集合中最右的位置，每次遍历都有可能会更新。

#### 算法描述
1. 遍历新节点集合
2. 如果出现旧节点集合中有与当前指针所指新节点A相同的节点，则通过对比节点位置进行判断操作，对比`mountIndex`和`lastIndex`：

    如果`mountIndex>=lastIndex`：不做移动操作。并把`lastIndex`更新为`mountIndex`。

    如果`mountIndex<lastIndex`：移动。

3. 如果新节点集合中有旧节点集合中不存在的节点，添加，更新`lastIndex`。
4. 最后遍历旧节点集合，如果存在新节点集合上不存在的点，则将其删除。

至于为什么要比较`mountIndex`和`lastIndex`，是因为要保证当前要进行移动操作的节点一定要比`lastIndex`小，一是为了节约性能，二是为了使节点排序更有条理，如果不进行比较，看见有相同的节点就移动，整个队列就乱了套了。

> Tips：React中有提示说，要尽量避免将最后一个节点移动到第一个节点的操作。就是因为在一上来比较的时候，本来只需要将最后一个节点移动到第一个位置这一个操作。但按照`diff`算法的逻辑，`mountIndex`为最大值，所以`lastIndex`也更新为最大值，第一个节点之后的节点都需要进行移动操作。

不太明白的同学可以参考这篇文章->[《React之diff算法》](https://www.jianshu.com/p/3ba0822018cf)，里面有分步图文描述，更便于理解。

#### 差异队列
在上一小节中，我们已经知道了diff是如何判断哪些节点要移动，哪些节点要删除或新增，这些修改的内容都被加入了差异队列当中。其中这三种节点操作，分别对应三种type：(在这之前通过了flattenChildren方法将子节点扁平化，key值相同的只取最后一个节点)
```
INSERT_MARKUP: 旧集合中有不存在的组件类型或节点，需要对组件或节点进行插入操作

MOVE_EXISTING: 源码中要对比prevChild===nextChild，即旧集合中有与新集合完全一样的节点，书中说是类型相同且element是可更新的，复用以前的dom节点。

REMOVE_NODE: 旧组件类型在新集合中也存在，但对应的element不同，不能更新和复用。或者旧组件中存在新集合中不存在的，也需要进行删除操作。
```
源码中有三个函数`makeInsertMarkup`，`makeMove`和`makeRemove`，用来返回上述三个操作对象。(大家可以把这里看作`redux`中`action`的概念)。如下，是进行新增操作的对象
```js
{
    type: ReactMultiChildUpdateTypes.INSERT_MARKUP,
    content: markup,
    fromIndex: null,
    fromNode: null,
    toIndex: toIndex,
    afterNode: afterNode,
}
```
在遍历的过程中，react不会一发现需要更新的节点就立即更新到真实dom上，而是将所有的上述差异对象，全部放入差异队列中，然后通过patch再将其更新到真实的dom上。
## patch
patch是指遍历差异队列依次更新到真实dom上的操作。通过`switch`去匹配差异对象的type，然后进行对应的操作。
[=>patch源码在这里](https://github.com/facebook/react/blob/v15.0.0/src/renderers/dom/client/utils/DOMChildrenOperations.js)
## 参考文档
1. [react源码--renderers/shared/reconciler/ReactMultiChild.js](https://github.com/facebook/react/blob/v15.0.0/src/renderers/shared/reconciler/ReactMultiChild.js)
2. [React源码之Diff算法](https://segmentfault.com/a/1190000010686582)