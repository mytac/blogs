## 前言
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
element diff主要是根据`mountIndex`和`lastIndex`进行比较，在确定是否移动，`mountIndex`是A节点在旧节点结合中的位置，`lastIndex`指访问过的节点，在旧集合中最右的位置，每次遍历都有可能会更新。

算法描述：
1. 遍历新节点集合
2. 如果出现旧节点集合中有与当前指针所指新节点A相同的节点，则通过对比节点位置进行判断操作，对比`mountIndex`和`lastIndex`：

    如果`mountIndex>=lastIndex`：不做移动操作。并把`lastIndex`更新为`mountIndex`。

    如果`mountIndex<lastIndex`：直接移动。

3. 如果新节点集合中有旧节点集合中不存在的节点，直接添加，更新`lastIndex`。
4. 最后遍历旧节点集合，如果存在新节点集合上不存在的点，则将其删除。

不太理解的同学可以参考这篇文章->[《React之diff算法》](https://www.jianshu.com/p/3ba0822018cf)，里面有分步图文描述，更便于理解。
## patch
## 参考文档
1. [react源码--renderers/shared/reconciler/ReactMultiChild.js](https://github.com/facebook/react/blob/v15.0.0/src/renderers/shared/reconciler/ReactMultiChild.js)