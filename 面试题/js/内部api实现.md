## 实现deepclone
以下是比较简陋的版本，更简陋的版本是`JSON.parse(JSON.stringify(...))`
```js
const typeString = (item) => Object.prototype.toString.call(item).slice(8, -1)

const deepClone = (target) => {
    let result, targetType = typeString(target)
    if (targetType === 'Object') {
        result = {}
    } else if (targetType === 'Array') {
        result = []
    } else {
        return target
    }
    for (let i in target) {
        const value = target[i]
        const valueType = typeString(value)
        if (valueType === 'Object' || valueType === 'Array') {
            result[i] = deepClone(value)
        } else {
            result[i] = value
        }
    }
    return result
}

function person(pname) {
  this.name = pname;
}
const Messi = new person('Messi');
function say() {
  console.log('hi');
}
const obj = {
    a: [1, { x: 2 }, 3],
    b: 'hello',
    c: { x: 1, y: [2, 3, 4] },
    d: new RegExp(),
    e: new Date(),
    f:say
}

console.log(deepClone(obj))
```
## Promise
首先，promsie又三个状态：`pending`,`resolved`,`rejectd`。
基本的调用方法是：
```js
const p=new Promise((reslove,reject)=>{
    if(...){
        resolve(successData)
    }
    reject(error)
})

p.then((successData)=>{
    // resolve
}).catch((error)=>{
    // reject
})  
```