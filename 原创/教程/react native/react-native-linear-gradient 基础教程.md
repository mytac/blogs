# 安装
```
yarn add react-native-linear-gradient

react-native link react-native-linear-gradient
```
安装之后运行```react-native run-android```可能会报错，比如说我会报一个```cannot delete [filename]```之类的错误，把他说的那几个文件删了，再多run几次就成功了。

# 使用
```js
// 引用官网的例子
import LinearGradient from 'react-native-linear-gradient';
// Within your render function
<LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
  <Text style={styles.buttonText}>
    Sign in with Facebook
  </Text>
</LinearGradient>

// Later on in your styles..
var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
```
![官网的例子](http://upload-images.jianshu.io/upload_images/3790386-368206b17af44bae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
# 配置
## color
数组。一定要提供给他**不少于两个**元素，比如```['red','blue']```，表示从红到蓝的渐变。

本例用```colors={['#295cce', '#14b7e6', '#fff']}```
## start
对象。可选。格式为```{x:number,y:number}```。坐标从左上角开始，声明渐变开始的位置，作为渐变整体大小的一部分。示例：{x：0.1，y：0.1}表示梯度将从顶部开始为10％，从左侧开始为10％。
## end
和start一样。是指渐变的结束。

举个例子，比如我们需要从右上角开始到左下角渐变，即对角线渐变，这时就需要设置
```js
start={{x:1,y:0}}
end={{x:0,y:1}}
```
![对角线渐变](http://upload-images.jianshu.io/upload_images/3790386-3dc9638918c75cd4.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## locations


数组。可选。定义每个渐变颜色停止的位置，映射到颜色相同的索引颜色。例如：```[0.1,0.75,1]```表示第一种颜色将占0％-10％，第二种颜色将占据10％-75％，最终第三种色彩将占据75％-100％。

在上例的基础上，我们想让白色占比多一点，让他占50%，即从0.5到1这个区间都为白色,深蓝色和湖蓝色平分渐变这个区间。
locations就可以这样设置：
```js
locations={[0, 0.25, 0.5]}
```

![location例子](http://upload-images.jianshu.io/upload_images/3790386-183c327fd839a7f6.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 相关资料
[react-native-linear-gradient 官方文档](https://github.com/react-native-community/react-native-linear-gradient/blob/master/README.md)