最近在项目中遇到一个问题，就是需要在类的外部调用类中的方法。

举个例子，我有一个`Toast`组件，在外部需要调用它的`show`方法来控制他的显隐状态。
之前我的写法是写一个静态类方法，然后在`constructor`中去修改它的作用域，代码如下：
```js
// @flow
import React from 'react';
import './style.less';

type Props={
    time:number,
    text:string,
}

export default class Toast extends React.Component {
    static show({ text }) {
        const _self = this;
        this.setState({
            isShow: true,
            text,
        }, () => {
            _self.timer = setTimeout(() => {
                this.setState({
                    isShow: false,
                });
            }, this.props.time);
        });
    }

    constructor(props:Props) {
        super(props);
        this.state = {
            isShow: false,
            text: '',
        };
        Toast.show = Toast.show.bind(this);
    }

    componentWillUnmount() {
        this.setState({
            isShow: false,
        });
        clearInterval(this.timer);
    }

    render() {
        const { isShow, text } = this.state;
        return (
            <div className="toast-wrapper">
                {isShow && <div className="toast">{text}</div>}
            </div>
        );
    }
}
```
后来发现bug频出，只有在重新刷新的时候`show`方法中调用`this.setState()`才有效，而在多个页面使用这个组件会出现很多问题，都是由于作用域绑定错误的原因。
## 解决方法
最后审视了下代码，应该是将静态的show方法指向内部的`show`方法，而不是把静态的`show`方法的上下文绑定到这个类上。

调整代码如下：
```js
// ...
 constructor(props:Props) {
        super(props);
        this.state = {
            isShow: false,
            text: '',
        };
        Toast.show = this.show.bind(this); // 最重要的一步！！
    }

    show({ text }) {
        const _self = this;
        this.setState({
            isShow: true,
            text,
        }, () => {
            _self.timer = setTimeout(() => {
                this.setState({
                    isShow: false,
                });
            }, this.props.time);
        });
    }
// ....
```