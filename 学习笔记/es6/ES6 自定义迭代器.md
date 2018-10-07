## 构造自定义迭代器
字符串和数组类型都有自身的迭代器，而对于不可枚举的数据类型，可以为其添加`[Symbol.iterator]`属性，来创建迭代器。

一个iterable的必要组成：
```
1.返回一个对象，该对象有迭代器属性[Symbol.iterator]指向自身
2.自定义next()函数，返回IteratorResult,done为false
3.自定义return()函数，返回IteratorResult,done为true
```
参考以下两个例子：
## 无限的斐波那契数列
经常刷算法题的同学都晓得斐波那契数列，他的规律非常简单就是`F(n-1)+F(n-2)=F(n)`，两个初始值均为1。

```js
const Fib={
    [Symbol.iterator](){
        let n1=1,n2=1;
        return{
            // 使迭代器成为iterable
            [Symbol.iterator](){return this},

            next(){
                let current=n2
                n2=n1
                n1=n1+current
                return {value:current,done:false}
            },

            return(v){
                console.log('stop')
                return {value:v,done:true}
            }
        }
    }
}

for(let i of Fib){
    console.log(i)

    if(i>50) break;
}

// 1 1 2 3 5 8...55
// stop
```
## 任务队列迭代
我们可以自定义一个任务迭代器，用来依次执行一系列的动作
```js
const tasks = {
    [Symbol.iterator]() {
        let steps = this.actions.slice()
        return {
            // 使迭代器成为iterable
            [Symbol.iterator]() { return this },

            next(...args) {
                if (steps.length > 0) {
                    let res = steps.shift()(...args)
                    console.log(res)
                    return { value: res, done: false }
                } else {
                    return { done: true }
                }
            },

            return(v) {
                steps.length = 0
                return { value: v, done: true }
            }
        }
    },
    actions: []
}

```
他的使用方法是，需要先将任务函数放入actions中，然后将所需参数传入，执行迭代器，
```js
tasks.actions.push(
    function step1(x) { console.log('step1: ', x); return x * 2 },
    function step2(x, y) { console.log('step2: ', y); return x + y * 2 },
    function step3(x, y, z) { console.log('step3: ', z); return x * y + z },
)

const it=tasks[Symbol.iterator]()
it.next(10) // step1:  10
// 20
it.next(20,50) // step2:  50
// 120
it.next(20,50,120) // step3:120
// 1120
it.next()
```
## 迭代器消耗
除了手动调用迭代器和`for...of`方法以外，还有spread运算符...也可以完全消耗迭代器。
### ...rest/gather
```js
const a=[1,2,3,4,5]
function foo(a,b,c,d,e){
    return a+b+c+d+e
}
console.log(foo(...a))
```
数组解构可以部分/完全消耗一个迭代器。
```js
const a=[1,2,3,4,5]
function foo(a,b,c,d,e){
    return a+b+c+d+e
}
const it=a[Symbol.iterator]()
const [...x]=it
it.next()  // {value: undefined, done: true} it已经完全耗尽
```