## 需求
检查服务端口是否被占用，占用则递归查找未被占用的端口号，找到返回端口号。
## node api
### net.Server 类
#### net.createServer([options][, connectionListener])
创建一个新的TCP或IPC服务。
#### server.close([callback])
停止 server接受建立新的connections并保持已经存在的connections.此功能是异步的,当所有的connections关闭同时server响应 'close'事件的时候,server将会最终关闭. 一旦'close'发生将会调用可选的回调函数. 与该事件不同, 如果服务器在关闭时未打开，则将使用错误作为唯一参数。
#### listening事件/error事件
调用` server.on`监听。listening服务成功绑定后调用`server.listen()`；error回调返回错误信息。
## 用回调函数实现
```js
function portIsOccupied (port,cb=(err,port)=>{}){
    const server=net.createServer().listen(port)
        server.on('listening',()=>{
            console.log(`the server is running on port ${port}`)
            server.close()
            cb(null,port)
            console.log('port',port)
        })
    
        server.on('error',(err)=>{
            if(err.code==='EADDRINUSE'){
                portIsOccupied(port+1,cb)
                console.log(`this port ${port} is occupied.try another.`)
            }else{
                cb(err)
            }
        })
     
}
```
调用方法
```js
  portIsOccupied(3000,(err,port)=>{
    app.listen(port,()=>{
        console.log(`start http://localhost:${port}`)
        c.exec(`start http://localhost:${port}`)
    })
  })
```

## promise实现
```js
const net=require('net')
 
function portIsOccupied (port){
    const server=net.createServer().listen(port)
    return new Promise((resolve,reject)=>{
        server.on('listening',()=>{
            console.log(`the server is runnint on port ${port}`)
            server.close()
            resolve(port)
        })
    
        server.on('error',(err)=>{
            if(err.code==='EADDRINUSE'){
                resolve(portIsOccupied(port+1))//注意这句，如占用端口号+1
                console.log(`this port ${port} is occupied.try another.`)
            }else{
                reject(err)
            }
        })
    })
    
}

module.exports=portIsOccupied
```

### 调用方法

```js
const c = require('child_process');
const express=require('express')
const app=express()
...
portIsOccupied(3000)
.then(port=>{
    app.listen(port,()=>{
        console.log(`start http://localhost:${port}`)
        c.exec(`start http://localhost:${port}`)
    })
  })
```
### 用async/await调用
```js
  async function startApp(){
      try{
        const port=await portIsOccupied(3000)
        app.listen(port,()=>{
            console.log(`start http://localhost:${port}`)
            c.exec(`start http://localhost:${port}`)
        })
      }catch(err){
        console.error(err)
      }
  }

  startApp()
```