> refs提供了可以在`render`方法中访问dom节点和创建的react元素的方法。

在典型的react数据流中，props是父子组件通信的唯一方式，要修改子组件，需要新`props`重新渲染。然而有一些情况需要在数据流外修改子组件。
## 何时使用Refs
1. 管理focus，文本选择和媒体播放
2. 触发命令式动画
3. 集成第三方dom库

## 避免过度使用
你的第一反应时用`refs`在app中“搞点事情”，如果是这样，请多加时间考虑组件的层次中应该需要哪些`state`。通常情况下，用到`state`的地方应在更高层次（意思是在更外面的父组件中）。
## 创建Refs
使用`React.createRef()`创建Refs，并通过`ref`属性关联到react组件中。当组件被构造时，Refs通常被分配给一个实例属性，以便它们可以在整个组件中被引用。
```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }

```
## 访问refs
当ref被传递给render中的元素时，对ref的当前属性可以访问该节点的引用。
```
const node = this.myRef.current;
```
refs的值根据节点类型而有所不同：
1. 当ref属性应用在html元素上时，在构造函数中使用React.createRef（）创建的ref接收底层DOM元素作为其当前属性。
2. 当ref属性应用在自定义的类组件上时，ref对象接受挂载组件作为当前值。
3. *不能*在function构造的组件中使用ref属性，因为他们没有实例

下面的例子中演示了不同的例子：
### 1.在dom元素上添加ref
此代码使用ref来存储对DOM节点的引用：
```js
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // 创建一个ref来存储textInput DOM元素
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // 使用原始DOM API显式地关注文本输入
    // 注意：我们访问“current”来获取DOM节点
    this.textInput.current.focus();
  }

  render() {
    // 告诉React，我们想要将我们在构造函数中创建的<input> ref与“textInput”关联
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />

        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```
React将在组件装载时为当前属性分配DOM元素，并在卸载时将其分配回null。ref更新发生在`componentDidMount`或`componentDidUpdate`生命周期挂钩之前。
### 2.添加refs到类组件上
如果我们想要封装上面的`CustomTextInput`以模拟在组件挂载后立即点击它，我们可以使用ref来访问自定义的input并手动调用其`focusTextInput`方法。
```js
// 注意他只在类组件上工作
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```
### 3.refs和function组件
不能在function组件上使用refs，因为他们没有实例
```js
function MyFunctionalComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // This will *not* work!
    return (
      <MyFunctionalComponent ref={this.textInput} />
    );
  }
}
```
如果你需要，可以把它转换成类组件。

但是，只要引用DOM元素或类组件，就可以在functional组件中使用ref属性：
```js
function CustomTextInput(props) {
  // textInput 必须在这里声明，目的是让ref引用他
  let textInput = React.createRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />

      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```
## 将dom refs暴露给父组件
在某些情况下，你可能想从父组件访问子组件的dom节点。这通常是不推荐的，因为它会破坏组件封装，但它有时会对触发焦点或计算子DOM节点的大小或位置有用。

虽然你能把refs添加到子组件上，但这这并不是一个理想的结果，因为只会得到一个组件实例而不是dom节点。另外，它也不会对functional component起到作用。

一些情况下我们推荐暴露一个特别的prop给子组件。这个prop可以命名为ref(e.g inputRef)。子组件可以把这个ref转发到dom节点作为ref属性。这让父节点通过中间的组件将其ref传递给子节点节点。

这适用于类，也适用于functional组件。
```js
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}
```
在上面的例子中，父类通过它的类属性`this.inputElement`作为一个prop传递到CustomTextInput子组件中，CustomTextInput将相同的ref传递给`<input>`。因此，父组件中的` this.inputElement.current`会被设置为对应于`CustomTextInput`中的dom节点。

注意上例中的` inputRef`并没有什么特别的意义，他只是一个普通的prop而已。然而，在`<input>`中使用`ref`属性是非常重要的，他会告诉如何将ref添加到`<input>`的dom节点。

即使CustomTextInput是一个functional组件，他也可以工作。与ref只能为dom元素和class组件的特殊属性这一点不同，`prop`没有限制。

这种模式的另一个好处是它可以深入地处理多个组件。比如，父组件中不需要dom节点，但在父组件的父组件（以下称为祖父组建）中需要访问他。然后，我们可以让祖父组件为父组件提供`inputRef`prop，并使父组件传递给`CustomTextInput`。
```js
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

function Parent(props) {
  return (
    <div>
      My input: <CustomTextInput inputRef={props.inputRef} />
    </div>
  );
}

class Grandparent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <Parent inputRef={this.inputElement} />
    );
  }
}
```
这里，祖父组件首先指定ref为`this.inputElement`，他作为一个正常的prop传递给`inputRef`，之后父组件又把他作为prop传递给`CustomTextInput`。最终，CustomTextInput读取inputRef prop 并将传递的ref作为ref属性附加到`<input>`。因此，祖父组件中的`this.inputElement.current`将被设置为与`CustomTextInput`中`<input>`元素对应的DOM节点。

如果可能，我们建议不要暴露dom节点，但他可能是一个有用的应急出口？？（这句不太明白，原文：When possible, we advise against exposing DOM nodes, but it can be a useful escape hatch. ）请注意，这种方法需要您向子组件添加一些代码。如果你完全不能控制子组件的实现，你最终的选择是`findDOMNode()`，但并不推荐这个方法。

## refs回调
react也会支持另一种方式来设置`refs`，这称为`callback refs`，它可以在设置refs和取消设置时能更好的控制细节。

您不必传递由createRef（）创建的ref属性，而是传递一个函数。该函数接收React组件实例或HTML DOM元素作为其参数，可以在其他地方存储和访问它。下面的示例实现了一个通用模式：使用ref回调来存储对实例属性中DOM节点的引用。
```js
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```
react将会在组件挂载时调用带有dom元素的回调，当他卸载时他为空。`ref`回调在`componentDidMount`或`componentDidUpdate`之前被调用。

可以在组件之间传递回调refs，就像您可以使用由该元素创建的对象refs一样。
```
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```
在上面的例子中，父组件通过传递他的refs作为inputRef prop给CustomTextInput，CustomTextInput传递相同的函数给`<input>`，因此这个父组件`this.inputElement `将会为对应`CustomTextInput`中元素的节点中。

## 回调refs的警告
如果ref回调被定义为一个内联函数，那么它将在更新期间被调用两次，首先是null，然后是DOM元素。这是因为函数的一个新实例是在每次渲染时创建的，因此react需要清除旧的ref，并设置新的ref。您可以通过将ref回调定义为类上的绑定方法来避免这种情况，但是请注意，在大多数情况下它都不重要。

## 参考文档
1. [Refs and the DOM](https://reactjs.org/docs/refs-and-the-dom.html)