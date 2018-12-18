## 前言
`mix-blend-mode`这个css属性估计很多人都不熟悉，在写这篇文章之前我甚至都没在项目中使用过它，阅读了相关的文章，发现这个属性非常的强大，可以代替ps做一些图层合并加滤镜的效果。

先看下效果图

![larva](https://wx2.sinaimg.cn/mw690/6f8e0013ly1fya6q65rtig20cf0eggsr.gif)

[点我查看demo](http://www.mytac.cn/larva/)
## 概念与用法
他描述元素的内容与元素的父元素的内容和背景如何混合。
```
初始值	normal
适用元素	all elements
是否是继承属性	否
```
他的可选枚举值如下:这里的示例背景使用这两张图片进行说明。

<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544944580480&di=5e1318929fea67d9ae68fc27181c7e1e&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a96055af3e216ac72581786e03ce.jpg%401280w_1l_2o_100sh.jpg" width="200px" height="200px">

<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544944619927&di=52a9c1d62264a2674961619efd605fe3&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201504%2F26%2F201504261957_4RB5H.thumb.700_0.jpeg" width="200px">

示例css代码如下
```css
.container{
    width: 300px;
    height: 300px;
    background: url(pic1.jpg),
                url(pic2.jpg);
    background-size: cover;
    background-blend-mode: ***;
}
```

|属性值|描述|示例
|-|-|-|
normal |黑色层导致黑色最终层，白色层导致无变化。该效果类似于在透明膜重叠上印刷的两个图像，效果类似于两张不透明的纸张重叠。|![img](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544944580480&di=5e1318929fea67d9ae68fc27181c7e1e&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a96055af3e216ac72581786e03ce.jpg%401280w_1l_2o_100sh.jpg)
multiply|该效果类似于在透明膜重叠上印刷的两个图像。黑色层导致黑色最终层，白色层导致无变化。|![](https://wx1.sinaimg.cn/mw690/6f8e0013ly1fy8ub4qi7xj20cu0csjsi.jpg)
screen|效果类似于照射到投影屏幕上的两个图像，黑色层导致无变化，白色层导致白色最终层。最终颜色是底部颜色较深的乘法结果，或底部颜色较浅的屏幕。|![](https://wx1.sinaimg.cn/mw690/6f8e0013ly1fy8ub4qscyj20d40crq3c.jpg)
overlay|这种混合模式相当于硬光与层交换，最终颜色是底部颜色较深的乘法结果，或底部颜色较浅的屏幕。|![](https://wx2.sinaimg.cn/mw690/6f8e0013ly1fy8ub4rjuzj20ct0cndgo.jpg)
darken|最终颜色是由每个颜色通道的最暗值组成的颜色。|![](https://wx4.sinaimg.cn/mw690/6f8e0013ly1fy8ub4s737j20cw0cxt9t.jpg)
lighten|最终颜色是由每个颜色通道的最亮值组成的颜色。|![](https://wx4.sinaimg.cn/mw690/6f8e0013ly1fy8ub4saptj20cz0cr74u.jpg)
color-dodge|最终颜色是将底部颜色除以顶部颜色的倒数的结果。黑色前景导致没有变化。具有背景的反色的前景将导致完全亮起的颜色。这种混合模式类似于屏幕，但前景只需要像背景的反转一样轻，以达到完全亮起的颜色。|![](https://wx3.sinaimg.cn/mw690/6f8e0013ly1fy8ub4srehj20cf0d30sy.jpg)
color-burn|将值除以顶部颜色，并反转该值的结果。这个最终颜色是反转底部颜色。一个白色的前景导致没有变化，具有背景的反色的前景导致黑色最终图像。这种混合模式类似于乘法，但是前景只需要像背景的反转一样暗，以使最终图像变黑。|![](https://wx2.sinaimg.cn/mw690/6f8e0013ly1fy8ub4sqimj20cz0ctt9q.jpg)
hard-light|如果顶部颜色较暗，则最终颜色是乘法的结果，果顶部颜色较浅则是最终颜色。此混合模式相当于叠加，但交换了图层。效果类似于在背景上发出刺眼的聚光灯|![](https://wx3.sinaimg.cn/mw690/6f8e0013ly1fy8ub4w6drj20cv0ctq3o.jpg)
soft-light|效果类似于 扩散 一个在背景的聚光灯。|![](https://wx1.sinaimg.cn/mw690/6f8e0013ly1fy8ub4u0gqj20cu0crq3n.jpg)
difference|黑色层没有效果，而白色层反转另一层的颜色。最终的颜色是从较浅的颜色中减去两种颜色的较暗的结果|![](https://wx2.sinaimg.cn/mw690/6f8e0013ly1fy8uc8c3ckj20cq0ct0tx.jpg)
exclusion|最终颜色与差异相似，但对比度较低。与差异一样，黑色层没有效果，而白色层则反转另一层的颜色。|![](https://wx1.sinaimg.cn/mw690/6f8e0013ly1fy8uc8ciigj20cl0cp3zk.jpg)
hue|同时使用底部颜色的饱和度和亮度，最终颜色具有顶部颜色的色调。|![](https://wx4.sinaimg.cn/mw690/6f8e0013ly1fy8uc8cg3jj20cz0cuwf4.jpg)
saturation|最终颜色具有顶部颜色的色调，同时使用底部颜色的饱和度和发光度。纯灰色的背景，没有饱和，将没有效果|![](https://wx2.sinaimg.cn/mw690/6f8e0013ly1fy8uc8comzj20cp0cu3z5.jpg)
color|最终颜色具有顶部颜色的色调和饱和度。而使用底部颜色的亮度，效果保留了灰度级别，可用于前景着色。|![](https://wx1.sinaimg.cn/mw690/6f8e0013ly1fy8uc8cw79j20cy0ct3z4.jpg)
luminosity|最终颜色具有顶部颜色的亮度，同时使用底部颜色的色调和饱和度。随着层交换，这种混合模式相当于颜色|![](https://wx3.sinaimg.cn/mw690/6f8e0013ly1fy8uc8db50j20cw0cxmy1.jpg)
## 文字故障效果
首先，先上html
```html
    <div className="App">
        <h1>Larva</h1>
        <div className="bar"/>
    </div>
```
### 分解看几个动画
1. 当前文字也需要小角度左右偏移
2. 需要一个横条模拟故障线条，需要垂直移动
3. 文字左右有两个重影，需要水平移动
#### a.主文字小角度偏移
```scss
h1{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) skewX(0deg);
    font-size: 64px;
    font-family: Raleway, Verdana, Arial, sans-serif;
    animation: skewX 5s ease-in infinite;
    color:$t1;
  }

@keyframes skewX {
  78% {
      transform: translate(-50%, -50%) skewX(0);
  }
  79% {
      transform: translate(-50%, -50%) skewX(10deg);
  }
  80% {
      transform: translate(-50%, -50%) skewX(-10deg);
  }
  81% {
      transform: translate(-50%, -50%) skewX(0);
  }
}
```
#### b.白色故障条垂直移动
```scss
  &>.bar{
    position: relative;
    z-index: 4;
    top: 58%;
    left: 50%;
    transform: translate(-50%, -50%) skewX(0deg);
    width: 28%;
    height: 3px;
    background: #fa7268;
    animation: whiteMove 3s ease-out infinite;
    mix-blend-mode: luminosity; // 注意这里使用了mix-blend-mode
  }
}

@keyframes whiteMove {
  8% {
    top: 60%;
  }
  10% {
      top: 59%;
  }
  12% {
      top: 55%;
  }
  99% {
      top:58%;
  }
}
```
#### c.主文字左右两个重影
使用`::before`和`::after`这两个伪元素实现，使代码更“dry”。
```scss
  &>h1::before{
    display: inline-block;
    content: 'Larva';
    position: absolute;
    top: 0;
    left: 2px;
    height: 0px;
    color: rgba(255, 0, 0, 0.9);
    z-index: 2;
    animation: redShadow 1.5s ease-in infinite;
    text-shadow: 0.1px 0 0 red;
    mix-blend-mode: color-burn;// 注意这里使用了mix-blend-mode
  }
  &>h1::after{
    display: inline-block;
    content: 'Larva';
    position: absolute;
    top: 0;
    left: -3px;
    height: 64px;
    overflow: hidden;
    z-index: 3;
    animation: redHeight 2s ease-out infinite;
    -webkit-filter: contrast(200%);
    mix-blend-mode: hard-light;// 注意这里使用了mix-blend-mode
}

@keyframes redShadow {
  20% {
      left: -1px;
      height: 32px;
  }
  60% {
      left: 2px;
      height: 6px;
  }
  100% {
      left: -2px;
      height: 42px;
  }
}

@keyframes redHeight {
  20% {
      height: 42px;
  }
  35% {
      height: 12px;
  }
  50% {
      height: 40px;
  }
  60% {
      height: 20px;
  }
  70% {
      height: 34px;
  }
  80% {
      height: 22px;
  }
  100% {
      height: 0px;
  }
}
```

## 参考链接
1. [mdn-mix-blend-mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mix-blend-mode)
2.[mixblendmode制作文字故障效果](https://codepen.io/Chokcoco/pen/RVxbWW)