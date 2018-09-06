 `Decorator`（修饰器/装饰器）是es6提出的语法糖，用于修改类的行为。不过目前主流浏览器都没有很好的支
 持，我们需要用babel来转换为浏览器能识别的语言。
## 1.修饰类
### (1) 基础用法
```js
@testable
class MyClass{}

function testable(target){
    target.isTestable=true
}

console.log(MyClass.isTestable) // true
```
贴一下babel转换后的代码，
```js
var _class;

let MyClass = testable(_class = class MyClass {}) || _class;

function testable(target) {
    target.isTestable = true;
}
```
也可以在`prototype`上修改属性，也可以为修饰器添加多个参数。
```js
@testable(false)
class MyAnotherClass{
    
}
function testable(status){
    return target=>{target.prototype.isTestable=status}
}
console.log('MyClass.isTestable',MyAnotherClass.prototype.isTestable) // false
```
当然我们通过修饰器，把某个对象的方法添加到目标类的实例上，注意要在类的`prototype`上添加。
```js
const foo={isTestable:true}
function testable(...list){
    return target=>{Object.assign(target.prototype,...list)}
}

@testable(foo)
class MyAnotherClass{}
const obj=new MyAnotherClass()

console.log('MyClass.isTestable',obj.isTestable) // true
```
### (2) 应用
在`React App`的开发中，使用`redux`通常需要`react-redux`中的`connect`方法，将两者结合在一起。通常的写法是：
```js
class MyReactComponent extends React.Component {}

export default connect(mapStateToProps, mapDispatchToProps)(MyReactComponent);
```
如果使用`decorator`，代码可读性更高了一些。
```js
@connect(mapStateToProps, mapDispatchToProps)
export default class MyReactComponent extends React.Component {}
```
## 2.修饰方法
### (1).基础用法
```js
// target:在方法中的target指向类的prototype
function readonly(target,key,descriptor){
    descriptor.writable=false
    return descriptor
}

class MyClass{
    @readonly
    print(){console.log(`a:${this.a}`)}
}
```
### (2).js中Object的属性
其中`descriptor`对象为Object的数据属性。之前我们会使用`Object.defineProperty`来描述对象的属性，如下：
```js
var person = {}
Object.defineProperty(person,'name',{
    configurable:false,//能否使用delete、能否需改属性特性、或能否修改访问器属性、，false为不可重新定义，默认值为true
    enumerable:false,//对象属性是否可通过for-in循环，flase为不可循环，默认值为true
    writable:false,//对象属性是否可修改,flase为不可修改，默认值为true
    value:'xiaoming' //对象属性的默认值，默认值为undefined
});
```
对应到`descriptor`为下面四个属性：
```js
{
     value: specifiedFunction,
     enumerable: false,
     configurable: true,
     writable: true
};
```
### (3). 应用
我们开始写一个`@log`修饰器，可以输出日志：
```js
class Math{
    @log
    add(a,b){
        return a+b
    }
}

const math=new Math()
math.add(1,2)

function log(target,name,descriptor){
    const oldValue=descriptor.value

    descriptor.value=function(){
        console.log(`calling ${name} with ${JSON.stringify(arguments)}`)
        return oldValue.apply(this,arguments)
    }

    return descriptor
}
```
上面的代码中，`@log`作用是在返回结果前，打印函数名和其参数，起到输出日至的作用。上面的程序运行后，控制台将输出：
```
calling add with {"0":1,"1":2}
```
### (4). 多个修饰器
良好命名的修饰器可以起到简洁注释的作用，如下：
```js
class Example {
    @readonly
    @enumable
    method(){}
}
```
多个修饰器的执行顺序是由外向内进入；再由内向外执行。
```js
class Example {
    @decorator(1)
    @decorator(2)
    method(){}
}

function decorator(id){
    console.log('id is ',id)
    return (target,property,descriptor)=>console.log('executed',id)
}
```
控制台输出
```
id is  1
id is  2
executed 2
executed 1
```
## 附录：babel配置
babel插件`transform-decorators`还没有正式版，我们可以用`transform-decorators-legacy`。
### 安装babel
```
yarn add babel-plugin-transform-decorators-legacy babel-preset-es2017
```
### 配置.babelrc
```
{
    "presets": ["es2017"],
    "plugins":[
        "transform-decorators-legacy"
    ]
}
```
### 执行编译后的文件
因为我们为了测试，没必要非得放在浏览器里看了，可以用node执行babel转换后的文件。直接运行`yarn start`。
```
// package.json

 "scripts": {
    "build": "babel ./decorator -d lib",
    "start":"yarn build && node ./lib/index.js"
  },
```

## 参考链接
1. [ECMAScript 6 入门 -- 修饰器](http://es6.ruanyifeng.com/#docs/decorator)

