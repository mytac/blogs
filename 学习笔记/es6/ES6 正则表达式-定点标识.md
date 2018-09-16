## 前言
最近在读《你不知道的js》下册，发现了一个有意思的东东：正则表达式中新增的标签模式y，英文是stick，书中译作"定点模式"。*定点模式*主要是指在正则表达式的起点有一个虚拟锚点，只从`lastIndex`属性制定的位置开始匹配。

## 匹配规则
```js
const re=/foo/y
const re2=/foo/
const str='##foo##'

re.lastIndex // 0
re.test(str) // false
re2.test(str) // true
re.lastIndex // 0

re.lastIndex=2
re.test(str) // true
re.lastIndex // 5 匹配成功后会更新lastIndex

re.test(str) // false 匹配失败后lastIndex会重置为0
re.lastIndex // 0
```
从上面的例子中可以看出，正则从lastIndex位置开始匹配，如果不匹配返回false并将lastIndex重置为0；如果匹配成功，lastIndex则会更新至匹配内容之后的字符。
## 适用场景
### 结构化的输入字符串
如匹配：`"1. aaa 2. bbb 3. ccc"`这个字符串，可以明显感知到这个模式是一个数字序号后跟空格+内容+空格，这种模式对应正则表达式为`/\d+\.\s(.*?)(?:\s|$)/`。
```js
const pattern=/\d+\.\s(.*?)(?:\s|$)/y
const str='1. aaa 2. bbb 3. ccc'

str.match(pattern) // "1. aaa ", "aaa"
pattern.lastIndex // 7

str.match(pattern) // "2. bbb ", "bbb"
pattern.lastIndex // 14

str.match(pattern) // "3. ccc", "ccc",
pattern.lastIndex // 20
```
## 与g模式的区别
g全局匹配和`exec()`方法可以模拟这种相对于lastIndex的匹配，如下:
```js
const re=/o+./g
const str='foot book more'

re.exec(str) // ['oot']
re.lastIndex // 4

re.exec(str) // ['ook']
re.lastIndex // 9   

re.exec(str) // ['or']
re.lastIndex // 13
```
我们可以看到，g模式非定点匹配可以在匹配过程中自由向前移动，之后更新lastIndex值。在第二个匹配中，如果是定点匹配，将会匹配失败
## 新增属性flags
在es6之前，我们如果需要检查一个正则表达式对象应用了哪些标识，首先要将它转化为字符串，再套用正则。

而在es6中，我们用新的属性flags可以直接获得这些值。
```js
const re=/foo/ig
re.flags // gi
```
至于这里为什么不是ig，是因为es6规范中规定了表达式的标识按照`"gimuy"`的顺序列出，无论原始指定的模式是什么。