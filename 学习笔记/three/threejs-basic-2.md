---
title: threejs系列-响应式设计
tags:
  - three
date: 2023-01-14 21:56:35
---


## 自适应

### 初始化

对于需要渲染的 canvas 和整体 html 的样式进行初始化：

```css
html,
body {
    margin: 0;
    height: 100%;
}
#c {
    width: 100%;
    height: 100%;
    display: block;
}
```

### 元素变形 ———— 更新相机 aspect

当变换窗口大小的时候，发现元素变形，这是因为窗口大小改变->canvas 宽高 100%变化-> 坐标系压缩/拉伸 -> 画布元素和相机也被拉伸。

[![pSQ95oF.md.png](https://s1.ax1x.com/2023/01/14/pSQ95oF.md.png)](https://imgse.com/i/pSQ95oF)

这是要调节宽高比，将相机的宽高比调节为画布宽高比

```js
// 相机随着屏幕宽高自适应aspect
const cameraResponsive = (camera, renderer) => {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
}
```

#### PerspectiveCamera.updateProjectionMatrix

执行摄像机投影的更新，必须在设置参数之后执行。

> Updates the camera projection matrix. Must be called after any change of parameters.[=> PerspectiveCamera.updateProjectionMatrix](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.updateProjectionMatrix)

### 分辨率过低、块状化 ———— 更新 canvas drawingbuffer

canvas 元素有两个尺寸。一个是 canvas 在页面上的显示尺寸， 是我们用 CSS 来设置的。另一个尺寸是 canvas 本身像素的数量。这和图片一样。 比如我们有一个 128x64 像素的图片然后我们可以通过 CSS 让它显示为 400x200 像素。

```html
<img src="some128x64image.jpg" style="width:400px; height:200px" />
```

#### drawingbuffer canvas 绘图缓冲区

canvas 的内部尺寸，就是 drawingbuffer 尺寸，当显示的尺寸与 drawingbuffer 尺寸相等时，才不会出现块状化的情况。

所以，在 threejs 中，可以调用`renderer.setSize`设置 canvas 的绘图缓冲区，当外部显示区域变化的时候，drawingbuffer 也要随之变化。

用一个函数来检查渲染器的 canvas 的内部尺寸是否与显示的尺寸一样，如果不一样就使其相等。

```js
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        renderer.setSize(width, height, false) // 传入false，禁止css样式更新
    }
    return needResize
}
```

#### renderer.resize(width,height,updateStyle)

##### .setSize ( width : Integer, height : Integer, updateStyle : Boolean ) : undefined

> Resizes the output canvas to (width, height) with device pixel ratio taken into account, and also sets the viewport to fit that size, starting in (0, 0). Setting updateStyle to false prevents any style changes to the output canvas.
> [=> WebGLRenderer.setSize](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setSize)

### 组合自适应函数

将上面的两种自适应解决方案进行整合

```js
// 相机随着屏幕宽高自适应aspect
const cameraResponsive = (camera, renderer) => {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
}

// 判断render是否需要 resize
const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
    const width = (canvas.clientWidth * pixelRatio) | 0
    const height = (canvas.clientHeight * pixelRatio) | 0
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        renderer.setSize(width, height, false)
    }
    return needResize
}
```

在使用时，可写成

```js
if (resizeRendererToDisplaySize(renderer)) {
    cameraResponsive(camera, renderer)
}
```

或是，直接抽成独立的函数

```js
const responsive = (renderer, camera) => {
    if (resizeRendererToDisplaySize(renderer)) {
        cameraResponsive(camera, renderer)
    }
}
```

使用时，如

```js
renderer.render(scene, camera)
responsive(renderer, camera)
requestAnimationFrame(render)
```

最终效果

[![pSQ9TJJ.md.png](https://s1.ax1x.com/2023/01/14/pSQ9TJJ.md.png)](https://imgse.com/i/pSQ9TJJ)

## 相关链接

1.[Transformations, Coordinate Systems, and the Scene Graph](https://discoverthreejs.com/book/first-steps/transformations/#coordinate-systems-world-space-and-local-space)
