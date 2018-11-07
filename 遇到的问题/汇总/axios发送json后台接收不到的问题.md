## 问题描述
按照[axios官网](https://github.com/axios/axios)例子发起请求传递json，后台接受到的数据为空，一直卡在options阶段。

## 尝试的方法
开始以为是接口有问题，使用postman测试下，一切正常，百思不得其解，看了好多issue也解决不了，加了`headers:{'content-type':'application/json'}`也没用。

官网上是说，传json就按`application/json`进行处理，然而并没有卵用；之后套了一层`JSON.stringify(data)`，`content-type`又变成表单格式了==。

然后翻自己之前的代码，发现写法如出一辙，怀疑是版本号的问题，然而并不是==。。。。考虑到可能和服务端有关系。

原代码如下：
```js
import axios from 'axios';

export default function request(url, params) {
    return axios.post(`xxxxxx/${url}`, params)
        .then((response) => {
            console.log('response', response);
            return response;
        })
        .catch((error) => {
            console.log('error', error);
            return error;
        });
}
```

最后想想还是用`fetch`吧（确实用了，发现还是有这个问题，现在深度怀疑是服务端将参数类型卡的太死了，还有polyfill的问题就放弃了，如果有知道的小伙伴请留言告诉我，谢谢），实在不行就`ajax`（还要封装成promise，哭）。出于对`axios`的坚持，终于找到了解决方法。
## 解决方法

就是添加`qs`库，将json序列化之后传递，详见这个[issue](https://github.com/axios/axios/issues/1195)。

代码：
```js
import axios from 'axios';
import qs from 'qs';

export default function request(url, params) {
    return axios.post(`https://xxxxxxxx/${url}`, qs.stringify(params))
        .then((response) => {
            console.log('response', response);
            return response;
        })
        .catch((error) => {
            console.log('error', error);
            return error;
        });
}
````