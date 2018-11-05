## 前言
在react alpha版本中，出现了几个新api，这可以让我们的组件 v16.7.0-alpha
## 原
```jsx
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      words: ''
    }
    this.keyFunc = this.keyFunc.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keypress', this.keyFunc)
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.keyFunc)
  }

  keyFunc(e) {
    this.setState(prev => ({
      words: prev.words + e.key
    }))
  }

  render() {
    const { words } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {words}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
```
## demo
![demo](https://s1.ax1x.com/2018/10/31/iRRRO0.gif)
## api
### useState
```js
const [state, setState] = useState(initialState);
```
### useEffect
```js
useEffect(didUpdate);
```


## 参考链接
1. [react-conf-2018](https://github.com/ryanflorence/react-conf-2018)
2. [youtube视频 -- 90% Cleaner React - Ryan Florence - React Conf 2018](https://www.youtube.com/watch?v=wXLf18DsV-I)
3. [react api-【userState】](https://reactjs.org/docs/hooks-reference.html#usestate)