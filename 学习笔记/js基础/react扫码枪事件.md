## 触发原理
原理就是监听键盘输入，比如扫一个为`6970596130126`的69条形码，用扫码枪扫一下会在光标位置依次输出：
```
6
9
7
0
5
9
6
1
3
0
2
6
```
但这不是完整的，所以需要写一个函数`scanEvent`来整理收集到的每个编号。
```js
let code = '';
let lastTime,
    nextTime,
    lastCode,
    nextCode;


function scanEvent(e, cb) {
    nextCode = e.which;
    nextTime = new Date().getTime();

    if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
        code += String.fromCharCode(lastCode);
    } else if (lastCode != null && lastTime != null && nextTime - lastTime > 100) {
        code = '';
    }

    lastCode = nextCode;
    lastTime = nextTime;
    if (e.which === 13) {
        cb(code);
        console.log('code', code);
        code = '';
    }
}

export { scanEvent };
```
## react中的坑
当我们想在`willComponentUnMount`阶段移除监听器时，需要传递函数名，否则无法移除！！这是非常值得注意的一点。
### 完整使用
```js
class Sample extends React.Component{
    componentDidMount(){
        window.addEventListener('keypress', this.scanWrapper, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.scanWrapper, false);
    }

    scanWrapper(e) {
        scanEvent(e, (code) => {
            // to do something...
        });
    }
}
```