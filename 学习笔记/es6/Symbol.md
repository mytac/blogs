## 介绍
ES6新增加的原始数据类型```Symbol```，它不能用```new```创建实例，因为他和```undefined```、```null```一样都是原始数据类型。

```Symbol``` 表示独一无二的值，即使传入相同参数的两个Symbol，他们也不是等价的：

```js
Symbol(1)==Symbol(1) //false
Symbol(1)===Symbol(1) //false
```
## 转换
```Symbol``` 不会被隐式转换为数字或字符串
```js
1+Symbol('1') //Uncaught TypeError: Cannot convert a Symbol value to a number
'1'+Symbol('1') // Uncaught TypeError: Cannot convert a Symbol value to a string
```
但是可以通过调用方法进行显式转换
```js
Symbol('1').toString() // -> "Symbol(1)"  转字符串
!Symbol('1') // -> false 转布尔值

/*但是不能转为数值*/
Number(Symbol('1')) // -> VM1652:1 Uncaught TypeError: Cannot convert a Symbol value to a number
```
## 基本使用
### 作为对象的键名
在我们为对象扩充属性时，经常会不小心覆盖之前的属性，由于```Symbol```的唯一性，我们可以用Symbol作为键名使用：
```js
const name=Symbol()
const people={}
/*务必这样创建属性，如果写为people.name则会吧name解析为字符串，相当于people['name']*/
people[name]='tom' 
console.log(people.name) // => undefined 这里其实是在访问people['name']
console.log(people[name]) // 'tom'
```
用Symbol创建的属性不会被遍历到，有一个```Object.getOwnPropertySymbols```方法，可以获得指定对象的所有Symbol属性名。
```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

const objectSymbols = Object.getOwnPropertySymbols(obj);
console.log(objectSymbols) // => [Symbol(a), Symbol(b)]
```
## 重用
使用```Symbol.for()```可以重用同一个Symbol值，并注册到全局环境以便搜索。
```js
// 搜索标记为foo的Symbol，没有则创建
const s1 = Symbol.for('foo');
const s2 = Symbol.for('foo');

s1 === s2 // true
```
## 查询登记名称
使用```Symbol.keyFor```查询Symbol注册名称。
```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```
