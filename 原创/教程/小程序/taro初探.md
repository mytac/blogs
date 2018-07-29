## 前言
由于微信小程序在开发上不能安装npm依赖，和开发流程上也饱受诟病；Taro 是由京东·凹凸实验室(aotu.io)倾力打造的 多端开发解决方案，在本篇文章中主要介绍了使用taro搭建微信小程序的一些步骤和一个简单demo的实现。
## 安装
先全局安装`@tarojs/cli`
```
$ npm install -g @tarojs/cli
$ yarn global add @tarojs/cli
```
之后我们初始化一个名为`myApp`的项目:
```
$ taro init myApp
```
然后输入你的配置：
![demo](http://chuantu.biz/t6/341/1531232346x-1404817629.png)

之后等待所有依赖安装完毕。
## 开发
在命令行执行
```
$ npm run dev:weapp
```
taro将会进入微信小程序编译预览模式。我们打开微信开发者工具，将项目导入，会在预览窗口中看到hello world。这时我们就可以进行开发啦~~
### 1.生命周期函数
生命周期方法|作用|说明
-|-|-|
componentWillMount|程序被载入|对应微信小程序`onLaunch`
componentDidMount|程序被载入|对应微信小程序`onLaunch`，在`componentWillMount`之后执行
componentDidShow|程序展示出来|对应微信小程序`onShow`
componentDidHide|程序被隐藏|对应微信小程序`onHide`

不过当然也包含`componentWillUnmout `和`componentWillReceiveProps `等react原始生命周期函数，用来编写自定义组件。
### 2.路由
在 Taro 中，路由功能是默认自带的，不需要开发者进行额外的路由配置。
```js
// 跳转到目的页面，打开新页面
Taro.navigateTo({
  url: '/pages/page/path/name'
})

// 跳转到目的页面，在当前页面打开
Taro.redirectTo({
  url: '/pages/page/path/name'
})
```
#### 传参
```js
// 传入参数 id=2&type=test
Taro.navigateTo({
  url: '/pages/page/path/name?id=2&type=test'
})
```
我们可以使用`this.$router.params`来获取路由上的参数。
### 3.组件
Taro 以 微信小程序组件库 为标准，结合 jsx 语法规范，定制了一套自己的组件库规范。这部分可以自行去看文档。**值得注意的是，小程序中的写法`bind*`这种事件都要改成以`on`开头。**
## 写个demo
现在使用taro构建一个很简单的demo；需要实现简单的组件调用，路由跳转传参等功能。

![demo](http://chuantu.biz/t6/344/1531818095x-1566688299.gif)
### 1.主页
一个Swiper，一个列表组件：
```jsx
// index.js
import Taro, { Component } from '@tarojs/taro'
import { View, Swiper,SwiperItem, Image } from '@tarojs/components'
import ListItem from '../../components/ListItem'
import './index.less'
import img0 from './img/img0.jpg'
import img1 from './img/img1.jpg'
import img2 from './img/img2.jpg'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  skipToDetail(){
    /*  */
  }

  render() {
    return (
      <View className='index'>
        <Swiper indicatorDots autoplay>
        {[img0,img1,img2].map(img=>(<SwiperItem key={img}><Image src={img} /></SwiperItem>))}
        </Swiper>
      {listSet.map(item=>(<ListItem onClick={this.skipToDetail.bind(this)} description={item.description} title={item.title} key={item.title} />))}
      </View>
    )
  }
}

const listSet=[
  {title:'标题一',description:'描述一'},
  {title:'标题二',description:'描述二'},
  {title:'标题三',description:'描述三'},
]
```
列表组件，注意这里有个坑，就是不能直接调用函数props，会报一个警告，说是没有找到`onClick handler`。查阅官方文档后，在[issues 215](https://github.com/NervJS/taro/issues/215)中找到了答案，官方说是会在以后的版本中修复这个bug，目前先按下面代码写。
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class ListItem extends Component {
    skipToDetail(){
        /* 必须得这样写=。= */
        this.props.onClick()
      }
    render() {
        const { title, description } = this.props
        return (
            <View className='list-item' onClick={this.skipToDetail}>
                <View><Text>{title}</Text></View>
                <View><Text>{description}</Text></View>
            </View>
        )
    }
}
```
### 2.详情页跳转
我们在入口文件添加新的路由，指向详情页detail：
**这里需要注意先配置好pages，然后再写这个组件，要不再编译的时候会找不到这个页**
```js
// app.js
 config = {
    pages: [
      'pages/index/index',
      'pages/detail/index'
    ],
    ...
  }
```
创建详情页：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

export default class Index extends Component {
  componentWillMount () {
  }
  config = {
    navigationBarTitleText: '详情页'
  }

  render () {
    const {title,description}=this.$router.params
    return (
      <View>
        ...
      </View>
    )
  }
}
```
要求点击每个列表项，需要进行跳转，并把当前的title和description传到详情页。需要在首页中的`skipToDetail`中补充以下内容：
```js
skipToDetail({title,description}){
    Taro.navigateTo({
      url: `/pages/detail/index?title=${title}&description=${description}`
    })
  }
```
并在render方法中将参数传入这个函数中：
```js
 render() {
    return (
      <View className='index'>
        ...
      {listSet.map(item=>(<ListItem onClick={this.skipToDetail.bind(this,item)} description={item.description} title={item.title} key={item.title} />))}
      </View>
    )
  }
```
## 参考文档
1. [taro官网文档](https://taro.aotu.io/)