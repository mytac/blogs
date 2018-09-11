## 前言
最近在读《你不知道的js》下册，看到了关于`标签模板字面量`的内容，之前没遇见过，所以不懂就要写博客记录下来啊~

## 基础示例
```js
function foo(strings,...values){
	console.log(strings)
	console.log(values)
}
const desc='awesome'
foo`Everything is ${desc}!]`;
// ["Everything is ","!"]
// ["awesome"]
```
在`foo`函数中`strings`是一个由所有普通字符串（插入表达式之间的部分）组成的数组。使用`...gather/rest`运算符，把所有参数值都收集到`values`中。

换一种说法也就是，values中的值是分隔符，就好像用它们连接了strings中的值，然后把他们都连接在一起，就得到了一个完整的字符串。
## 应用
上面的基础示例不能展现`标签模板字面量`的强大之处。一般情况，字符串字面量标签函数（上个示例中的`foo`）要计算出一个字符串并将其返回。
### 把目标字符串中的数值格式化为美元
```js
function format(strings,...values){
    return strings.reduce((s,v,idx)=>{
        if(idx>0){
            const prev=values[idx-1]
            if(typeof prev==='number'){
                s+=`$${prev.toFixed(2)}`
            }else{
                s+=prev
            }
        }
        return s+v
    },'')

}

const item='orange'
const price=3.5554

const text=format`the ${item}'s price is ${price}`
console.log(text)
// the orange's price is $3.56
```
### 过滤HTML字符串，防止用户输入恶意内容
 大部分的网站都提供有评论模块以供用户发表自己的观点，一般防止用户恶意输入，如`<script>alert('恶意代码')</script>`，都会把`<`替换为` &lt;`；把`>`替换为` &gt;`。

 ```js
function filterSpitefulCode(strings,...values){
    return strings.reduce((s,v,idx)=>{
        if(idx>0){
            const prev=values[idx-1].replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            s+=prev
        }
        return s+v
    },'')
}

const badCode= '<script>alert("abc")</script>'
const message=filterSpitefulCode`<p>${badCode} has been transformed safely~`

console.log(message)
// <p>&lt;script&gt;alert("abc")&lt;/script&gt; has been transformed safely~
 ```
 ### 原始字符串
 在上面的代码中，标签函数接受第一个名为strings的参数，这是一个数组，也包括了一些额外的数据：所有字符串的原始未处理版本。可以像下面通过`.raw`属性访问这些原始字符串：
 ```js
 function showraw(strings,...values){
     console.log(strings.raw)
 }

 showraw`Hello\nWorld`
 // ["Hello\nWorld"]
 console.log(`Hello\nWorld`)
 // Hello
 // World
 ```
 原始版本的值保留了原始的转义码`\n`序列，而处理过的版本把它当作是一个单独的换行符。
 ## 参考链接
 1. [ES6 标签模板](https://www.cnblogs.com/sminocence/p/6832331.html)