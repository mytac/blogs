## 扩展组件

1. collapse toogle 条

项目中有一个时间线组件，新需求是要根据 type 加 togglebar，把这个组件进行折叠或展示。如果在原组件基础上进行改动，代码可读性和维护性都变差了，而 react 现在更推崇函数式编程，而函数式编程的一个核心思想就是，一个函数只干一种事，只处理一项工作。

所以 hoc 非常好的解决了这个问题，我们用`withCollapse`, 这个高阶函数来处理这个问题。

```jsx
export default function withCollapse(WrappedComponent) {
  return function(props) {
    const { showHead, showFoot, collapse = false } = props;
    const [visible, onVisible] = useState(false);
    const onHeaderClick = () => onVisible(!visible);
    const onFooterClick = () => {};

    return collapse ? (
      <div className="collapse">
        {showHead && (
          <div className="collapseHeader" onClick={onHeaderClick}>
            <HeadComponent name="钟南山" description="dsdwas" />
          </div>
        )}
        {visible && <WrappedComponent {...props} />}
        {showFoot && visible && (
          <div className="collapseFooter" onClick={onFooterClick}>
            <FooterComponent />
          </div>
        )}
      </div>
    ) : (
      <WrappedComponent {...props} />
    );
  };
}
```
