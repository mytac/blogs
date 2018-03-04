# 前言
> JavaScript是一种伟大的语言。它有一个简单的语法，大的生态系统，最重要的是一个伟大的社区。
> 同时，我们都知道JavaScript是一个非常有趣的语言特性。他们中的一些可以迅速将我们的日常工作变成地狱，有些可以让我们大声笑起来。
> WTFJS的最初想法属于Brian Leroux。该清单受到他在[2012年dotJS上的演讲“WTFJS”](https://www.youtube.com/watch?v=et8xNAc2ic8)的高度启发：

> 这篇文章主要是收集一些奇奇怪怪的例子，并解释他是如何工作的。如果你是初学者，您可以使用这些注释来深入了解JavaScript。我希望这些笔记会激励你花更多的时间阅读规范。如果您是资深的开发人员，您可以将这些示例视为对我们所爱的JavaScript的所有怪癖和意想不到的地方的参考内容。

无论如何，只要读了这篇文。你可能会找到新的东西。
[查看原文](https://github.com/denysdovhan/wtfjs)
# Example
## [] is equal ![]
```
[]==![] //true 
```
**相等运算符**的比较有指定的规则，
> 1.如果其中一个值是true，则将其转换为1再进行比较。如果其中一个值是false，则将其转换为0再进行比较。

> 2.如果一个值是对象，另一个值是数字或字符串，则将对象转换为原始值再进行比较。对象通过toString()方法或valueOf()方法转换为原始值。JavaScript语言核心的内置类首先尝试使用valueOf()，在尝试使用toString()，除了日期类，日期类只使用toString()方法，那些不是JavaScript语言核心中的对象则通过各自实现中定义的方法转换为原始值。

```![]``` 为布尔值，根据第一条规则，先转换为数值0。这时为空数组和数字0的比较。根据第二条，空数组优先调用valueOf()方法,空数组转换为空字符串；如果一个值为字符串、一个为数字，将字符串转化为数字进行比较。
## true is false
```
!!'false' ==  !!'true'  // -> true
!!'false' === !!'true' // -> true
```
这是因为```!```跟一个字符串都将他转换为布尔值，所以不论是```!'fasle'```还是```!'true'```都是fasle，再取反即为true.
## baNaNa
```
'b' + 'a' + + 'a' + 'a' // -> "baNaNa"
'foo' + + 'bar' // -> 'fooNaN'
```
> 在对非数值应用**一元加操作符**时，该操作符会像```Number()```转型函数一样对这个值进行转换。布尔值会被转换为0/1，字符串根据相应的规则进行转换，对象调用```valueOf()```和（或）```toString()```方法，再转换得到的值。

```'b' + 'a' + + 'a' + 'a' ```与```'foo' + (+'bar')```等价。根据以上一元加操作符的规则，```Number('bar')```转换为NaN。再进行```'foo'+NaN```，如果有只有一个操作符为字符串，则将另一个操作符转换为字符串，调用```toString()```方法，进行拼接。
## NaN is not a NaN
```
NaN === NaN // -> false
```
因为任何涉及到NaN的操作，都会返回NaN。NaN与任何值都不相等，包括NaN本身。
在IEEE中，是这样定义NaN的：
> 存在四种相互排斥的关系：小于，等于，大于和无序。当至少有一个操作数是NaN时，最后一种情况出现。每个NaN都要比较无穷无尽的一切，包括自己。

所以，NaN!==NaN为true。
## It's a fail
你可能不相信，但OVO
```
    (![]+[])[+[]]+(![]+[])[+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]
// -> 'fail'
```
先把大串符号分解成碎片，会以下的模式经常出现
```
![]      // -> false
(![]+[]) // -> 'false'
[][[]] // -> undefined
[![]]+[][[]] // -> 'falseundefined'
```
> 对于**加性操作符**，如果有一个操作数是对象、数值或布尔值，则调用```toString()```方法取得相应的字符串，再应用前面的关于字符串的规则。

![]是个布尔值，根据以上规则，```[].toString()```为空字符串，拼接起来为字符串false。
```
[+[]] // -> [0]
(![]+[])[+[]] // -> 'f'
[+!+[]] // -> [1]
(![]+[])[+!+[]] // -> 'a'
[]+[+[]] // -> '0'
+!+[] // -> 1
+!+[]+[]+[+[]]  //-> '10'
([![]]+[][[]])[+!+[]+[+[]]] // -> 'i'
!+[]+!+[] // true+true -> 2
(![]+[])[!+[]+!+[]] // 'l'
```
## [] is truthy, but not true
数组是一个真实的值，但并不等于true
```
!![]       // -> true
[] == true // -> false
```
> 对于**相等操作符**来说，先将操作数强制转型，再进行比较。
当一个操作数为布尔值时，先将他转换为数值，false->0,true->1。
一个操作数为字符串，一个为数值时，将字符串转换为数值。
一个为对象，另一个不是对象，调用```valueOf()```方法，按照前面的规则进行比较。

[]转换为0，true转换为1，所以```[] == true```为fasle
## null is falsy, but not false
尽管null是一个falsy，但它不等于false
```
!!null        // -> false
null == false // -> false
```
同时，其他的falsy，如0或“”等于false。
```
0 == false  // -> true
'' == false // -> true
```
这是因为，在比较相等性之前，不能将null和undefined转换成其他任何值。null和undefined是相等的。
## Minimal value is greater than zero 最小值大于0
```
Number.MIN_VALUE > 0 // -> true
```
Number.MIN_VALUE是5e-324，5*10的-324次幂。
## Adding arrays
你试过将两个数组相加吗
```
[1, 2, 3] + [4, 5, 6]  // -> '1,2,34,5,6'
```
这是因为在相加的时候调用了```toString()```，```[1,2,3]```转换为```1,2,3```，```[4,5,6]```转换为```4,5,6```，然后拼接起来为```1,2,34,5,6```。
## Trailing commas in array 数组中的尾随逗号
您创建了一个包含4个空元素的数组。尽管如此，你会得到一个有三个元素的数组
```
let a = [,,,]
a.length     // -> 3
a.toString() // -> ',,
```
在javascript中，当添加一个元素、参数或属性时，尾随逗号（有时又被称作最后的逗号）很有用。如果要添加新的属性，只需添加新行即可，如果该行已经使用了一个逗号，那么不修改之前的最后一行。如果要添加新的属性，只需添加新行即可，如果该行已经使用了一个逗号，那么不修改之前的最后一行。
## Array equality is a monster
```
[] == ''   // -> true
[] == 0    // -> true
[''] == '' // -> true
[0] == 0   // -> true
[0] == ''  // -> false
[''] == 0  // -> true

[null] == ''      // true
[null] == 0       // true
[undefined] == '' // true
[undefined] == 0  // true

[[]] == 0  // true
[[]] == '' // true

[[[[[[]]]]]] == '' // true
[[[[[[]]]]]] == 0  // true

[[[[[[ null ]]]]]] == 0  // true
[[[[[[ null ]]]]]] == '' // true

[[[[[[ undefined ]]]]]] == 0  // true
[[[[[[ undefined ]]]]]] == '' // true
```
因为在强制转型时，调用```toString()```方法，以上示例的数组都被转换为空字符串，在比较时转换为0.
## undefined and Number
如果我们没有将任何参数传递给Number构造函数，我们将得到0。当没有实际参数时，undefined被分配给形式参数,所以你可能认为没有参数的Number将不定义为其参数的值。但是，当我们传递undefined时，将得到NaN。
```
Number()          // -> 0
Number(undefined) // -> NaN
```
> 对于```Number()```方法，传入布尔值，true和fasle会被转换为1/0；传入null，返回0；传入undefined，返回NaN；如果是字符串将根据特殊规则进行转换；如果是对象，调用```valueOf()```方法，按照前面的规则进行转换，如果返回值为NaN，则调用对象的```toString()```方法，再次按照前面的规则转换返回的字符串值。

## parseInt is a bad guy
parseInt是因为它的怪癖算法所闻名的
```
parseInt('f*ck');     // -> NaN
parseInt('f*ck', 16); // -> 15
```
这是因为```parseInt```将继续逐行解析字符，直到它触及不知道的字符。 ```f*ck```中的f是十六进制数字15
```
parseInt('Infinity', 10) // -> NaN
// ...
parseInt('Infinity', 18) // -> NaN...
parseInt('Infinity', 19) // -> 18
// ...
parseInt('Infinity', 23) // -> 18...
parseInt('Infinity', 24) // -> 151176378
// ...
parseInt('Infinity', 29) // -> 385849803
parseInt('Infinity', 30) // -> 13693557269
// ...
parseInt('Infinity', 34) // -> 28872273981
parseInt('Infinity', 35) // -> 1201203301724
parseInt('Infinity', 36) // -> 1461559270678...
parseInt('Infinity', 37) // -> NaN
```
在解析```null```时也要注意
```
parseInt(null, 24) // -> 23
```
它将null转换为字符串“null”，并尝试转换它。对于基数0到23，没有可以转换的数字，因此返回NaN。在24时，将第14个字母的“n”加到数字系统中。在31，添加第二十一个字母“u”，可以解码整个字符串。在37处，不再有可以生成的有效数字集合，并且返回NaN。

不要忘了八进制
```
parseInt('06'); // 6
parseInt('08'); // 8 ECMAScript 5
parseInt('08'); // 0 ECMAScript 3
```
这是因为，字符串从0开始，基数为8或10进制，```parseInt()```不加入第二个参数，es3中当作八进制处理，es5中当作十进制处理。所以，在使用```parseInt()```时，要指定基数。
## Math with true and false
```
true + true // -> 2
(true + true) * (true + true) - true // -> 3
```
这是因为在计算的过程中，true被强制转换成1。在上一篇文中说到的一元加操作符，也是像Number()转型函数一样，对一个值进行强制转换。
```
Number(true) // -> 1
+true // -> 1
```
## HTML注释在JavaScript中有效
```<!--``` 在JavaScript中是有效的注释。这是因为html类似的注释，可以在不了解```<script>```标签的浏览器中优雅的降级。
这些浏览器，例如Netscape 1.x不再受欢迎。所以，将HTML注释放在你的脚本标签中真的没有任何意义。由于Node.js基于V8引擎，Node.js运行时也支持类似HTML的注释。此外，它们是规范的一部分。
## NaN is ~~not~~ a number
```NaN``` 的类型是number
```
typeof NaN   //  -> 'number'
```
## []和null是对象
```
typeof []   // -> 'object'
typeof null // -> 'object'

// 然而
null instanceof Object // false
```
因为null会被认为是一个空对象引用。用```toString```去检查一下null的类型
```
Object.prototype.toString.call(null)
// -> '[object Null]'
```
## 神奇增加的数字
```
999999999999999  // -> 999999999999999
9999999999999999 // -> 10000000000000000

10000000000000000       // -> 10000000000000000
10000000000000000 + 1   // -> 10000000000000000
10000000000000000 + 1.1 // -> 10000000000000002
```
这是由IEEE 754-2008二进制浮点运算标准引起的。在这个尺度上，它会舍入到最接近的偶数。
## 0.1+0.2的精确度
一个很著名的笑话，0.1+0.2加起来“超级”精确。
```
0.1 + 0.2 // -> 0.30000000000000004
(0.1 + 0.2) === 0.3 // -> false
```
这是因为浮点数在保存时会变成二进制，无法准确的表示一个浮点数，只能逼近，因此会产生误差。这个问题不仅仅是在JavaScript中出现，他发生在使用浮点数的每种编程语言中。[访问0.30000000000000004.com](http://0.30000000000000004.com/)
## Patching numbers 修补数字
你可以在String或是Number中扩展自己的方法
```
Number.prototype.isOne = function () {
  return Number(this) === 1
}

1.0.isOne() // -> true
1..isOne()  // -> true
2.0.isOne() // -> false
(7).isOne() // -> false
```
您可以像JavaScript中的任何其他对象一样扩展Number对象。但是，如果定义的方法的行为不是规范的一部分，则不建议。[这是Number的属性列表](https://www.ecma-international.org/ecma-262/#sec-number-objects)
## 三个数字的比较
```
1 < 2 < 3 // -> true
3 > 2 > 1 // -> false
```
为什么会这样呢呢？那么问题在于表达式的第一部分。以下是它的工作原理：
```
1 < 2 < 3 // 1 < 2 -> true
true  < 3 // true -> 1
1     < 3 // -> true

3 > 2 > 1 // 3 > 2 -> true
true  > 1 // true -> 1
1     > 1 // -> false
```
## 有趣的数学
通常JavaScript中的算术运算结果可能是非常意想不到的。考虑这些例子：
```
 3  - 1  // -> 2
 3  + 1  // -> 4
'3' - 1  // -> 2
'3' + 1  // -> '31'

'' + '' // -> ''
[] + [] // -> ''
{} + [] // -> 0
[] + {} // -> '[object Object]'
{} + {} // -> '[object Object][object Object]'

'222' - -'111' // -> 333

[4] * [4]       // -> 16
[] * []         // -> 0
[4, 4] * [4, 4] // NaN
```
前四个例子发生了什么？这是一个小表，以了解JavaScript中的加法：
```
Number  + Number  -> addition
Boolean + Number  -> addition
Boolean + Boolean -> addition
Number  + String  -> 字符串连接
String  + Boolean -> 字符串连接
String  + String  -> 字符串连接
```
## RegExps的扩充
你知道能像这样添加数字吗？
```
// Patch a toString method
RegExp.prototype.toString = function() {
  return this.source
}

/7/ - /5/ // -> 2
```
[详解](https://www.ecma-international.org/ecma-262/#sec-regexp.prototype-@@search)
## 字符串并不是String的实例
```
'str' // -> 'str'
typeof 'str' // -> 'string'
'str' instanceof String // -> false
```
String的构造函数返回一个字符串
```
typeof String('str')   // -> 'string'
String('str')          // -> 'str'
String('str') == 'str' // -> true
```
我们用new来试一下：
```
new String('str') == 'str' // -> true
typeof new String('str')   // -> 'object'
```
一个对象？那是啥？
```
new String('str') // -> [String: 'str']
```
[有关规范中的String构造函数的更多信息](https://www.ecma-international.org/ecma-262/#sec-string-constructor)
## 用反引号调用函数
我们来声明一个将所有参数记录到控制台中的函数：
```
function f(...args) {
  return args
}
```
你当然知道你可以像这样调用这个函数
```
f(1, 2, 3) // -> [ 1, 2, 3 ]
```
但是你尝试过使用反引号来调用函数吗
```
f`true is ${true}, false is ${false}, array is ${[1,2,3]}`
// -> [ [ 'true is ', ', false is ', ', array is ', '' ],
// ->   true,
// ->   false,
// ->   [ 1, 2, 3 ] ]
```
如果你熟悉Tagged模板文字，这并不是很神奇。在上面的例子中，f函数是模板文字的标签。模板文字之前的标签允许您使用函数解析模板文字。标签函数的第一个参数包含字符串值的数组。其余的参数与表达式有关。
```
function template(strings, ...keys) {
  // do something with strings and keys…
}
```
这是一个著名的lib，[styled component](https://www.styled-components.com/)，在React社区很有名。
## Call call call
```
console.log.call.call.call.call.call.apply(a => a, [1, 2]) // -> 2
```
这很可能会打乱你的思路，尝试在你头脑中重现：我们正在使用apply方法调用call方法。
## 构造函数的属性
```
const c = 'constructor'
c[c][c]('console.log("WTF?")')() // > WTF?
```
让我们把他分解来看
```
// Declare a new constant which is a string 'constructor'
const c = 'constructor'

// c is a string
c // -> 'constructor'

// Getting a constructor of string
c[c] // -> [Function: String]

// Getting a constructor of constructor
c[c][c] // -> [Function: Function]

// Call the Function constructor and pass
// the body of new function as an argument
c[c][c]('console.log("WTF?")') // -> [Function: anonymous]

// And then call this anonymous function
// The result is console-logging a string 'WTF?'
c[c][c]('console.log("WTF?")')() // > WTF?
```
## 对象作为key
```
{ [{}]: {} } // -> { '[object Object]': {} }
```
这里我们使用Computed属性名称。当您在这些括号之间传递对象时，强制把一个对象转成字符串，所以我们得到属性键'[object Object]'和值{}。
## `${{Object}}`
```
`${{Object}}` // -> '[object Object]'
```
我们使用Shorthand属性表示法定义了一个带有属性Object的对象：```{Object:Object}```然后我们将这个对象传递给模板文字，所以toString方法调用该对象。这就是为什么我们得到字符串```'[object Object]'```。
## 使用默认值进行结构化
```
let x, { x: y = 1 } = { x }; y;  // -> y为1
```
分析一下：
```
let x, { x: y = 1 } = { x }; y;
//  ↑       ↑           ↑    ↑
//  1       3           2    4
```
1. 我们定义了x，但并没有赋值，所以它为```undefined```
2. 之后，我们把x的值放到对象中，作为键值
3. 之后我们通过解构提取x的值，并把它赋值给y。如果未定义该值，那么我们将使用1作为默认值。
4. 返回y

## Dots and spreading
有趣的例子可以由阵列的扩展组成。考虑这个：
```
[...[...'...']].length // -> 3
```
为什么是3？当我们使用```...```扩展操作符时，调用@@ iterator方法，并使用返回的迭代器来获取要迭代的值。字符串的默认迭代器将字符串扩展为字符；扩展后，我们将这些字符打包成一个数组。

一个```'...'```字符串由三个字符组成，所以生成的数组的长度是3。

现在我们来分步去看：
```
[...'...']             // -> [ '.', '.', '.' ]
[...[...'...']]        // -> [ '.', '.', '.' ]
[...[...'...']].length // -> 3
```
显然，我们可以像我们想要的那样扩展和包装数组的元素：
```
[...'...']                 // -> [ '.', '.', '.' ]
[...[...'...']]            // -> [ '.', '.', '.' ]
[...[...[...'...']]]       // -> [ '.', '.', '.' ]
[...[...[...[...'...']]]]  // -> [ '.', '.', '.' ]
```
## 标签
很多程序员都不知道javaScript的标签：
```
foo: {
  console.log('first');
  break foo;
  console.log('second');
}

// > first
// -> undefined
```
带标签的语句与break或continue语句一起使用。您可以使用标签来标识循环，然后使用break或continue语句来指示程序是否应该中断循环或继续执行循环。

在上面的例子中，我们确定了一个标签foo。之后的```console.log（'first'）```;执行，然后中断执行。
## 嵌套标签
```
a: b: c: d: e: f: g: 1, 2, 3, 4, 5; // -> 5
```
[关于label](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/label)
## 阴险的try...catch
看下这个表达式将返回什么？  
```
(() => {
  try {
    return 2;
  } finally {
    return 3;
  }
})()
```
答案是3
> 如果从finally块中返回一个值，那么这个值将会成为整个try-catch-finally的返回值，无论是否有return语句在try和catch中。这包括在catch块里抛出的异常。

## 这是多重继承？
看下下面的例子
```
new (class F extends (String, Array) { }) // -> F []
```
这并不是多重继承。有趣的部分是extends子句```((Stirng,Array))```的值。分组运算符总是返回其最后一个参数，所以（String，Array）实际上只是Array。这意味着我们刚刚创建了一个扩展Array的类。
## A generator which yields itself
考虑下面的例子
```
(function* f() { yield f })().next()
// -> { value: [GeneratorFunction: f], done: false }
```
如您所见，返回的值永远是一个值等于f的对象。在这种情况下，我们可以这样做：
```
(function* f() { yield f })().next().value().next()
// -> { value: [GeneratorFunction: f], done: false }

// and again
(function* f() { yield f })().next().value().next().value().next()
// -> { value: [GeneratorFunction: f], done: false }

// and again
(function* f() { yield f })().next().value().next().value().next().value().next()
// -> { value: [GeneratorFunction: f], done: false }
```
## A class of class
考虑这个模糊的语法
```
(typeof (new (class { class () {} }))) // -> 'object'
```
我们正在类中声明一个类。应该会报错，但是，我们得到字符串“对象”。

这是由于在ES5时代，关键字允许作为对象的属性名。看一下这个简单的例子：
```
const foo = {
  class: function() {}
};
```
和ES6的缩写定义。并且，类可以是匿名的。如果我们不使用```function```部分，我们将得到：
```
class {
  class() {}
}
```
默认类的结果总是一个简单的对象。它的typeof应该返回'object'。
## 不能强制转换的对象
```
function nonCoercible(val) {
  if (val == null) {
    throw TypeError('nonCoercible should not be called with null or undefined')
  }

  const res = Object(val)

  res[Symbol.toPrimitive] = () => {
    throw TypeError('Trying to coerce non-coercible object')
  }

  return res
}
```
我们可以像这样使用它：
```
// objects
const foo = nonCoercible({foo: 'foo'})

foo * 10      // -> TypeError: Trying to coerce non-coercible object
foo + 'evil'  // -> TypeError: Trying to coerce non-coercible object

// strings
const bar = nonCoercible('bar')

bar + '1'                 // -> TypeError: Trying to coerce non-coercible object
bar.toString() + 1        // -> bar1
bar === 'bar'             // -> false
bar.toString() === 'bar'  // -> true
bar == 'bar'              // -> TypeError: Trying to coerce non-coercible object

// numbers
const baz = nonCoercible(1)

baz == 1             // -> TypeError: Trying to coerce non-coercible object
baz === 1            // -> false
baz.valueOf() === 1  // -> true
```
[不明白Symbol的建议阅读这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
## Tricky arrow functions
看一下下面的例子：
```
let f = () => 10
f() // -> 10
```
ok,那下面这个呢
```
let f = () => {}
f() // -> undefined
```
你可能希望返回的是```{}```而不是```undefined``` 这是因为大括号是箭头函数语法的一部分，所以f将返回undefined。
## Tricky return
return语句也很棘手。考虑这个：
```
(function () {
  return
  {
    b : 10
  }
})() // -> undefined
```
这是因为return和返回的表达式必须在同一行，下面为正确的操作：
```
(function () {
  return {
    b : 10
  }
})() // -> { b: 10 }
```
## 使用数组访问对象属性
```
var obj = { property: 1 }
var array = ['property']

obj[array] // -> 1
```
那么伪多维数组呢？
```
var map = {}
var x = 1
var y = 2
var z = 3

map[[x, y, z]] = true
map[[x + 10, y, z]] = true

map["1,2,3"]  // -> true
map["11,2,3"] // -> true
```
这是因为```[]```操作符通过```toString```转换表达式。将单元素数组转换为字符串，就像将元素转换为字符串一样
```
['property'].toString() // -> 'property'
```
## 一些有趣的链接
[What the... JavaScript? ](https://www.youtube.com/watch?v=2pL28CcEijU)

[Wat](https://www.destroyallsoftware.com/talks/wat)