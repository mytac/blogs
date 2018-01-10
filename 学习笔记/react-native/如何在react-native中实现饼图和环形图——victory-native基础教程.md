## 前言。。和一些关于repo起名的建议
在github上找了很多图表类的插件，大多都是直方图之类的显示完好，到了饼图都差强人意。因为react-native版本更新的快，用不同的版本必须适配不同的第三方库，所以很多repo维护的都比较慢（或者类似于[react-native-chart](https://github.com/tomauty/react-native-chart)就直接不更新了），如果你非得用某个第三方库，在你当前版本不适合的情况下，要么换库，要么就降级react-native版本。这导致在开发上非常棘手，因为是团队项目，不可能去降级react-native版本的啊，在找适合的第三方库的过程中也是一度陷入了绝望之中。直到在react-native-chart的readme中发现了[victory-native](https://github.com/FormidableLabs/victory-native)。这里，我不得不吐槽一下他的repo名，victory什么鬼啊，没用过你家react-victory的人真心不知道你是干啥的。

![这啥子命名哦！摔！错误的命名示例](http://chuantu.biz/t6/199/1515378665x-1566688692.png)

说句题外话，如果自己有repo的小伙伴一定要重视你的项目命名，最好把它的功能用命名的方式描述出来，然后详细写下description，这样才能提高star数，（来自一个刚刚参透这些道理并且写了不少repo，star数扔为0的老阿姨的忠告）。如果你经常从github上找三方库你就会发现，star数很高的项目基本上都是文档详尽，description写的很清楚的一些项目。拿react-native-chart举例，虽然也是个不错的repo，但已经不能满足当前的react-native版本了，比起victory-native还是有很多不足的地方，但是他的star数要比victory-native高一倍。起个名字还是关系着命运啊，就像`王胜利`和`王.我会做图表`一样，你会找谁做图表呢。。

![react-native-chart，想有star就该这样命名](http://chuantu.biz/t6/199/1515379472x-1566688692.png)
## 先看效果图
![demp](http://chuantu.biz/t6/200/1515462506x2067363510.png)
## 安装victory-native
首先，先要安装[react-native-svg](https://github.com/react-native-community/react-native-svg)，对应你的react-native版本号进行安装。
```
react-native-svg >= 3.2.0 only supports react-native >= 0.29.0
react-native-svg >= 4.2.0 only supports react-native >= 0.32.0
react-native-svg >= 4.3.0 only supports react-native >= 0.33.0
react-native-svg >= 4.4.0 only supports react-native >= 0.38.0 and react >= 15.4.0
react-native-svg >= 4.5.0 only supports react-native >= 0.40.0 and react >= 15.4.0
react-native-svg >= 5.1.8 only supports react-native >= 0.44.0 and react == 16.0.0-alpha.6
react-native-svg >= 5.2.0 only supports react-native >= 0.45.0 and react == 16.0.0-alpha.12
react-native-svg >= 5.3.0 only supports react-native >= 0.46.0 and react == 16.0.0-alpha.12
react-native-svg >= 5.4.1 only supports react-native >= 0.47.0 and react == 16.0.0-alpha.12
react-native-svg >= 5.5.1 only supports react-native >= 0.50.0 and react == 16.0.0
```
之后link一下
```
react-native link react-native-svg
```
重新打包安装
```
react-native run-ios
// or
react-native run-android
```
然后安装victory-native
```
yarn add victory-native
```
## 使用
先引入，这里只讨论饼图，不过很多参数都是共同的，其他的见[官方文档](https://formidable.com/open-source/victory/docs/native/)
```js
import {
  VictoryPie,
  VictoryLegend,
} from 'victory-native';
```
使用组件
```jsx
<VictoryPie
            padding={{ top: 0, left: 0 }}
            colorScale={colorScale}
            data={[
              { x: '净值', y: 35 },
              { x: '已用', y: 40 },
              { x: '可用', y: 55 },
              { x: '总盈亏', y: 55 },
            ]}
            innerRadius={px2dp(75)}
            height={256}
            width={256}
            labels={() => ''}
          />
```
### 参数
这里写的参数只是基础的几个，想要进行扩展去看下官方文档，写的非常详尽。
#### data
类似于json形式，x代表数据的类型，y是数据的值；也可以是纯数组的形式。
#### colorScale
这个参数指每个类型的颜色，是一组数组，顺序按照data中给出的顺序。如：
```js
const colorScale = ['tomato', 'orange', 'gold', 'navy'];
```
#### innerRadius
指的是圆形中间的圆半径大小。如果设置为0就是一个纯饼图。
#### height,width
设置整个svg的大小，不设置默认为填充父组件。
#### labels
标签名，将data进行处理后渲染到图中。因为需求中不显示标签名，所以设置为`()=>{}`
```jsx
<VictoryPie
  data={sampleData}
  labels={(d) => `y: ${d.y}`}
/>
```
#### padding
内边距大小。这个属性默认并不为0，所以会在分辨率不同的设备上显示不一，建议设置为0，然后在整个组件外部包个View进行显示。
## 图例
```jsx
<VictoryLegend
              padding={{ top: 0, left: 0 }}
              title=""
              orientation="vertical"
              style={{ labels: { fontSize: sizes.f2 } }}
              gutter={px2dp(25)}
              data={[
                {
                  name: '净值',
                  symbol: { fill: 'tomato', type: 'square' },
                },
                {
                  name: '已用',
                  symbol: { fill: 'orange', type: 'square' },
                },
                {
                  name: '可用',
                  symbol: { fill: 'gold', type: 'square' },
                },
                { name: '总盈亏', symbol: { fill: 'navy', type: 'square' } },
              ]}
              width={px2dp(150)}
            />
```
### 参数
#### title
整个图例的名字。如```title='图例'```
#### data
类似于json的数据结构，包含图例名(name)，和图例样式(type)以及图例颜色(fill)。
#### gutter
指的是每条图例之间的间距。
#### orientation
图例的排列方式。横排或纵排。
## 参考资料
1. [react-native-svg repo 地址](https://github.com/react-native-community/react-native-svg)
2. [victory-native repo 地址](https://github.com/FormidableLabs/victory-native)
3. [victory官方文档](https://formidable.com/open-source/victory/docs/native/)