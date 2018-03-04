# 准备阶段
1. 需要一个rn项目，这里演示的是我个人的项目[ReactNative-ReduxSaga-TODO](https://github.com/mytac/ReactNative-ReduxSaga-TODO)
2. 安装jest
如果你是用```react-native init```命令行创建的rn项目，并且你的rn版本在0.38以上，则无需安装了。不太清楚的话就看一下```package.json```文件中是否包含以下代码：
```json
    // package.json
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "preset": "react-native"
  }
```
如果没有就安装一下```npm i jest --save-dev```，并把上述代码添加到```package.json```文件的对应位置。
3. 以上步骤完成后，简单运行```npm run test```测试一下jest是否配置成功。但我们没有写测试用例，终端会打印```no tests found```。这时就配置完成了。

# 快照测试
写一个组件
```jsx
import React from 'react';
import {
  Text, View,
} from 'react-native';

import PropTypes from 'prop-types';

const PostArea = ({ title, text, color }) => (
  <View style={{ backgroundColor: '#ddd', height: 100 }}>
    <Text style={{ fontSize: 30 }}>{title}</Text>
    <Text style={{ fontSize: 15, color }}>{text}</Text>
  </View>
);

export default PostArea;
```
在项目根目录下找到```__test__```文件夹，现在，让我们使用React的测试渲染器和Jest的快照功能来与组件进行交互，并捕获呈现的输出并创建一个快照文件。
```js
// PostArea_test.js
import 'react-native';
import React from 'react';
import PostArea from '../js/Twitter/PostArea';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<PostArea title="title" text="text" color="red" />).toJSON();
  expect(tree).toMatchSnapshot();
});
```
然后在终端运行```npm run test```或```jest```。将会输出：
```
PASS  __tests__\PostArea_test.js (6.657s)
  √ renders correctly (5553ms)

 › 1 snapshot written.
Snapshot Summary
 › 1 snapshot written in 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   1 added, 1 total
Time:        8.198s
Ran all test suites.

```
同时，在__test__文件夹下会输出一个文件，即为生成的快照。
```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`renders correctly 1`] = `
<View
  style={
    Object {
      "backgroundColor": "#ddd",
      "height": 100,
    }
  }
>
  <Text
    accessible={true}
    allowFontScaling={true}
    disabled={false}
    ellipsizeMode="tail"
    style={
      Object {
        "fontSize": 30,
      }
    }
  >
    title
  </Text>
  <Text
    accessible={true}
    allowFontScaling={true}
    disabled={false}
    ellipsizeMode="tail"
    style={
      Object {
        "color": "red",
        "fontSize": 15,
      }
    }
  >
    text
  </Text>
</View>
`;

```
# 修改源文件
在下一次运行测试的时候，呈现的输出将与之前创建的快照进行比较。快照应该和代码一起提交。当快照测试失败的时候，就需要检查是否有意或无意的更改。如果是和预期中的变化一样，调用```jest -u```来覆盖当前的快照。

我们来更改一下原来的代码：把第二行```<Text>```的字号改为14.
```
<Text style={{ fontSize: 14, color }}>{text}</Text>
```
这时，我们再运行```jest```。这时终端将会抛出错误，并指出了错误位置
![img](http://chuantu.biz/t6/179/1513583288x-1404817411.png)。

因为这段代码是我们有意改的，这时运行```jest -u```，快照被覆盖。再执行```jest```则不会报错了~