## 前言
`reconciliation`调和，是`react`中最为核心的模块，它指的是将virtual dom树转换成actual dom树所耗费的最少操作。他需要进行`diff`->`patch`这两个操作。`diff`是计算virtual dom 树转换成另一棵树进行的最少操作，而`patch`是将差异更新到真实的`dom`节点。
## diff
### tree diff
react为了让运行效率更高，tree diff只对树进行同层对比，不去比较跨层的节点。比如，在树A中第一层有一个节点B，想要将他移动到第二层，但并不会直接移动。而是会在第二层创建节点B，接着创建节点B的子节点，然后再把第一层的B节点删除。

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
算法描述：
遍历新节点集合，如果出现旧节点集合中有与当前指针所指新节点A相同的节点，则通过对比节点位置进行判断操作，对比`mountIndex`和`lastIndex`：
`mountIndex`是A节点在旧节点结合中的位置，`lastIndex`指访问过的节点，在旧集合中最右的位置。
如果，新集合中的当前访问的节点比`lastIndex`大，说明
## patch
## 参考文档
1. [react源码--renderers/shared/reconciler/ReactMultiChild.js](https://github.com/facebook/react/blob/v15.0.0/src/renderers/shared/reconciler/ReactMultiChild.js)0