---
title: threejs系列-图元、材质、纹理
tags:
  - three
date: 2023-01-31 16:44:11
---


# 图元

图元(primitives)就是在运行时根据大量的参数生成的 3D 形状。
应用级别的 primitives 是设计师通过一些见图然间生成的，此章中，threejs

## 图形类别

### 六面体 BoxGeometry

具体查看
[BoxGeometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry)

解释下参数

#### segments

六边形上有参数 widthSegments 、heightSegments 、depthSegments ，默认值均为 1，意思是沿着长宽高的矩形面分割几下，比如 segment=1，就是切 1 下，也就是把面切成了两块，如下：
![segment=1](https://s1.ax1x.com/2023/01/16/pS1ph8J.png)

### 平面圆、扇形

[CircleGeometry](https://threejs.org/docs/#api/en/geometries/CircleGeometry)

theta 为圆心角

#### radius

半径，默认为 1

#### thetaStart

第一个 segment 开始的角度，默认为 0（3 点钟方向）。可以理解为从哪里开始计算圆心角。

#### thetaLength

可以理解为，圆心角的角度。

[![pS1kQC8.png](https://s1.ax1x.com/2023/01/16/pS1kQC8.png)](https://imgse.com/i/pS1kQC8)

### 锥体、柱体

关于 theta\radius 的参数设置与圆形类似，详看文档

[ConeGeometry](https://threejs.org/docs/#api/en/geometries/ConeGeometry)

[CylinderGeometry](https://threejs.org/docs/#api/en/geometries/ConeGeometry)

#### openEnded

一个布尔值，当前锥体是否打开，默认为 false，即封闭。

### 球体

[SphereGeometry](https://threejs.org/docs/#api/en/geometries/SphereGeometry)

这里需要注意区分 phi 和 theta。

phiLength 默认为 Math.PI \* 2，也就是一个球形的水平方向的展开角度

[![pS1A0ot.png](https://s1.ax1x.com/2023/01/16/pS1A0ot.png)](https://imgse.com/i/pS1A0ot)

而 theta 所表示的弧形，一个球形的垂直方向的展开角度。可以理解为，当前形状的是个盆、还是个碗。

### 2d 平面 PlaneGeometry

[PlaneGeometry](https://threejs.org/docs/#api/en/geometries/PlaneGeometry)

这个形状很简单，只规定宽高和 segment 即可

### EdgesGeometry

一个工具，用来画外部框线的（和 LineSegments 结合使用），把一个 geometry 输入进去，会输出一系列的框线

```js
const geometry = new THREE.ConeGeometry(1, 2, 6)
const edges = new THREE.EdgesGeometry(geometry)
const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
)

return line
```

### 其他体

[其他形状阅读](https://threejs.org/manual/#zh/primitives)

### BufferGeometry 和 Geometry

[BufferGeometry](https://threejs.org/docs/#api/zh/core/BufferGeometry) 性能要比 Geometry 更好，但用法比较麻烦，比如要创建一个简单的平面矩形，需要我们自定义顶点，如下：

```js
const geometry = new THREE.BufferGeometry()
// 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
// 因为在两个三角面片里，这两个顶点都需要被用到。
const vertices = new Float32Array([
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
])

// itemSize = 3 因为每个顶点都是一个三元组。
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
```

而普通的 Geometry 是一系列被 three 封装好的类，其底层都是 BufferGeometry。

## segment 数量与性能关系

当 segment 越多时，表面越平滑，同时，gpu 的计算量更大，占用的内存也更大。对于球体来说，需要考虑平滑的程度和应用的适用场景，选取最折中的方案。

但，对于平面来说，无论有多少 segment，区别并不大。

# 材质

## 两种设置时机

设置材质时，分为实例化时设置和实例化后设置，换句话说，一种是把参数传入构造函数时实例化 Material 对象，另一种方式是实例化后调用实力上的方法进行参数设置。

两种方法的使用时机区别于看当前 Material 对象是否需要复用和进行定制化操作。

### 实例化时

```js
const material = new THREE.MeshPhongMaterial({
    color: 0xff0000, // 红色 (也可以使用CSS的颜色字符串)
    flatShading: true,
})
```

### 实例化后

```js
const material = new THREE.MeshPhongMaterial()
material.color.setHSL(0, 1, 0.5) // 红色
material.flatShading = true
```

## 色彩

### hsl 色彩模型

three 中支持 rgb 系统和 hsl 系统，对于 css 中经常使用的 rgb 色彩模型就不细说了。

### hue 色相

(0,1)，红色为 0，绿色为 0.66，蓝色为 0.66。hue 定一个颜色基调

### saturation 饱和度

(0,1) 0 为没有颜色，1 为原色。在色彩学中，原色饱和度最高，随着饱和度降低，色彩变得暗淡直至成为无彩色，即失去色相的色彩。

### luminance 明度

(0,1) 0 为黑色，1 为白色，0.5 为颜色的本色。也就是说，在明度 0 到 0.5 的时候，颜色由黑色逐渐渐变为色相原色；同理，明度由 1.0 到 0.5 时，颜色由白色逐渐渐变为色相原色。

### 设置方式

实例化前设置颜色：

```js
const m1 = new THREE.MeshBasicMaterial({ color: 0xff0000 }) // 红色
const m2 = new THREE.MeshBasicMaterial({ color: 'red' }) // 红色
const m3 = new THREE.MeshBasicMaterial({ color: '#F00' }) // 红色
const m4 = new THREE.MeshBasicMaterial({ color: 'rgb(255,0,0)' }) // 红色
const m5 = new THREE.MeshBasicMaterial({ color: 'hsl(0,100%,50%)' }) // 红色
```

实例化后：

```js
material.color.set(0x00ffff) // 同 CSS的 #RRGGBB 风格
material.color.set(cssString) // 任何 CSS 颜色字符串, 比如 'purple', '#F32',
// 'rgb(255, 127, 64)',
// 'hsl(180, 50%, 25%)'
material.color.set(someColor) // 其他一些 THREE.Color
material.color.setHSL(h, s, l) // 其中 h, s, 和 l 从 0 到 1
material.color.setRGB(r, g, b) // 其中 r, g, 和 b 从 0 到 1
```

## 材质类别

`MeshBasicMaterial` 不受光照的影响。

`MeshLambertMaterial` 只在顶点计算光照。

`MeshPhongMaterial` 则在每个像素计算光照，还支持镜面高光。

[Phong 网格材质(MeshPhongMaterial)](https://threejs.org/docs/#api/zh/materials/MeshPhongMaterial)

[![pS3yk3n.png](https://s1.ax1x.com/2023/01/18/pS3yk3n.png)](https://imgse.com/i/pS3yk3n)

## PBR —— Physically Based Rendering

基于物理渲染（Physically Based Rendering）的材质，已经作为 3D 应用程序的标准。PBR 会提供比标准的`MeshLambertMaterial`和`MeshPhongMaterial`更逼真的效果，但计算成本也会更高

> 这种方法与旧方法的不同之处在于，不使用近似值来表示光与表面的相互作用，而是使用物理上正确的模型。 我们的想法是，不是在特定照明下调整材质以使其看起来很好，而是可以创建一种材质，能够“正确”地应对所有光照场景。

### 标准网格材质(MeshStandardMaterial)

[标准网格材质(MeshStandardMaterial)](https://threejs.org/docs/#api/zh/materials/MeshStandardMaterial)

他与 MeshPhongMaterial 在设置光泽程度的区别在于，MeshPhongMaterial 只需要设置 shininess 属性，而 MeshStandardMaterial 需要使用 roughness 和 metalness 来定义光的反射与漫反射程度。

在基本层面，roughness 是 shininess 的对立面。粗糙度（roughness）高的东西，比如棒球，就不会有很强烈的反光，而不粗糙的东西，比如台球，就很有光泽。粗糙度的范围从 0 到 1。

另一个设定，metalness，说的是材质的金属度。金属与非金属的表现不同。0 代表非金属，1 代表金属。

这里是 MeshStandardMaterial 的一个快速示例，从左至右看，粗糙度从 0 到 1，从上至下看，金属度从 0 到 1。

[![pS3co7T.png](https://s1.ax1x.com/2023/01/18/pS3co7T.png)](https://imgse.com/i/pS3co7T)

#### roughness

材质的粗糙程度。0.0 表示平滑的镜面反射，1.0 表示完全漫反射。

（0，1）当 roughness 越接近 1，表面越粗糙，反射的光的强度越弱,漫反射能力越强，如下为 roughness=0.8，metalness=0.3

[![pS3gaUU.png](https://s1.ax1x.com/2023/01/18/pS3gaUU.png)](https://imgse.com/i/pS3gaUU)

当 roughness=0.2 时，metalness 不变，如下
[![pS3gD29.png](https://s1.ax1x.com/2023/01/18/pS3gD29.png)](https://imgse.com/i/pS3gD29)

#### metalness

材质与金属的相似度。非金属材质，如木材或石材，使用 0.0，金属使用 1.0，通常没有中间值。 默认值为 0.0。0.0 到 1.0 之间的值可用于生锈金属的外观。如果还提供了 metalnessMap，则两个值相乘。

当 roughness=0.5， metalness=0.1 时，材质越接近木材

[![pS3gqVf.png](https://s1.ax1x.com/2023/01/18/pS3gqVf.png)](https://imgse.com/i/pS3gqVf)

当 roughness 相同，metalness=0.9 时，发现材质的反射能力更强
[![pS32iZV.png](https://s1.ax1x.com/2023/01/18/pS32iZV.png)](https://imgse.com/i/pS32iZV)

### 物理网格材质(MeshPhysicalMaterial)

MeshPhysicalMaterial 与 MeshStandardMaterial 相同，但它增加了一个 clearcoat 参数，该参数从 0 到 1，决定了要涂抹的清漆光亮层的程度，还有一个 clearCoatRoughness 参数，指定光泽层的粗糙程度。

[物理网格材质(MeshPhysicalMaterial)](https://threejs.org/docs/#api/zh/materials/MeshPhysicalMaterial)

#### clearcoat

范围(0，1)。当需要在表面加一层薄薄的半透明材质的时候，可以使用与 clear coat 相关的属性，默认为 0.0;值越接近 1，反射光的能力越强。

#### clearcoatRoughness

clear coat 层的粗糙度，由 0.0 到 1.0。 默认为 0.0。和 roughness 相似，当值越接近 1，漫反射能力越强。

## 材质选择

构建速度：MeshBasicMaterial < MeshLambertMaterial < MeshPhongMaterial < MeshStandardMaterial < MeshPhysicalMaterial

构建速度越慢的材质，做出的场景越逼真，但在低功率或移动设备上，你可能需要思考代码的设计，使用构建速度较快的材质。

# 纹理

## 在立方体上应用纹理

1. 创建 TextureLoader
2. 调用其上 load 方法，传入图像的路径 url
3. 在材质上的 map 属性上使用

```js
const getImageMaterial = (url) => {
    const loader = new THREE.TextureLoader()
    const material = new THREE.MeshBasicMaterial({
        map: loader.load(url),
    })
    return material
}

const material = getImageMaterial('./static/flowers.jpg')
```

[![pSJ8oes.png](https://s1.ax1x.com/2023/01/22/pSJ8oes.png)](https://imgse.com/i/pSJ8oes)

### 设置多面纹理

materials 属性中还可传入数组，比如在 BoxGeometry 中，传入一个含有 6 种纹理的材质数组，最终呈现：（有平面的 Geometry 支持多面纹理）

```js
const loader = new THREE.TextureLoader()

const materials = [
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-1.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-2.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-3.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-4.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-5.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-6.jpg'),
    }),
]
const cube = new THREE.Mesh(geometry, materials)
```

[![pSJGpwR.png](https://s1.ax1x.com/2023/01/22/pSJGpwR.png)](https://imgse.com/i/pSJGpwR)

## 纹理加载

在使用`loader.load`方法加载纹理时，等待图片被 threejs 完全下载完成前，texture 都是完全透明的。

### 下载纹理后再渲染

我们也可使用 load 的回调函数，当纹理图片下载完成后，再将 mesh 加入到场景中。

```js
const loader = new THREE.TextureLoader();
loader.load('resources/images/wall.jpg', (texture) => {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cubes.push(cube);  // 添加到我们要旋转的立方体数组中
}
```

### 等待多纹理加载

```js
const loadManager = new THREE.LoadingManager()
const loader = new THREE.TextureLoader(loadManager)

const materials = [
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-1.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-2.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-3.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-4.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-5.jpg'),
    }),
    new THREE.MeshBasicMaterial({
        map: loader.load('resources/images/flower-6.jpg'),
    }),
]

loadManager.onLoad = () => {
    const cube = new THREE.Mesh(geometry, materials)
    scene.add(cube)
    cubes.push(cube) // 添加到我们要旋转的立方体数组中
}
```

#### 增加加载纹理图片的进度条

LoadingManager 也有一个 onProgress 属性，我们可以设置为另一个回调来显示进度指示器。

首先，我们在 HTML 中添加一个进度条

```html
<canvas id="c"></canvas>
<div id="loading">
    <div class="progress"><div class="progressbar"></div></div>
</div>
```

加上 css

```css
#loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
#loading .progress {
    margin: 1.5em;
    border: 1px solid white;
    width: 50vw;
}
#loading .progressbar {
    margin: 2px;
    background: white;
    height: 1em;
    transform-origin: top left;
    transform: scaleX(0);
}
```

然后在代码中，我们将在 onProgress 回调中更新 progressbar 的比例。调用它有如下几个参数：最后加载的项目的 URL，目前加载的项目数量，以及加载的项目总数。

```js
const loadingElem = document.querySelector('#loading')
const progressBarElem = loadingElem.querySelector('.progressbar')

loadManager.onLoad = () => {
    loadingElem.style.display = 'none'
    const cube = new THREE.Mesh(geometry, materials)
    scene.add(cube)
    cubes.push(cube) // 添加到我们要旋转的立方体数组中
}

loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal
    progressBarElem.style.transform = `scaleX(${progress})`
}
```

### 内存管理

纹理图片的存储大小与加载时长相关，而只压缩纹理图片的文件大小并不能节约内存，这是因为纹理文件占内存大小为：

```
(纹理图宽 * 纹理图高 * 4 * 1.33) Bytes
```

可见，内存大小与纹理图片的尺寸大小息息相关。
所以，**在使用纹理图片的时候，不仅要关注文件大小，更要关注尺寸大小**。

## Filtering & Mips

当纹理涂鸦>渲染对象，且渲染对象尺寸极小，比如 2\*2 像素时，GPU 通过 mipmaps 来确定每一个像素使用哪些颜色。

Mips 是纹理的副本，每一个都是前一个 mip 的一半宽和一半高，其中的像素已经被混合以制作下一个较小的 mip。Mips 一直被创建，直到我们得到 1x1 像素的 Mip。

![mips](https://threejs.org/manual/resources/images/mipmap-low-res-enlarged.png)

现在，当立方体被画得很小，只有 1 或 2 个像素大时，GPU 可以选择只用最小或次小级别的 mip 来决定让小立方体变成什么颜色。

当纹理绘制的尺寸大于其原始尺寸时，你可以将 texture.magFilter 属性设置为 THREE.NearestFilter 或 THREE.LinearFilter 。

NearestFilter 意味着只需从原始纹理中选取最接近的一个像素。对于低分辨率的纹理，这给你一个非常像素化的外观，就像 Minecraft。

LinearFilter 是指从纹理中选择离我们应该选择颜色的地方最近的 4 个像素，并根据实际点与 4 个像素的距离，以适当的比例进行混合。

```
THREE.NearestFilter 同上，在纹理中选择最近的像素。

THREE.LinearFilter 和上面一样，从纹理中选择4个像素，然后混合它们

THREE.NearestMipmapNearestFilter 选择合适的mip，然后选择一个像素。

THREE.NearestMipmapLinearFilter 选择2个mips，从每个mips中选择一个像素，混合这2个像素。

THREE.LinearMipmapNearestFilter 选择合适的mip，然后选择4个像素并将它们混合。

THREE.LinearMipmapLinearFilter 选择2个mips，从每个mips中选择4个像素，然后将所有8个像素混合成1个像素。  （效果最好，但速度慢）

```

使用 mipmaps 后，远处物体会看的更清晰，且在动态场景种，远方物体不会闪烁，渲染效果更好。

## 纹理重复、偏移、旋转、包裹

具体查看：[在线示例](https://threejs.org/manual/examples/textured-cube-adjust.html)

### 一个建镜像花纹的 tips

将包裹方式全部变为镜像重复`MirroredRepeatWrapping`，之后设置重复倍数

```js
texture.wrapS = THREE.MirroredRepeatWrapping
texture.wrapT = THREE.MirroredRepeatWrapping
texture.repeat.x = 4
texture.repeat.y = 4
```

# reference

1. [官方文档-material](https://threejs.org/manual/#zh/materials)
1. [官方文档-textures](https://threejs.org/manual/#zh/textures)
