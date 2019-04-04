## 前言
我自己用`redux`差不多两年了，然而只是停留在“会用”和“表面理解”这个阶段，后来有人问我flux和redux对比，两者分别有什么区别，自己真的是答不出来。所以写出此篇文章，来终结自己的不求甚解吧！
## flux
![demo](https://www.jdon.com/simgs/course/flux2.png)
### 联想
结合上图和flux的各个模块名，会发现flux很像外卖的模式。`action`相当于你从外卖app上下餐的指令，`dispatcher`是外卖平台，`store`是商家，`view`可以想象成是你自己，即发起订餐和接收餐品的角色。
```
【action】 相当于外卖订单。他有一个actiontype（可以联想为唯一的订单编号），和其他信息（比如菜品、备注、电话等等等）。

【dispatcher】和外卖平台一样，通过你的订单编号，找到订单具体的信息，再派发给商家，让他。

【store】  程序中可以表现为纯Object，或者是Immutable对象（不深究，毕竟flux是一种思想），可以想象是卖了一份餐商家就改变库存。（这里与redux不同，redux是只有一个store）

【controller-view】 顶层的view，比如你帮你同事订餐，外卖小哥给你打电话，你负责把餐品分发给其他同事(下层的view)。
```
### 简单的示例
这个示例来源于facebook/flux中`Dispatcher.js`中的注释部分，比起上面的类比要更直观和准确。[=>完整源码，示例从第31行开始](https://github.com/facebook/flux/blob/master/src/Dispatcher.js)

场景是这样的：有一个需要填写航班目的地的表单，当你选择一个国家的时候，选择默认的城市。

1. 初始化，创建dispatcher和store
```js
var flightDispatcher = new Dispatcher();
var CountryStore = {country: null};
var CityStore = {city: null};
var FlightPriceStore = {price: null}
```
2. dispatcher注册回调，修改store
```js
flightDispatcher.register(function(payload) {
      if (payload.actionType === 'city-update') {
        CityStore.city = payload.selectedCity;
      }
    });
```
3. dispatcher派发action
```js
flightDispatcher.dispatch({
      actionType: 'city-update',
      selectedCity: 'paris'
    });
```
4. 等待执行。
```js
CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
      if (payload.actionType === 'country-update') {
        CountryStore.country = payload.selectedCountry;
      }
});

CityStore.dispatchToken = flightDispatcher.register(function(payload) {
      if (payload.actionType === 'country-update') {
        // `CountryStore.country` may not be updated.
        flightDispatcher.waitFor([CountryStore.dispatchToken]);
        // `CountryStore.country` is now guaranteed to be updated.
 
        // Select the default city for the new country
        CityStore.city = getDefaultCityForCountry(CountryStore.country);
     }
    });
 ```
在`dispatch({actionType: 'city-update',selectedCountry: 'beijing'})`时，`CountryStore`和`CityStore`两个store都注册了type为`country-update`的action。如果其中store A中的更新需要依赖于store B，就必须得保证store B先更新之后，再执行store A的更新。所以引入了`waitFor`，等待`CountryStore`更新完成之后，才会更新`CityStore.city`。
## Redux
## 推荐文章
1. [Flux源码解析（一）](http://satanwoo.github.io/2015/09/23/flux-js-part-one/)
2. [facebook-flux-In Depth Overview](https://facebook.github.io/flux/docs/in-depth-overview.html#content)
