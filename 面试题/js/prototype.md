## 1.`prototype` 和 `__proto__` 的关系是什么？
`prototype`是只有函数才会有的属性；而`__proto__`是所有对象都有的属性。

几乎所有的函数都有一个prototype属性.

对于
```js
function Foo(){}
const foo=new Foo()
```

```js
Foo.prototype===foo.__proto__ //true
```
图例

![demo](https://pic.xiaohuochai.site/blog/JS_ECMA_grammer_proto.png)

## 参考文档

