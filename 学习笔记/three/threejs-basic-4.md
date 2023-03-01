---
title: threejs系列-scene、camera
tags:
  - three
date: 2023-02-16 16:30:36
---


# scenegraph

在正式说明 scenegraph 之前，先看一个例子

## 太阳、地球、月亮 ———— 公转与自转

在物理世界中，我们知道地球、太阳、月亮自转的同时，都围绕着另一颗星球运转。

我们先画个太阳和地球，太阳比地球大 10 倍，太阳呈黄色、地球呈蓝色，如下：

[![pSDo9HA.png](https://s1.ax1x.com/2023/02/02/pSDo9HA.png)](https://imgse.com/i/pSDo9HA)

关键代码：

```js
const sun = createSun()
const earth = createEarth()
sun.scale.set(5, 5, 5)
scene.add(sun)
scene.add(earth)
```

![1-basic.gif](https://s2.loli.net/2023/02/02/Yzlh1WGTQN5e2ja.gif)

### 地球绕着太阳公转

```js
camera.position.set(0, 150, 0) // 必须把相机拉远，否则看不到地球

const objects = []
const sun = createSun()
const earth = createEarth()
sun.scale.set(5, 5, 5)
scene.add(sun)
sun.add(earth) // 把地球加入到太阳中
```

![212.gif](https://s2.loli.net/2023/02/02/j84Xv3QcBE1khCn.gif)

根据上图可以发现，地球可以绕着太阳转，但变大了。这是因为，地球继承了太阳的 scale，也就是这句

```js
sun.scale.set(5, 5, 5)
```

让 sun 的空间变为 5 倍大小。

解决上述问题，只需让 sun 和 earth 处于同一父节点下，这样才不会让 sun 的属性设置污染到 earth。

创建名为 solarSystem 的容器

```js
camera.position.set(0, 50, 0) // 相机距离还原

const objects = []
const solarSystem = new THREE.Object3D()
scene.add(solarSystem)

const sun = createSun()
sun.scale.set(5, 5, 5)
objects.push(sun)
solarSystem.add(sun)

const earth = createEarth()
earth.position.x = 10
solarSystem.add(earth)
```

![313.gif](https://s2.loli.net/2023/02/02/5SvbLd7mfNps89D.gif)

如上，虽然让地球与太阳属性不在关联，但 earth 不再公转了。我们让整个 solarsystem 自转，这时，因为太阳在原点，地球也就随着空间转了起来。

```js
objects.push(solarSystem) // 把太阳系加入到旋转组中
```

![313.gif](https://s2.loli.net/2023/02/02/Uq4FLrQnZWGvsOY.gif)

### 如法炮制的月球

和地球绕太阳转一样，月球也要绕地球转，并自转。这里的做法和上面类似。我的做法是，创建一个 scene 称其为 earthOribit，把地球加到 earthOribit 旋转系统中，地球作为原点，设置月球的 position，让整个 earthOribit 再旋转。

```js
const earthOribit = new THREE.Object3D(0xaaaaaa)
earthOribit.add(earth)
earthOribit.position.x = 10

objects.push(earthOribit)

solarSystem.add(earthOribit)

const moon = createMoon()
moon.scale.set(0.5, 0.5, 0.5)
moon.position.x = 2

earthOribit.add(moon)

objects.push(earthOribit)
```

![1-basic.gif](https://s2.loli.net/2023/02/03/nMEps7oa35CORxh.gif)

完整代码：
[3-scene](https://github.com/mytac/threejs-learning/blob/main/src/course/3-scene.js)

### Helper

#### AxesHelper

如上图，我们只能看到物体在转，却不能确定镜头在哪个位置，这就需要借助 Three 中的内置工具`AxesHelper`。他会给节点添加 x、y、z 轴线。

红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.

```js
// 为每个节点添加一个AxesHelper
objects.forEach((node) => {
    const axes = new THREE.AxesHelper()
    axes.material.depthTest = false // 不会检查其是否在其他东西后面进行绘制，也就是可以轴可以在球体内部绘制
    axes.renderOrder = 1 // 轴在所有球体之后被绘制
    node.add(axes)
})
```

如下，在太阳 mesh 上没有看到绿色的线（y 轴），这是因为镜头在正上方，我们的视线平行于 y 轴。

[![pSgYR3t.png](https://s1.ax1x.com/2023/02/07/pSgYR3t.png)](https://imgse.com/i/pSgYR3t)

#### GridHelper

添加了 GridHelper 后，可以确定 mesh 之间的相对位置和在空间中旋转的绝对位置，如下（原来的灰色背景改为黑色，易于看清）
![GridHelper](https://s2.loli.net/2023/02/07/DgXKbRud8LEVlse.gif)

[官方文档 - GridHelper](https://threejs.org/docs/#api/zh/helpers/GridHelper)

#### 添加 GUI

可以使用 [lil-gui](https://github.com/georgealways/lil-gui) 来定制化 AxesHelper 和 GridHelper。
![1-basic.gif](https://s2.loli.net/2023/02/08/e6EK234NZRxqADH.gif)

首先，需要将 两个 Helper 用类封装起来，在类上声明属性 visible，用于控制两个 helper 是否要在节点上展示。

```js
// 打开/关闭轴和网格的可见性
// lil-gui 要求一个返回类型为bool型的属性
// 来创建一个复选框，所以我们为 `visible`属性
// 绑定了一个setter 和 getter。 从而让lil-gui
// 去操作该属性.
class AxisGridHelper {
    constructor(node, units = 10) {
        const axes = new THREE.AxesHelper()
        axes.material.depthTest = false
        axes.renderOrder = 2 // 在网格渲染之后再渲染,这样轴就会在网格之后绘制,否则网格可能会覆盖轴。

        node.add(axes)

        const grid = new THREE.GridHelper(units, units)
        grid.material.depthTest = false
        grid.renderOrder = 1
        node.add(grid)

        this.grid = grid
        this.axes = axes
        this.visible = false
    }
    get visible() {
        return this._visible
    }
    set visible(v) {
        this._visible = v
        this.grid.visible = v
        this.axes.visible = v
    }
}
```

之后，写一个函数，将 AxisGridHelper 类生成的实例，添加到 gui 上

```js
function makeAxisGrid(gui, node, label, units) {
    const helper = new AxisGridHelper(node, units)
    gui.add(helper, 'visible').name(label)
}
```

使用方法如下：

```js
const gui = new GUI()
// ...
// 建立GUI
makeAxisGrid(gui, solarSystem, 'solarSystem', 25)
makeAxisGrid(gui, sun, 'sunMesh')
makeAxisGrid(gui, earthOrbit, 'earthOrbit')
makeAxisGrid(gui, earth, 'earthMesh')
makeAxisGrid(gui, moon, 'moon')
```

# Camera

## frustum(视椎)

摄像机仿人眼设计，我们可以想象我们的视野如下：呈一个椎台（一个棱锥被平行于它的底面的一个平面所截后，截面与底面之间的几何形体）

<img src="https://threejs.org/manual/resources/frustum-3d.svg" width="400px" >

#### 参数说明

**fov** 是视野的缩写。在此例中，垂直方向为 75 度。请注意，three.js 中的大多数角度都以弧度为单位，但出于某种原因，透视相机采用度数。

**aspect** 是画布的宽高比。我们将在[另一篇文章](https://threejs.org/manual/en/responsive.html)中详细介绍，但默认情况下画布为 300x150 像素，这使得宽高比为 300/150 或者说是 2。

**near** 和 **far** 表示相机的近平面和远平面。它们限制了摄像机面朝方向的可绘区域。 任何距离小于或超过这个范围的物体都将被裁剪掉(不绘制)。

这四个参数定义了一个 "视椎(frustum)"。 视椎(frustum)是指一个像被削去顶部的金字塔形状。换句话说，可以把"视椎(frustum)"想象成其他三维形状如球体、立方体、棱柱体、截椎体。

近平面和远平面的高度由视野范围决定，宽度由视野范围和宽高比决定。

比如我们之前一直使用的[PerspectiveCamera](https://threejs.org/docs/#api/zh/cameras/PerspectiveCamera)，采用透视投影来显像。

## PerspectiveCamera(透视相机)

### 透视投影

> 单点透视法是一种把立体三维空间的形象表现在二维平面上的绘画方法，使观看的人对平面的画有立体感，如同透过一个透明玻璃平面看立体的景物。透视画法要遵循一定的规律，其中几个要素为
>
> > **原线**：和画面平行的线，在画面中仍然平行，原线和地面可以是水平、垂直或倾斜的，在画面中和地面的相对位置不变，互相平行的原线在画面中仍然互相平行，离画面越远越短，但其中各段的比例不变；  
> > **变线**：不与画面平行的线都是变线，互相平行的变线在画面中不再平行，而是向一个灭点集中，消失在灭点，其中各段的比例离画面越远越小；  
> > **灭点**包括四种：
> >
> > > _焦点_，是作画者和观众看的主要视点，与地面平行，与画面垂直的线向焦点消失。  
> > > _天点_，画中近低远高的，与地面不平行的线都向天点集中消失；天点和焦点在同一垂直线上。  
> > > _地点_，画中近高远低的，与地面不平行的线都向地点集中消失；地点和焦点在同一垂直线上。  
> > > _余点_，与地面平行，但与画面不垂直的线向余点集中消失。余点有许多个，和焦点处于同一水平线上，每个和画面不同的角度都有一个不同的余点。
>
> 当画家平视时，焦点和余点都处于地平线上，仰视图焦点向天点靠拢，俯视图焦点向地点靠拢，余点始终和焦点处于同一水平线上。  
>  ———— 来源于 https://zh.wikipedia.org/wiki/%E9%80%8F%E8%A7%86

[![pSWnwlD.png](https://s1.ax1x.com/2023/02/09/pSWnwlD.png)](https://imgse.com/i/pSWnwlD)

### 使用 GUI 调节视锥

如上一章，使用 lil-gui 时都要建立 Helper，调节视锥属性要设置 MinMaxGUIHelper

```js
class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj
        this.minProp = minProp
        this.maxProp = maxProp
        this.minDif = minDif
    }
    get min() {
        return this.obj[this.minProp]
    }
    set min(v) {
        this.obj[this.minProp] = v
        this.obj[this.maxProp] = Math.max(
            this.obj[this.maxProp],
            v + this.minDif
        )
    }
    get max() {
        return this.obj[this.maxProp]
    }
    set max(v) {
        this.obj[this.maxProp] = v
        this.min = this.min // 这将调用min的setter
    }
}
```

改变视锥参数后，要调用更新方法[PerspectiveCamera.updateProjectionMatrix](https://threejs.org/docs/#api/zh/cameras/PerspectiveCamera.updateProjectionMatrix)

实例化 GUI

```js
// 设置GUI
const gui = new GUI()
const update = updateCamera.bind(null, newCamera)
gui.add(newCamera, 'fov', 1, 180).onChange(update)
const minMaxGUIHelper = new MinMaxGUIHelper(newCamera, 'near', 'far', 0.1)
gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(update)
gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(update)
```

最终显示效果如下：

![1-basic.gif](https://s2.loli.net/2023/02/09/ZbqwhNp6QVJP2as.gif)

### 鼠标控制视角

使用 Three 内置控制器 [OrbitControls](https://threejs.org/docs/index.html?q=OrbitControls#examples/en/controls/OrbitControls)来进行拖拽 camera，并且可以使用鼠标滚轮调节

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const canvas = document.querySelector('#c')
//...
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 5, 0)
controls.update()
// ...
```

当改变`fov`属性时，调节视野广度，可以简单理解为调节焦距（但这里两个并不等价，只作为简单理解，可参考[相机焦距与视场角 FOV](https://blog.csdn.net/weixin_34910922/article/details/121844973)）。

## 构造视锥工作相机

上例中，用单独的相机来观察视锥并不明显，我们可以再造另一个相机，用来展示当前摄像机是如何工作的，然后画出视锥。

这里，要在显示区域分为左右两部分，左边显示在 OrthographicCamera 下的场景渲染，右边画出 OrthographicCamera 的视锥。

### OrthographicCamera

与透视相机不同的是，他的最远视口与最近视口一样，相当于我们把眼睛贴近一个掏空的纸盒中去看东西，如下：

<img src="https://s2.loli.net/2023/02/16/BRhfYiAcdkt9l6D.png" width="400px">

[官方文档-OrthographicCamera](https://threejs.org/docs/#api/zh/cameras/OrthographicCamera)

### 画出视锥

使用`THREE.CameraHelper`建立 Helper，

```js
const camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far)

const cameraHelper = new THREE.CameraHelper(camera)

// 使用时,要打开visible
cameraHelper.visible = true
```

### 剪刀测试（scissorTest）

这个概念可以理解为 2d 中的 crop。在 3d 场景中剪出一个剪刀框，只有剪刀区域内的像素会受 renderer 操作影响。

设置剪刀区域，返回宽高比

```js
function setScissorForElement(canvas, elem, renderer) {
    const canvasRect = canvas.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()

    // 计算canvas的尺寸
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
    const left = Math.max(0, elemRect.left - canvasRect.left)
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
    const top = Math.max(0, elemRect.top - canvasRect.top)

    const width = Math.min(canvasRect.width, right - left)
    const height = Math.min(canvasRect.height, bottom - top)

    // 设置剪函数以仅渲染一部分场景
    const positiveYUpBottom = canvasRect.height - bottom
    renderer.setScissor(left, positiveYUpBottom, width, height)
    renderer.setViewport(left, positiveYUpBottom, width, height)

    // 返回aspect
    return width / height
}
```

拿到剪刀区域的宽高比之后，修改摄像机参数，这里的 left 和 right 指摄像机视口的左右定位，如下红色线段宽度表示 left 距离，黄色线段宽度表示 right 距离

![carbon.png](https://s2.loli.net/2023/02/16/VzE3ZtAxUy5fBi6.png)

```js
const cameraHelper = new THREE.CameraHelper(camera)
const aspect = setScissorForElement(canvas, view1Elem, renderer)
// 用计算出的aspect修改摄像机参数
camera.left = -aspect
camera.right = aspect
// 修改参数后，要调用更新方法
camera.updateProjectionMatrix()
cameraHelper.update()
```

### 最终效果

![1-basic.gif](https://s2.loli.net/2023/02/16/1A5f4MsPiRGIOtv.gif)

[完整代码 - github](https://github.com/mytac/threejs-learning/blob/main/src/course/4-camera.js)

## Z fighting

我们在上一章中，调节 near 和 far 时，会发现 near 和 far 都有一个阈值，当 near 大于某个阈值或 far 小于某个阈值的时候，相应的前景和远景就会消失。那么为了避免这种情况的发生，为什么不把 near 设为无穷小，把 far 设为无穷大呢？

一方面是因为 GPU 计算量限制，另一方面是因为 GPU 不能确定某个东西是否在另一个东西的前面或是后面，如下：

![1-basic.gif](https://s2.loli.net/2023/02/16/b2FgLSJPfuYHI1l.gif)

当我们把 near 缩小到 0.00001 时，会发现后面的球渲染的像素错乱，这就是 “ z fighting ”，在创建 WebGLRenderer 时开启 logarithmicDepthBuffer 来解决此类问题，但会大幅降低运行速度。**所以一定要设置好合适的 near 和 far**

```js
const renderer = new THREE.WebGLRenderer({
    canvas,
    logarithmicDepthBuffer: true,
})
```

# reference

1. [官方文档-scenegraph](https://threejs.org/manual/#zh/scenegraph)
