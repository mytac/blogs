## 文本处理
1. [forgJs -- ForgJs是一个javascript轻量级对象验证器。去查看快速入门部分并开始用爱编码](https://github.com/oussamahamdaoui/forgJs)
```js
  const { Validator, Rule } = require('@cesium133/forgjs');
  
  const vComplexe = new Validator({
    age: new Rule({ type: 'int', min: 18, max: 99 }),
    dateOfBirth: new Rule({ type: 'date' }),
    array: new Rule({ type: 'array', of: new Rule({ type: 'string' }) }),
  });

  vComplexe.test({
    age: 26,
    dateOfBirth: new Date(1995, 10, 3),
    array: ['1'],
  }); /// returns true
  ```